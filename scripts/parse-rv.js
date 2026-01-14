/**
 * Script to test parsing of demo/test_session.rv file
 * Run with: node scripts/parse-rv.js
 *
 * This script manually implements the parser logic for Node.js environment
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============= Parser Implementation (copied from openrv-parser.ts) =============

function rgbaToHex(rgba) {
  if (rgba.length < 3) return '#000000';
  const r = Math.round(rgba[0] * 255);
  const g = Math.round(rgba[1] * 255);
  const b = Math.round(rgba[2] * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function parsePropertyValue(valueStr, type) {
  valueStr = valueStr.trim();

  if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
    const inner = valueStr.slice(1, -1).trim();

    if (inner === '') {
      return type === 'string' ? [] : [];
    }

    if (type === 'string') {
      const matches = inner.match(/"([^"\\]|\\.)*"/g);
      if (matches) {
        return matches.map(s => s.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n'));
      }
      return [];
    }

    if (inner.includes('[')) {
      const numbers = [];
      const numMatches = inner.match(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi);
      if (numMatches) {
        for (const num of numMatches) {
          numbers.push(Number(num));
        }
      }
      return numbers;
    }

    const numbers = inner.split(/\s+/).filter(s => s.length > 0 && !isNaN(Number(s))).map(Number);
    return numbers;
  }

  if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
    return valueStr.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }

  return Number(valueStr);
}

function parseGTOText(content) {
  const objects = [];
  const lines = content.split('\n');
  let currentObject = null;
  let currentComponent = null;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '' || line.startsWith('#') || line === 'GTOa (4)') {
      continue;
    }

    const objectMatch = line.match(/^(\S+)\s*:\s*(\S+)\s*\((\d+)\)\s*$/);
    if (objectMatch && braceDepth === 0) {
      currentObject = {
        name: objectMatch[1],
        protocol: objectMatch[2],
        version: parseInt(objectMatch[3]),
        components: new Map(),
      };
      objects.push(currentObject);
      continue;
    }

    if (line === '{') {
      braceDepth++;
      continue;
    }

    if (line === '}') {
      braceDepth--;
      if (braceDepth === 1) {
        currentComponent = null;
      }
      if (braceDepth === 0) {
        currentObject = null;
      }
      continue;
    }

    if (currentObject && braceDepth >= 1) {
      if (braceDepth === 1) {
        const quotedMatch = line.match(/^"([^"]+)"$/);
        if (quotedMatch) {
          currentComponent = quotedMatch[1];
          if (!currentObject.components.has(currentComponent)) {
            currentObject.components.set(currentComponent, new Map());
          }
          continue;
        }
        if (!line.includes('=') && !line.includes('[')) {
          currentComponent = line;
          if (!currentObject.components.has(currentComponent)) {
            currentObject.components.set(currentComponent, new Map());
          }
          continue;
        }
      }

      const propMatch = line.match(/^(\w+)(?:\[([^\]]*)\])?\s+(\w+)\s*=\s*(.+)$/);
      if (propMatch && currentComponent) {
        const [, type, , propName, valueStr] = propMatch;
        const value = parsePropertyValue(valueStr, type);
        currentObject.components.get(currentComponent)?.set(propName, value);
      }
    }
  }

  return objects;
}

function convertOpenRVToSmAnnotate(openrvX, openrvY, aspectRatio) {
  const normalizedX = openrvX / aspectRatio;
  return {
    x: (normalizedX + 1) / 2,
    y: (1 - openrvY) / 2,
  };
}

function penComponentToCurve(props, width, height) {
  const pointsData = props.get('points');
  const colorData = props.get('color');
  const widthData = props.get('width');

  if (!pointsData || pointsData.length < 4) {
    return null;
  }

  const aspectRatio = width / height;

  const points = [];
  for (let i = 0; i < pointsData.length; i += 2) {
    const converted = convertOpenRVToSmAnnotate(pointsData[i], pointsData[i + 1], aspectRatio);
    points.push(converted);
  }

  const color = colorData ? rgbaToHex(colorData) : '#000000';
  const opacity = colorData && colorData.length >= 4 ? colorData[3] : 1;

  let lineWidth = 2;
  if (typeof widthData === 'number') {
    lineWidth = widthData * height;
  } else if (Array.isArray(widthData) && widthData.length > 0) {
    const firstWidth = widthData[0];
    if (typeof firstWidth === 'number') {
      lineWidth = firstWidth * height;
    }
  }

  lineWidth = Math.max(1, Math.min(lineWidth, 50));

  return {
    type: 'curve',
    points,
    strokeStyle: color,
    fillStyle: color,
    lineWidth,
    opacity,
  };
}

function textComponentToText(props, width, height) {
  const positionData = props.get('position');
  const colorData = props.get('color');
  const textContent = props.get('text');
  const size = props.get('size');

  if (!positionData || positionData.length < 2 || !textContent) {
    return null;
  }

  const aspectRatio = width / height;

  const converted = convertOpenRVToSmAnnotate(positionData[0], positionData[1], aspectRatio);

  const color = colorData ? rgbaToHex(colorData) : '#000000';
  const opacity = colorData && colorData.length >= 4 ? colorData[3] : 1;

  const normalizedSize = size ?? 0.01;
  const fontSize = normalizedSize * height;
  const lineWidth = Math.max(1, (fontSize - 16) / 0.5);

  return {
    type: 'text',
    x: converted.x,
    y: converted.y,
    text: textContent,
    strokeStyle: color,
    fillStyle: color,
    lineWidth,
    opacity,
  };
}

function parseOpenRV(content, options = {}) {
  const result = {
    frames: [],
  };

  const objects = parseGTOText(content);

  const sessionObj = objects.find(o => o.protocol === 'RVSession');
  if (sessionObj) {
    const sessionComp = sessionObj.components.get('session');
    if (sessionComp) {
      const name = sessionComp.get('name');
      if (typeof name === 'string') {
        result.sessionName = name;
      }
    }
  }

  const fileSourceObj = objects.find(o => o.protocol === 'RVFileSource');
  if (fileSourceObj) {
    const mediaComp = fileSourceObj.components.get('media');
    if (mediaComp) {
      const movie = mediaComp.get('movie');
      if (typeof movie === 'string') {
        result.mediaPath = movie;
      }
    }

    const requestComp = fileSourceObj.components.get('request');
    if (requestComp) {
      const w = requestComp.get('width');
      const h = requestComp.get('height');
      if (typeof w === 'number' && typeof h === 'number') {
        result.dimensions = { width: w, height: h };
      }
    }
  }

  const width = options.width ?? result.dimensions?.width ?? 1920;
  const height = options.height ?? result.dimensions?.height ?? 1080;
  const fps = options.fps ?? 25;

  result.fps = fps;

  const paintObjects = objects.filter(o => o.protocol === 'RVPaint');
  if (paintObjects.length === 0) {
    return result;
  }

  const frameShapes = new Map();

  for (const paintObj of paintObjects) {
    for (const [compName, props] of paintObj.components) {
      const penMatch = compName.match(/^pen:\d+:(\d+):/i);
      if (penMatch) {
        const frame = parseInt(penMatch[1]);
        const shape = penComponentToCurve(props, width, height);
        if (shape) {
          if (!frameShapes.has(frame)) {
            frameShapes.set(frame, []);
          }
          frameShapes.get(frame).push(shape);
        }
        continue;
      }

      const textMatch = compName.match(/^text:\d+:(\d+):/i);
      if (textMatch) {
        const frame = parseInt(textMatch[1]);
        const shape = textComponentToText(props, width, height);
        if (shape) {
          if (!frameShapes.has(frame)) {
            frameShapes.set(frame, []);
          }
          frameShapes.get(frame).push(shape);
        }
      }
    }
  }

  for (const [frame, shapes] of frameShapes) {
    result.frames.push({
      frame,
      fps,
      version: 1,
      shapes,
    });
  }

  result.frames.sort((a, b) => a.frame - b.frame);

  return result;
}

// ============= Main Script =============

const filePath = join(__dirname, '../demo/test_session.rv');
const content = readFileSync(filePath, 'utf-8');

// Parse with dimensions from the file (1280x536 based on proxy.size in the file)
const result = parseOpenRV(content, { width: 1280, height: 536, fps: 24 });

console.log('=== Parsed OpenRV Result ===\n');

console.log('Media Path:', result.mediaPath);
console.log('Dimensions:', result.dimensions);
console.log('Session Name:', result.sessionName);
console.log('FPS:', result.fps);
console.log('Number of frames with annotations:', result.frames.length);

console.log('\n=== Frame Annotations ===\n');

for (const frame of result.frames) {
  console.log(`Frame ${frame.frame}:`);
  console.log(`  FPS: ${frame.fps}`);
  console.log(`  Version: ${frame.version}`);
  console.log(`  Shapes: ${frame.shapes.length}`);

  for (let i = 0; i < frame.shapes.length; i++) {
    const shape = frame.shapes[i];
    console.log(`\n  Shape ${i + 1}:`);
    console.log(`    Type: ${shape.type}`);
    console.log(`    Stroke Style: ${shape.strokeStyle}`);
    console.log(`    Fill Style: ${shape.fillStyle}`);
    console.log(`    Line Width: ${shape.lineWidth.toFixed(2)}`);

    if (shape.opacity !== undefined) {
      console.log(`    Opacity: ${shape.opacity}`);
    }

    if (shape.type === 'curve') {
      console.log(`    Points: ${shape.points.length}`);
      // Show first 3 and last point
      const pts = shape.points;
      if (pts.length <= 4) {
        pts.forEach((p, idx) => {
          console.log(`      [${idx}] x: ${p.x.toFixed(4)}, y: ${p.y.toFixed(4)}`);
        });
      } else {
        pts.slice(0, 3).forEach((p, idx) => {
          console.log(`      [${idx}] x: ${p.x.toFixed(4)}, y: ${p.y.toFixed(4)}`);
        });
        console.log(`      ...`);
        console.log(`      [${pts.length - 1}] x: ${pts[pts.length - 1].x.toFixed(4)}, y: ${pts[pts.length - 1].y.toFixed(4)}`);
      }
    } else if (shape.type === 'text') {
      console.log(`    Position: x: ${shape.x.toFixed(4)}, y: ${shape.y.toFixed(4)}`);
      console.log(`    Text: "${shape.text}"`);
    }
  }

  console.log('\n' + '-'.repeat(40));
}

console.log('\n=== JSON Output ===\n');
console.log(JSON.stringify(result, null, 2));
