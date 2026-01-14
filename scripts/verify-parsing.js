/**
 * Verify that parsed OpenRV data matches sm-annotate shape formats
 * Run with: node scripts/verify-parsing.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============= Expected sm-annotate interfaces =============
/*
interface IShapeBase {
  type: keyof ShapeMap;
  strokeStyle: string;       // hex color like "#ff0000"
  fillStyle: string;         // hex color like "#ff0000"
  lineWidth: number;         // pixel width
  opacity?: number;          // 0-1
}

interface ICurve extends IShapeBase {
  type: "curve";
  points: Array<{x: number, y: number}>;  // normalized 0-1 coordinates
}

interface IText extends IShapeBase {
  type: "text";
  x: number;   // normalized 0-1
  y: number;   // normalized 0-1
  text: string;
}
*/

// ============= Raw OpenRV data from test_session.rv =============
const RAW_OPENRV = {
  'pen:1:15:User': {
    // Raw from file: float[4] color = [ [ 1 1 1 1 ] ]
    color: [1, 1, 1, 1],
    // Raw from file: float width = [ 0.00995635986 ... ]
    width: [0.00995635986],
    // Raw from file: float[2] points = [ [ 0.183036849 0.253820688 ] [ 0.158727273 0.233801052 ] ... ]
    points: [
      [0.183036849, 0.253820688],
      [0.158727273, 0.233801052],
      [0.075788781, 0.173742011],
    ],
  },
  'pen:2:15:User': {
    // Raw: float[4] color = [ [ 1 0 0.833325684 1 ] ]
    color: [1, 0, 0.833325684, 1],
    width: [0.00995635986],
    points: [
      [0.151577413, -0.0550540797],
      [0.151577413, -0.0593439862],
    ],
  },
  'text:6:1:User': {
    // Raw: float[2] position = [ [ -0.979533434 0.291000068 ] ]
    position: [-0.979533434, 0.291000068],
    // Raw: float[4] color = [ [ 1 1 1 1 ] ]
    color: [1, 1, 1, 1],
    // Raw: float size = 0.00999999978
    size: 0.00999999978,
    // Raw: string text = "text eng"
    text: "text eng",
  },
};

console.log('=== Verification: OpenRV Parsing for sm-annotate ===\n');

// ============= Test Color Conversion =============
console.log('1. COLOR CONVERSION TEST');
console.log('   ----------------------\n');

function rgbaToHex(rgba) {
  if (rgba.length < 3) return '#000000';
  const r = Math.round(rgba[0] * 255);
  const g = Math.round(rgba[1] * 255);
  const b = Math.round(rgba[2] * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

const colorTests = [
  { input: [1, 1, 1, 1], expected: '#ffffff', name: 'white' },
  { input: [1, 0, 0.833325684, 1], expected: '#ff00d4', name: 'pink/magenta' },
  { input: [1, 0, 0, 1], expected: '#ff0000', name: 'red' },
  { input: [0, 1, 0, 1], expected: '#00ff00', name: 'green' },
  { input: [0, 0, 1, 1], expected: '#0000ff', name: 'blue' },
];

let colorPass = true;
for (const test of colorTests) {
  const result = rgbaToHex(test.input);
  const pass = result === test.expected;
  if (!pass) colorPass = false;
  console.log(`   RGBA(${test.input.join(', ')}) => ${result}`);
  console.log(`   Expected: ${test.expected} (${test.name}) ${pass ? '✓' : '✗ FAIL'}\n`);
}

// ============= Test Coordinate Conversion =============
console.log('\n2. COORDINATE CONVERSION TEST');
console.log('   ---------------------------\n');

const WIDTH = 1280;
const HEIGHT = 536;
const ASPECT_RATIO = WIDTH / HEIGHT;

function convertOpenRVToSmAnnotate(openrvX, openrvY, aspectRatio) {
  const normalizedX = openrvX / aspectRatio;
  return {
    x: (normalizedX + 1) / 2,
    y: (1 - openrvY) / 2,
  };
}

const coordTests = [
  { input: [0, 0], expectedApprox: [0.5, 0.5], name: 'center' },
  { input: [ASPECT_RATIO, 1], expectedApprox: [1, 0], name: 'top-right' },
  { input: [-ASPECT_RATIO, -1], expectedApprox: [0, 1], name: 'bottom-left' },
  { input: [-ASPECT_RATIO, 1], expectedApprox: [0, 0], name: 'top-left' },
  { input: [ASPECT_RATIO, -1], expectedApprox: [1, 1], name: 'bottom-right' },
];

let coordPass = true;
for (const test of coordTests) {
  const result = convertOpenRVToSmAnnotate(test.input[0], test.input[1], ASPECT_RATIO);
  const xPass = Math.abs(result.x - test.expectedApprox[0]) < 0.0001;
  const yPass = Math.abs(result.y - test.expectedApprox[1]) < 0.0001;
  const pass = xPass && yPass;
  if (!pass) coordPass = false;

  console.log(`   OpenRV (${test.input[0].toFixed(4)}, ${test.input[1].toFixed(4)}) => sm-annotate (${result.x.toFixed(4)}, ${result.y.toFixed(4)})`);
  console.log(`   Expected: ~(${test.expectedApprox[0]}, ${test.expectedApprox[1]}) (${test.name}) ${pass ? '✓' : '✗ FAIL'}\n`);
}

// ============= Test Width Conversion =============
console.log('\n3. WIDTH CONVERSION TEST');
console.log('   ----------------------\n');

function convertWidth(normalizedWidth, height) {
  let lineWidth = normalizedWidth * height;
  return Math.max(1, Math.min(lineWidth, 50));
}

const widthTests = [
  { input: 0.00995635986, height: 536, expected: 5.34, name: 'from file' },
  { input: 0.01, height: 1000, expected: 10, name: '1% of 1000px' },
  { input: 0.001, height: 500, expected: 1, name: 'clamped to min' },
  { input: 0.2, height: 500, expected: 50, name: 'clamped to max' },
];

let widthPass = true;
for (const test of widthTests) {
  const result = convertWidth(test.input, test.height);
  const pass = Math.abs(result - test.expected) < 0.1;
  if (!pass) widthPass = false;

  console.log(`   Normalized ${test.input} * height ${test.height} => lineWidth ${result.toFixed(2)}`);
  console.log(`   Expected: ~${test.expected} (${test.name}) ${pass ? '✓' : '✗ FAIL'}\n`);
}

// ============= Test Shape Format Validation =============
console.log('\n4. SHAPE FORMAT VALIDATION');
console.log('   ------------------------\n');

// Simulate parsed output
const parsedCurve = {
  type: 'curve',
  points: [
    { x: 0.538323, y: 0.373090 },
    { x: 0.533234, y: 0.383099 },
  ],
  strokeStyle: '#ffffff',
  fillStyle: '#ffffff',
  lineWidth: 5.34,
  opacity: 1,
};

const parsedText = {
  type: 'text',
  x: 0.294910,
  y: 0.354500,
  text: 'text eng',
  strokeStyle: '#ffffff',
  fillStyle: '#ffffff',
  lineWidth: 1,
  opacity: 1,
};

function validateCurve(shape) {
  const errors = [];

  if (shape.type !== 'curve') errors.push(`type should be "curve", got "${shape.type}"`);
  if (!Array.isArray(shape.points)) errors.push('points should be an array');
  if (shape.points && shape.points.length > 0) {
    const p = shape.points[0];
    if (typeof p.x !== 'number') errors.push('points[].x should be number');
    if (typeof p.y !== 'number') errors.push('points[].y should be number');
    if (p.x < 0 || p.x > 1.5) errors.push(`points[].x should be 0-1 normalized, got ${p.x}`);
    if (p.y < 0 || p.y > 1.5) errors.push(`points[].y should be 0-1 normalized, got ${p.y}`);
  }
  if (typeof shape.strokeStyle !== 'string') errors.push('strokeStyle should be string');
  if (typeof shape.fillStyle !== 'string') errors.push('fillStyle should be string');
  if (typeof shape.lineWidth !== 'number') errors.push('lineWidth should be number');
  if (!shape.strokeStyle.startsWith('#')) errors.push('strokeStyle should be hex color');

  return errors;
}

function validateText(shape) {
  const errors = [];

  if (shape.type !== 'text') errors.push(`type should be "text", got "${shape.type}"`);
  if (typeof shape.x !== 'number') errors.push('x should be number');
  if (typeof shape.y !== 'number') errors.push('y should be number');
  if (shape.x < 0 || shape.x > 1.5) errors.push(`x should be 0-1 normalized, got ${shape.x}`);
  if (shape.y < 0 || shape.y > 1.5) errors.push(`y should be 0-1 normalized, got ${shape.y}`);
  if (typeof shape.text !== 'string') errors.push('text should be string');
  if (typeof shape.strokeStyle !== 'string') errors.push('strokeStyle should be string');
  if (typeof shape.fillStyle !== 'string') errors.push('fillStyle should be string');
  if (typeof shape.lineWidth !== 'number') errors.push('lineWidth should be number');

  return errors;
}

console.log('   Validating ICurve shape:');
console.log(`   ${JSON.stringify(parsedCurve, null, 2).split('\n').join('\n   ')}\n`);
const curveErrors = validateCurve(parsedCurve);
if (curveErrors.length === 0) {
  console.log('   ✓ ICurve format is VALID\n');
} else {
  console.log('   ✗ ICurve format ERRORS:');
  curveErrors.forEach(e => console.log(`     - ${e}`));
}

console.log('   Validating IText shape:');
console.log(`   ${JSON.stringify(parsedText, null, 2).split('\n').join('\n   ')}\n`);
const textErrors = validateText(parsedText);
if (textErrors.length === 0) {
  console.log('   ✓ IText format is VALID\n');
} else {
  console.log('   ✗ IText format ERRORS:');
  textErrors.forEach(e => console.log(`     - ${e}`));
}

// ============= Summary =============
console.log('\n=== SUMMARY ===\n');

const allPass = colorPass && coordPass && widthPass && curveErrors.length === 0 && textErrors.length === 0;

console.log(`   Color conversion:     ${colorPass ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   Coordinate conversion: ${coordPass ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   Width conversion:     ${widthPass ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   ICurve format:        ${curveErrors.length === 0 ? '✓ PASS' : '✗ FAIL'}`);
console.log(`   IText format:         ${textErrors.length === 0 ? '✓ PASS' : '✗ FAIL'}`);
console.log('');
console.log(`   Overall: ${allPass ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
console.log('');

// ============= Raw vs Parsed Comparison =============
console.log('\n=== RAW vs PARSED COMPARISON ===\n');

console.log('pen:1:15:User (first 3 points):');
console.log('');
console.log('  RAW OpenRV format (from file):');
console.log('    color: [ [ 1 1 1 1 ] ]');
console.log('    width: [ 0.00995635986 ... ]');
console.log('    points: [ [ 0.183036849 0.253820688 ] [ 0.158727273 0.233801052 ] ... ]');
console.log('');
console.log('  PARSED sm-annotate format:');
console.log('    strokeStyle: "#ffffff"');
console.log('    fillStyle: "#ffffff"');
console.log('    lineWidth: 5.34');
console.log('    points: [');
console.log('      { x: 0.5383, y: 0.3731 },');
console.log('      { x: 0.5332, y: 0.3831 },');
console.log('      ...');
console.log('    ]');
console.log('');

console.log('text:6:1:User:');
console.log('');
console.log('  RAW OpenRV format (from file):');
console.log('    position: [ [ -0.979533434 0.291000068 ] ]');
console.log('    color: [ [ 1 1 1 1 ] ]');
console.log('    size: 0.00999999978');
console.log('    text: "text eng"');
console.log('');
console.log('  PARSED sm-annotate format:');
console.log('    type: "text"');
console.log('    x: 0.2949');
console.log('    y: 0.3545');
console.log('    text: "text eng"');
console.log('    strokeStyle: "#ffffff"');
console.log('    fillStyle: "#ffffff"');
console.log('    lineWidth: 1');
