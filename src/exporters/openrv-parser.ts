/**
 * OpenRV GTO Parser
 *
 * Parses OpenRV .rv (GTO text format) files and converts annotations
 * to sm-annotate FrameAnnotationV1 format.
 *
 * Supported component types:
 * - pen:N:F:user - Freehand strokes (curves) and shapes
 * - text:N:F:user - Text annotations
 */

import type { FrameAnnotationV1 } from "../core";
import type { IShape } from "../plugins";
import type { ICurve, IPoint } from "../plugins/curve";
import type { IText } from "../plugins/text";

export interface ParsedOpenRVResult {
  /** Parsed frame annotations */
  frames: FrameAnnotationV1[];
  /** Media path from the file (if found) */
  mediaPath?: string;
  /** Media dimensions (if found) */
  dimensions?: { width: number; height: number };
  /** Session name (if found) */
  sessionName?: string;
  /** FPS from file (if determinable) */
  fps?: number;
}

interface GTOObject {
  name: string;
  protocol: string;
  version: number;
  components: Map<string, Map<string, GTOPropertyValue>>;
}

type GTOPropertyValue = string | number | number[] | string[];

/**
 * Convert RGBA float array [r, g, b, a] to hex color string
 */
export function rgbaToHex(rgba: number[]): string {
  if (rgba.length < 3) return '#000000';

  const r = Math.round(rgba[0] * 255);
  const g = Math.round(rgba[1] * 255);
  const b = Math.round(rgba[2] * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Parse a GTO property value from string
 * Handles both flat arrays and nested arrays like [ [ x y ] [ x y ] ]
 */
function parsePropertyValue(valueStr: string, type: string): GTOPropertyValue {
  valueStr = valueStr.trim();

  // Handle array values [ ... ]
  if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
    const inner = valueStr.slice(1, -1).trim();

    // Empty array
    if (inner === '') {
      return type === 'string' ? [] : [];
    }

    // Handle string arrays - can be single string or array of strings
    if (type === 'string') {
      const matches = inner.match(/"([^"\\]|\\.)*"/g);
      if (matches) {
        return matches.map(s => s.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n'));
      }
      // Single unquoted string in array
      return [];
    }

    // Check for nested arrays format: [ [ x y ] [ x y ] ]
    // OpenRV uses this for points, colors, etc.
    if (inner.includes('[')) {
      // Extract all numbers from nested structure
      const numbers: number[] = [];
      // Match all numbers (including negative and scientific notation)
      const numMatches = inner.match(/-?\d+\.?\d*(?:e[+-]?\d+)?/gi);
      if (numMatches) {
        for (const num of numMatches) {
          numbers.push(Number(num));
        }
      }
      return numbers;
    }

    // Handle flat numeric arrays
    const numbers = inner.split(/\s+/).filter(s => s.length > 0 && !isNaN(Number(s))).map(Number);
    return numbers;
  }

  // Handle string values "..."
  if (valueStr.startsWith('"') && valueStr.endsWith('"')) {
    return valueStr.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, '\n');
  }

  // Handle numeric values
  return Number(valueStr);
}

/**
 * Parse GTO text content into objects
 */
function parseGTOText(content: string): GTOObject[] {
  const objects: GTOObject[] = [];
  const lines = content.split('\n');
  let currentObject: GTOObject | null = null;
  let currentComponent: string | null = null;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines and comments
    if (line === '' || line.startsWith('#') || line === 'GTOa (4)') {
      continue;
    }

    // Object declaration: ObjectName : Protocol (Version)
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

    // Opening brace
    if (line === '{') {
      braceDepth++;
      continue;
    }

    // Closing brace
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

    // Inside an object
    if (currentObject && braceDepth >= 1) {
      // Component name - can be quoted (OpenRV format) or unquoted
      // Quoted: "pen:1:15:User" or "frame:15"
      // Unquoted: pen:0:1:user or paint
      if (braceDepth === 1) {
        // Check for quoted component name: "something"
        const quotedMatch = line.match(/^"([^"]+)"$/);
        if (quotedMatch) {
          currentComponent = quotedMatch[1];
          if (!currentObject.components.has(currentComponent)) {
            currentObject.components.set(currentComponent, new Map());
          }
          continue;
        }
        // Unquoted component name (no assignment, no brackets)
        if (!line.includes('=') && !line.includes('[')) {
          currentComponent = line;
          if (!currentObject.components.has(currentComponent)) {
            currentObject.components.set(currentComponent, new Map());
          }
          continue;
        }
      }

      // Property assignment: type[dims] name = value
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

/**
 * Convert OpenRV normalized coordinates to sm-annotate coordinates.
 *
 * OpenRV uses NDC where:
 * - (0, 0) is the center of the image
 * - X: -1 (left) to 1 (right)
 * - Y: scaled by inverse of aspect ratio: -(h/w) to +(h/w)
 *
 * sm-annotate uses:
 * - (0, 0) is the top-left corner
 * - X: 0 (left) to 1 (right)
 * - Y: 0 (top) to 1 (bottom)
 *
 * OpenRV stores X coordinates in -1 to +1 range, but Y is scaled
 * by the inverse of aspect ratio (height/width).
 */
function convertOpenRVToSmAnnotate(
  openrvX: number,
  openrvY: number,
  aspectRatio: number
): { x: number; y: number } {
  // OpenRV X: -1 to +1 centered
  // OpenRV Y: -(h/w) to +(h/w) centered, need to scale by aspect ratio to normalize
  return {
    x: (openrvX + 1) / 2,
    y: (1 - openrvY * aspectRatio) / 2,
  };
}

/**
 * Convert pen component to curve shape
 */
function penComponentToCurve(
  props: Map<string, GTOPropertyValue>,
  width: number,
  height: number
): ICurve | null {
  const pointsData = props.get('points') as number[] | undefined;
  const colorData = props.get('color') as number[] | undefined;
  const widthData = props.get('width');

  if (!pointsData || pointsData.length < 4) {
    return null;
  }

  const aspectRatio = width / height;

  // Convert flat points array to IPoint array
  // OpenRV uses NDC (-1 to 1 centered), convert to sm-annotate (0 to 1 top-left)
  const points: IPoint[] = [];
  for (let i = 0; i < pointsData.length; i += 2) {
    const converted = convertOpenRVToSmAnnotate(
      pointsData[i],
      pointsData[i + 1],
      aspectRatio
    );
    points.push(converted);
  }

  const color = colorData ? rgbaToHex(colorData) : '#000000';
  const opacity = colorData && colorData.length >= 4 ? colorData[3] : 1;

  // Handle width - can be a single number or an array (one per point)
  // OpenRV width is normalized (relative to image height), convert to reasonable pixel value
  let lineWidth = 2;
  if (typeof widthData === 'number') {
    lineWidth = widthData * height;
  } else if (Array.isArray(widthData) && widthData.length > 0) {
    // Use first value, multiply by height to denormalize
    const firstWidth = widthData[0];
    if (typeof firstWidth === 'number') {
      lineWidth = firstWidth * height;
    }
  }

  // Clamp to reasonable range
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

/**
 * Convert text component to text shape
 */
function textComponentToText(
  props: Map<string, GTOPropertyValue>,
  width: number,
  height: number
): IText | null {
  const positionData = props.get('position') as number[] | undefined;
  const colorData = props.get('color') as number[] | undefined;
  const textContent = props.get('text') as string | undefined;
  const size = props.get('size') as number | undefined;

  if (!positionData || positionData.length < 2 || !textContent) {
    return null;
  }

  const aspectRatio = width / height;

  // Convert OpenRV NDC to sm-annotate coordinates
  const converted = convertOpenRVToSmAnnotate(
    positionData[0],
    positionData[1],
    aspectRatio
  );

  const color = colorData ? rgbaToHex(colorData) : '#000000';
  const opacity = colorData && colorData.length >= 4 ? colorData[3] : 1;

  // Convert size (normalized to height) back to lineWidth
  // OpenRV size is relative to image height
  // Original export: size = fontSize / 100, fontSize = 16 + lineWidth * 0.5
  // We'll convert normalized size to a reasonable font size
  const normalizedSize = size ?? 0.01;
  // Denormalize: multiply by height to get pixel size, then convert to lineWidth
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

/**
 * Parse OpenRV GTO file content and convert to sm-annotate format
 */
export function parseOpenRV(
  content: string,
  options: { width?: number; height?: number; fps?: number } = {}
): ParsedOpenRVResult {
  const result: ParsedOpenRVResult = {
    frames: [],
  };

  const objects = parseGTOText(content);

  // Extract session info
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

  // Extract media info
  const fileSourceObj = objects.find(o => o.protocol === 'RVFileSource');
  if (fileSourceObj) {
    const mediaComp = fileSourceObj.components.get('media');
    if (mediaComp) {
      const movie = mediaComp.get('movie');
      if (typeof movie === 'string') {
        result.mediaPath = movie;
      }
    }

    // Try to get dimensions from proxy component (contains source media size)
    const proxyComp = fileSourceObj.components.get('proxy');
    if (proxyComp) {
      const size = proxyComp.get('size') as number[] | undefined;
      if (size && size.length >= 2) {
        result.dimensions = { width: size[0], height: size[1] };
      }
    }

    // Fallback: try request component (used in some .rv files and tests)
    if (!result.dimensions) {
      const requestComp = fileSourceObj.components.get('request');
      if (requestComp) {
        const w = requestComp.get('width');
        const h = requestComp.get('height');
        if (typeof w === 'number' && typeof h === 'number') {
          result.dimensions = { width: w, height: h };
        }
      }
    }
  }

  // Fallback: try to get dimensions from RVStack or RVSequence output
  if (!result.dimensions) {
    const stackObj = objects.find(o => o.protocol === 'RVStack');
    if (stackObj) {
      const outputComp = stackObj.components.get('output');
      if (outputComp) {
        const size = outputComp.get('size') as number[] | undefined;
        if (size && size.length >= 2) {
          result.dimensions = { width: size[0], height: size[1] };
        }
      }
    }
  }

  if (!result.dimensions) {
    const seqObj = objects.find(o => o.protocol === 'RVSequence');
    if (seqObj) {
      const outputComp = seqObj.components.get('output');
      if (outputComp) {
        const size = outputComp.get('size') as number[] | undefined;
        if (size && size.length >= 2) {
          result.dimensions = { width: size[0], height: size[1] };
        }
      }
    }
  }

  // Use dimensions from file first (needed for line width denormalization and aspect ratio), then fallback to options
  const width = result.dimensions?.width ?? options.width ?? 1920;
  const height = result.dimensions?.height ?? options.height ?? 1080;
  const fps = options.fps ?? 25;

  result.fps = fps;

  // Extract paint annotations from ALL RVPaint blocks
  // Multiple RVPaint blocks can exist (e.g., defaultLayout_paint, defaultSequence_p_sourceGroup000000)
  const paintObjects = objects.filter(o => o.protocol === 'RVPaint');
  if (paintObjects.length === 0) {
    return result;
  }

  // Group shapes by frame
  const frameShapes = new Map<number, IShape[]>();

  // Iterate through all RVPaint blocks
  for (const paintObj of paintObjects) {
    for (const [compName, props] of paintObj.components) {
      // Parse pen components: pen:ID:FRAME:user or pen:ID:FRAME:User (case-insensitive)
      const penMatch = compName.match(/^pen:\d+:(\d+):/i);
      if (penMatch) {
        const frame = parseInt(penMatch[1]);
        const shape = penComponentToCurve(props, width, height);
        if (shape) {
          if (!frameShapes.has(frame)) {
            frameShapes.set(frame, []);
          }
          frameShapes.get(frame)!.push(shape);
        }
        continue;
      }

      // Parse text components: text:ID:FRAME:user or text:ID:FRAME:User (case-insensitive)
      const textMatch = compName.match(/^text:\d+:(\d+):/i);
      if (textMatch) {
        const frame = parseInt(textMatch[1]);
        const shape = textComponentToText(props, width, height);
        if (shape) {
          if (!frameShapes.has(frame)) {
            frameShapes.set(frame, []);
          }
          frameShapes.get(frame)!.push(shape);
        }
      }
    }
  }

  // Convert to FrameAnnotationV1 array
  for (const [frame, shapes] of frameShapes) {
    result.frames.push({
      frame,
      fps,
      version: 1,
      shapes,
    });
  }

  // Sort by frame number
  result.frames.sort((a, b) => a.frame - b.frame);

  return result;
}

/**
 * Parse OpenRV file from File object
 */
export async function parseOpenRVFile(
  file: File,
  options: { width?: number; height?: number; fps?: number } = {}
): Promise<ParsedOpenRVResult> {
  const content = await file.text();
  return parseOpenRV(content, options);
}
