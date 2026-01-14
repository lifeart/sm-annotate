/**
 * Debug script to check what happens during OpenRV loading
 * Run with: node scripts/debug-loading.js
 */

console.log('=== Debug: OpenRV Loading Simulation ===\n');

// Simulated tool state (like in demo)
const tool = {
  canvasWidth: undefined,  // May be undefined when file is loaded
  canvasHeight: undefined,
  fps: 30,  // Demo uses 30 FPS
};

// What the demo code does:
const parseOptions = {
  width: tool.canvasWidth || 1920,
  height: tool.canvasHeight || 1080,
  fps: tool.fps,
};

console.log('1. Parse options used by demo:');
console.log(`   width: ${parseOptions.width} (tool.canvasWidth was ${tool.canvasWidth})`);
console.log(`   height: ${parseOptions.height} (tool.canvasHeight was ${tool.canvasHeight})`);
console.log(`   fps: ${parseOptions.fps}`);
console.log(`   aspect ratio: ${(parseOptions.width / parseOptions.height).toFixed(4)}`);
console.log('');

// Actual RV file dimensions
const rvFileDimensions = {
  width: 1280,
  height: 536,
};
console.log('2. Actual .rv file was created for:');
console.log(`   width: ${rvFileDimensions.width}`);
console.log(`   height: ${rvFileDimensions.height}`);
console.log(`   aspect ratio: ${(rvFileDimensions.width / rvFileDimensions.height).toFixed(4)}`);
console.log('');

// Show coordinate conversion difference
const textPosition = { openrvX: -0.979533434, openrvY: 0.291000068 };

function convert(x, y, aspectRatio) {
  const normalizedX = x / aspectRatio;
  return {
    x: (normalizedX + 1) / 2,
    y: (1 - y) / 2,
  };
}

const correctConversion = convert(
  textPosition.openrvX,
  textPosition.openrvY,
  rvFileDimensions.width / rvFileDimensions.height
);

const wrongConversion = convert(
  textPosition.openrvX,
  textPosition.openrvY,
  parseOptions.width / parseOptions.height
);

console.log('3. Text position conversion comparison:');
console.log(`   OpenRV position: (${textPosition.openrvX}, ${textPosition.openrvY})`);
console.log('');
console.log(`   With CORRECT aspect (${(rvFileDimensions.width / rvFileDimensions.height).toFixed(3)}):`);
console.log(`     sm-annotate: (${correctConversion.x.toFixed(4)}, ${correctConversion.y.toFixed(4)})`);
console.log(`     Pixel pos (1280x536): (${Math.round(correctConversion.x * 1280)}, ${Math.round(correctConversion.y * 536)})`);
console.log('');
console.log(`   With WRONG aspect (${(parseOptions.width / parseOptions.height).toFixed(3)}):`);
console.log(`     sm-annotate: (${wrongConversion.x.toFixed(4)}, ${wrongConversion.y.toFixed(4)})`);
console.log(`     Pixel pos (1920x1080): (${Math.round(wrongConversion.x * 1920)}, ${Math.round(wrongConversion.y * 1080)})`);
console.log('');

const xDiff = Math.abs(correctConversion.x - wrongConversion.x);
console.log(`   X coordinate difference: ${(xDiff * 100).toFixed(1)}% of canvas width`);
console.log('');

// Check if text would be visible
console.log('4. Would the text be visible?');
if (wrongConversion.x >= 0 && wrongConversion.x <= 1 && wrongConversion.y >= 0 && wrongConversion.y <= 1) {
  console.log('   Yes, but at WRONG position');
} else {
  console.log('   NO - text is OFF SCREEN!');
  if (wrongConversion.x < 0) console.log(`     X is ${(wrongConversion.x * 100).toFixed(1)}% (left of screen)`);
  if (wrongConversion.x > 1) console.log(`     X is ${(wrongConversion.x * 100).toFixed(1)}% (right of screen)`);
}
console.log('');

// Curve example
const curvePoint = { openrvX: 0.183036849, openrvY: 0.253820688 };
const correctCurve = convert(curvePoint.openrvX, curvePoint.openrvY, rvFileDimensions.width / rvFileDimensions.height);
const wrongCurve = convert(curvePoint.openrvX, curvePoint.openrvY, parseOptions.width / parseOptions.height);

console.log('5. Curve point conversion (pen:1:15:User first point):');
console.log(`   OpenRV: (${curvePoint.openrvX}, ${curvePoint.openrvY})`);
console.log(`   Correct: (${correctCurve.x.toFixed(4)}, ${correctCurve.y.toFixed(4)})`);
console.log(`   Wrong:   (${wrongCurve.x.toFixed(4)}, ${wrongCurve.y.toFixed(4)})`);
console.log('');

console.log('=== CONCLUSION ===');
console.log('');
console.log('If tool.canvasWidth/Height are undefined when loading the .rv file,');
console.log('the coordinates will be converted with the WRONG aspect ratio.');
console.log('');
console.log('FIX: Ensure tool has canvas dimensions set BEFORE loading .rv file,');
console.log('OR the demo should pass the actual video dimensions to parseOpenRVFile.');
