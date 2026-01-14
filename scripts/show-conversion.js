/**
 * Script to show OpenRV coordinate conversion in detail
 * Run with: node scripts/show-conversion.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dimensions from the file
const WIDTH = 1280;
const HEIGHT = 536;
const ASPECT_RATIO = WIDTH / HEIGHT; // ~2.388

console.log('=== Coordinate System Explanation ===\n');
console.log(`Video dimensions: ${WIDTH}x${HEIGHT}`);
console.log(`Aspect ratio: ${ASPECT_RATIO.toFixed(4)}\n`);

console.log('OpenRV NDC (Normalized Device Coordinates):');
console.log('  - Origin at CENTER of image');
console.log('  - X ranges from -aspectRatio to +aspectRatio (left to right)');
console.log(`  - X range: ${(-ASPECT_RATIO).toFixed(4)} to ${ASPECT_RATIO.toFixed(4)}`);
console.log('  - Y ranges from -1 to +1 (bottom to top)');
console.log('');
console.log('sm-annotate coordinates:');
console.log('  - Origin at TOP-LEFT of image');
console.log('  - X ranges from 0 to 1 (left to right)');
console.log('  - Y ranges from 0 to 1 (top to bottom)');
console.log('');

console.log('=== Conversion Formula ===\n');
console.log('  sm_x = (openrv_x / aspectRatio + 1) / 2');
console.log('  sm_y = (1 - openrv_y) / 2');
console.log('');

// Conversion function
function convertOpenRVToSmAnnotate(openrvX, openrvY, aspectRatio) {
  const normalizedX = openrvX / aspectRatio;
  return {
    x: (normalizedX + 1) / 2,
    y: (1 - openrvY) / 2,
  };
}

// Raw data extracted from demo/test_session.rv
const rawData = {
  'pen:1:15:User': {
    color: [1, 1, 1, 1], // white
    points: [
      0.183036849, 0.253820688,
      0.158727273, 0.233801052,
      0.075788781, 0.173742011,
      0.0529091358, 0.116543047,
      0.0514791943, 0.0750737488,
      0.112968124, 0.0321744718,
      0.160157353, 0.0221646205,
      0.203056619, 0.0321744718,
      0.251675785, 0.0908034742,
      0.244525924, 0.126552835,
      0.183036849, 0.175172046,
      0.117257953, 0.232371077,
      0.107248217, 0.232371077,
      0.0986682773, 0.232371077,
      0.0986682773, 0.232371077,
    ],
  },
  'pen:2:15:User': {
    color: [1, 0, 0.833325684, 1], // pink/magenta
    points: [
      0.151577413, -0.0550540797,
      0.151577413, -0.0593439862,
      0.217356324, -0.0879435018,
      0.27312535, -0.10224326,
      0.284565151, -0.0893734694,
      0.294575036, -0.0650638938,
      0.30458492, -0.0536240749,
      0.308874756, -0.046474196,
      0.29886502, -0.0378943458,
      0.204486549, -0.0193046834,
      0.191616789, -0.0207346529,
      0.165877268, -0.0336044431,
      0.155867383, -0.0378943458,
      0.151577413, -0.0421842895,
      0.147287443, -0.0536240749,
      0.147287443, -0.0593439862,
      0.147287443, -0.0607739538,
      0.147287443, -0.0607739538,
    ],
  },
  'pen:3:5:User': {
    color: [1, 0, 0.833325684, 1], // pink/magenta
    points: [
      -0.373223692, 0.12512286,
      -0.371793687, 0.12512286,
      -0.244525865, 0.0436142944,
      -0.118687965, -0.0536240749,
      -0.10009829, -0.0865135342,
      -0.10009829, -0.0893734694,
      -0.10009829, -0.0893734694,
    ],
  },
  'text:6:1:User': {
    color: [1, 1, 1, 1], // white
    position: [-0.979533434, 0.291000068],
    text: 'text eng',
  },
};

console.log('=== Raw OpenRV Data & Conversions ===\n');

for (const [name, data] of Object.entries(rawData)) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Component: ${name}`);
  console.log(`${'='.repeat(60)}`);

  const rgba = data.color;
  const hexColor = `#${Math.round(rgba[0]*255).toString(16).padStart(2,'0')}${Math.round(rgba[1]*255).toString(16).padStart(2,'0')}${Math.round(rgba[2]*255).toString(16).padStart(2,'0')}`;
  console.log(`Color: RGBA(${rgba.join(', ')}) => ${hexColor}`);

  if (data.points) {
    console.log(`\nPoints conversion (${data.points.length / 2} points):\n`);
    console.log('  OpenRV (x, y)          =>  sm-annotate (x, y)');
    console.log('  ' + '-'.repeat(50));

    for (let i = 0; i < data.points.length; i += 2) {
      const ox = data.points[i];
      const oy = data.points[i + 1];
      const converted = convertOpenRVToSmAnnotate(ox, oy, ASPECT_RATIO);

      // Show conversion steps for first point
      if (i === 0) {
        console.log(`\n  First point detailed calculation:`);
        console.log(`    OpenRV: (${ox.toFixed(6)}, ${oy.toFixed(6)})`);
        console.log(`    `);
        console.log(`    Step 1: Normalize X by aspect ratio`);
        console.log(`      normalized_x = ${ox.toFixed(6)} / ${ASPECT_RATIO.toFixed(6)} = ${(ox/ASPECT_RATIO).toFixed(6)}`);
        console.log(`    `);
        console.log(`    Step 2: Convert to 0-1 range`);
        console.log(`      sm_x = (${(ox/ASPECT_RATIO).toFixed(6)} + 1) / 2 = ${converted.x.toFixed(6)}`);
        console.log(`      sm_y = (1 - ${oy.toFixed(6)}) / 2 = ${converted.y.toFixed(6)}`);
        console.log(`    `);
        console.log(`    Result: (${converted.x.toFixed(6)}, ${converted.y.toFixed(6)})`);
        console.log(`\n  All points:\n`);
      }

      const oxStr = ox.toFixed(6).padStart(12);
      const oyStr = oy.toFixed(6).padStart(12);
      const sxStr = converted.x.toFixed(6).padStart(10);
      const syStr = converted.y.toFixed(6).padStart(10);
      console.log(`  (${oxStr}, ${oyStr})  =>  (${sxStr}, ${syStr})`);
    }
  }

  if (data.position) {
    console.log(`\nText position conversion:\n`);
    const ox = data.position[0];
    const oy = data.position[1];
    const converted = convertOpenRVToSmAnnotate(ox, oy, ASPECT_RATIO);

    console.log(`  OpenRV: (${ox.toFixed(6)}, ${oy.toFixed(6)})`);
    console.log(`  `);
    console.log(`  Step 1: Normalize X by aspect ratio`);
    console.log(`    normalized_x = ${ox.toFixed(6)} / ${ASPECT_RATIO.toFixed(6)} = ${(ox/ASPECT_RATIO).toFixed(6)}`);
    console.log(`  `);
    console.log(`  Step 2: Convert to 0-1 range`);
    console.log(`    sm_x = (${(ox/ASPECT_RATIO).toFixed(6)} + 1) / 2 = ${converted.x.toFixed(6)}`);
    console.log(`    sm_y = (1 - ${oy.toFixed(6)}) / 2 = ${converted.y.toFixed(6)}`);
    console.log(`  `);
    console.log(`  Result: (${converted.x.toFixed(6)}, ${converted.y.toFixed(6)})`);
    console.log(`  Text: "${data.text}"`);
  }
}

console.log('\n\n=== Visual Coordinate Map ===\n');
console.log('OpenRV coordinate system:');
console.log('');
console.log('              +1 (top)');
console.log('               |');
console.log(`  -${ASPECT_RATIO.toFixed(2)} --------+-------- +${ASPECT_RATIO.toFixed(2)}`);
console.log('   (left)      |         (right)');
console.log('              -1 (bottom)');
console.log('');
console.log('sm-annotate coordinate system:');
console.log('');
console.log('  (0,0)--------- X ---------(1,0)');
console.log('    |                          |');
console.log('    |                          |');
console.log('    Y         (0.5,0.5)        |');
console.log('    |                          |');
console.log('    |                          |');
console.log('  (0,1)---------------------(1,1)');
