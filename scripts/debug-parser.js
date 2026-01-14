/**
 * Debug script to check what component names are being parsed
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../demo/test_session.rv');
const content = readFileSync(filePath, 'utf-8');

// Simplified GTO parser to debug
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
          console.log(`Found quoted component: "${currentComponent}"`);
          if (!currentObject.components.has(currentComponent)) {
            currentObject.components.set(currentComponent, new Map());
          }
          continue;
        }
        if (!line.includes('=') && !line.includes('[')) {
          currentComponent = line;
          console.log(`Found unquoted component: "${currentComponent}"`);
          if (!currentObject.components.has(currentComponent)) {
            currentObject.components.set(currentComponent, new Map());
          }
          continue;
        }
      }
    }
  }

  return objects;
}

const objects = parseGTOText(content);

console.log('\n=== RVPaint Objects ===\n');

const paintObjects = objects.filter(o => o.protocol === 'RVPaint');
for (const obj of paintObjects) {
  console.log(`Object: ${obj.name}`);
  console.log(`Components:`);
  for (const [compName] of obj.components) {
    console.log(`  - "${compName}"`);

    // Test regex matching
    const penMatch = compName.match(/^pen:\d+:(\d+):/i);
    const textMatch = compName.match(/^text:\d+:(\d+):/i);

    if (penMatch) {
      console.log(`    -> Matched pen, frame: ${penMatch[1]}`);
    } else if (textMatch) {
      console.log(`    -> Matched text, frame: ${textMatch[1]}`);
    } else {
      console.log(`    -> NO MATCH!`);
    }
  }
  console.log('');
}
