/**
 * OpenRV GTO Parser
 *
 * Parses OpenRV .rv (GTO text format) files and converts annotations
 * to sm-annotate FrameAnnotationV1 format.
 *
 * Uses gto-js library for robust GTO parsing with support for:
 * - Text (.rv) and binary (.gto) formats
 * - Gzip compression (async only)
 * - Proper lexer/tokenizer with error handling
 *
 * Supported component types:
 * - pen:N:F:user - Freehand strokes (curves) and shapes
 * - text:N:F:user - Text annotations
 */

import { SimpleReader, GTODTO, type ComponentDTO } from 'gto-js';
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
 * Convert OpenRV normalized coordinates to sm-annotate coordinates.
 *
 * OpenRV uses NDC where:
 * - (0, 0) is the center of the image
 * - X: -1 (left) to 1 (right)
 * - Y: -1/aspect (bottom) to 1/aspect (top), where aspect = width/height
 *
 * sm-annotate uses:
 * - (0, 0) is the top-left corner
 * - X: 0 (left) to 1 (right)
 * - Y: 0 (top) to 1 (bottom)
 */
function convertOpenRVToSmAnnotate(
  openrvX: number,
  openrvY: number,
  aspectRatio: number
): { x: number; y: number } {
  // OpenRV X: -1 to +1 centered
  // OpenRV Y: -1/aspect to +1/aspect centered (Y+ is up, so we invert)
  // The Y range is scaled by aspect ratio to maintain proper proportions
  return {
    x: (openrvX + 1) / 2,
    y: (1 - openrvY * aspectRatio) / 2,
  };
}

/**
 * Apply scale and offset transformations to a coordinate.
 * Scale is applied toward center (0.5, 0.5), then offset is added.
 */
function applyCoordinateTransform(
  x: number,
  y: number,
  scale?: number,
  offset?: { x: number; y: number }
): { x: number; y: number } {
  let newX = x;
  let newY = y;

  // Scale toward center (0.5, 0.5)
  if (scale !== undefined && scale !== 1) {
    newX = 0.5 + (x - 0.5) * scale;
    newY = 0.5 + (y - 0.5) * scale;
  }

  // Apply offset (inverted: positive values move shapes left/up)
  if (offset) {
    newX -= offset.x;
    newY -= offset.y;
  }

  return { x: newX, y: newY };
}

/**
 * Convert pen component to curve shape using gto-js ComponentDTO
 */
function penComponentToCurve(
  comp: ComponentDTO,
  width: number,
  height: number,
  targetHeight: number,
  scale?: number,
  offset?: { x: number; y: number }
): ICurve | null {
  const pointsData = comp.prop('points') as number[][] | number[] | null;
  const colorData = comp.prop('color') as number[][] | number[] | null;
  const widthData = comp.prop('width') as number[] | number | null;

  if (!pointsData) {
    return null;
  }

  // Flatten points if needed (gto-js returns [[x1,y1], [x2,y2], ...] format)
  let flatPoints: number[];
  if (Array.isArray(pointsData[0])) {
    // Flatten nested array [[x1, y1], [x2, y2], ...] -> [x1, y1, x2, y2, ...]
    flatPoints = [];
    for (const point of pointsData as number[][]) {
      flatPoints.push(...point);
    }
  } else {
    flatPoints = pointsData as number[];
  }

  if (flatPoints.length < 4) {
    return null;
  }

  const aspectRatio = width / height;

  // Convert flat points array to IPoint array
  const points: IPoint[] = [];
  for (let i = 0; i < flatPoints.length; i += 2) {
    let converted = convertOpenRVToSmAnnotate(
      flatPoints[i],
      flatPoints[i + 1],
      aspectRatio
    );
    converted = applyCoordinateTransform(converted.x, converted.y, scale, offset);
    points.push(converted);
  }

  // Handle color - gto-js returns [[r,g,b,a]] format
  const flatColor: number[] = colorData
    ? (Array.isArray(colorData[0]) ? (colorData as number[][])[0] : colorData as number[])
    : [0, 0, 0, 1];

  const color = rgbaToHex(flatColor);
  const opacity = flatColor.length >= 4 ? flatColor[3] : 1;

  // Handle width - can be a single number or an array (one per point)
  let lineWidth = 2;
  if (typeof widthData === 'number') {
    lineWidth = widthData * targetHeight;
  } else if (Array.isArray(widthData) && widthData.length > 0) {
    const firstWidth = widthData[0];
    if (typeof firstWidth === 'number') {
      lineWidth = firstWidth * targetHeight;
    }
  }

  // Apply scale to line width as well
  if (scale !== undefined && scale !== 1) {
    lineWidth *= scale;
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
 * Convert text component to text shape using gto-js ComponentDTO
 */
function textComponentToText(
  comp: ComponentDTO,
  width: number,
  height: number,
  targetHeight: number,
  scale?: number,
  offset?: { x: number; y: number }
): IText | null {
  const positionData = comp.prop('position') as number[][] | number[] | null;
  const colorData = comp.prop('color') as number[][] | number[] | null;
  const textContent = comp.prop('text') as string | null;
  const size = comp.prop('size') as number | null;

  if (!textContent) {
    return null;
  }

  // Position is required - skip text without position
  if (!positionData) {
    return null;
  }

  // Handle position - gto-js returns [[x,y]] format
  const flatPosition: number[] = Array.isArray(positionData[0])
    ? (positionData as number[][])[0]
    : positionData as number[];

  if (flatPosition.length < 2) {
    return null;
  }

  const aspectRatio = width / height;

  // Convert OpenRV NDC to sm-annotate coordinates
  let converted = convertOpenRVToSmAnnotate(
    flatPosition[0],
    flatPosition[1],
    aspectRatio
  );
  converted = applyCoordinateTransform(converted.x, converted.y, scale, offset);

  // Handle color
  const flatColor: number[] = colorData
    ? (Array.isArray(colorData[0]) ? (colorData as number[][])[0] : colorData as number[])
    : [0, 0, 0, 1];

  const color = rgbaToHex(flatColor);
  const opacity = flatColor.length >= 4 ? flatColor[3] : 1;

  // Convert size (normalized to height) back to lineWidth
  const normalizedSize = size ?? 0.01;
  let fontSize = normalizedSize * targetHeight;

  // Apply scale to font size
  if (scale !== undefined && scale !== 1) {
    fontSize *= scale;
  }

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

export interface OpenRVParseOptions {
  /** Override width (uses file dimensions if available) */
  width?: number;
  /** Override height (uses file dimensions if available) */
  height?: number;
  /** Target height for scaling calculations */
  targetHeight?: number;
  /** Frames per second */
  fps?: number;
  /**
   * Scale factor for coordinates (0.85 = 15% smaller toward center).
   * Applied after coordinate conversion.
   */
  coordinateScale?: number;
  /**
   * Offset to apply to coordinates after scaling.
   * Positive values move shapes left (x) and up (y).
   * Example: { x: 0.07, y: 0.07 } shifts 7% left and up.
   */
  coordinateOffset?: { x: number; y: number };
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Extract dimensions from GTO DTO
 */
function extractDimensions(dto: GTODTO): { width: number; height: number } | undefined {
  // Try RVFileSource -> proxy.size first
  const fileSource = dto.fileSources().first();
  if (fileSource.exists()) {
    const proxySize = fileSource.prop('proxy', 'size') as number[] | null;
    if (proxySize && proxySize.length >= 2) {
      return { width: proxySize[0], height: proxySize[1] };
    }

    // Fallback: request.width/height
    const reqWidth = fileSource.prop('request', 'width') as number | null;
    const reqHeight = fileSource.prop('request', 'height') as number | null;
    if (reqWidth && reqHeight) {
      return { width: reqWidth, height: reqHeight };
    }
  }

  // Try RVStack -> output.size
  const stack = dto.byProtocol('RVStack').first();
  if (stack.exists()) {
    const outputSize = stack.prop('output', 'size') as number[] | null;
    if (outputSize && outputSize.length >= 2) {
      return { width: outputSize[0], height: outputSize[1] };
    }
  }

  // Try RVSequence -> output.size
  const seq = dto.byProtocol('RVSequence').first();
  if (seq.exists()) {
    const outputSize = seq.prop('output', 'size') as number[] | null;
    if (outputSize && outputSize.length >= 2) {
      return { width: outputSize[0], height: outputSize[1] };
    }
  }

  return undefined;
}

/**
 * Process parsed GTO DTO and extract annotations
 */
function processGTODto(
  dto: GTODTO,
  options: OpenRVParseOptions
): ParsedOpenRVResult {
  const result: ParsedOpenRVResult = {
    frames: [],
  };

  // Extract session info
  const session = dto.session();
  if (session.exists()) {
    const name = session.prop('session', 'name') as string | null;
    if (name) {
      result.sessionName = name;
    }
  }

  // Extract media info
  const fileSource = dto.fileSources().first();
  if (fileSource.exists()) {
    const movie = fileSource.prop('media', 'movie') as string | null;
    if (movie) {
      result.mediaPath = movie;
    }
  }

  // Extract dimensions
  result.dimensions = extractDimensions(dto);

  // Use dimensions from file first, then fallback to options
  const width = result.dimensions?.width ?? options.width ?? 1920;
  const height = result.dimensions?.height ?? options.height ?? 1080;
  const targetHeight = options.targetHeight ?? height;
  const fps = options.fps ?? 25;
  const scale = options.coordinateScale;
  const offset = options.coordinateOffset;
  const debug = options.debug ?? false;

  result.fps = fps;

  if (debug) {
    console.log('[OpenRV Parser] Source dimensions:', width, 'x', height);
    console.log('[OpenRV Parser] Target height:', targetHeight);
    console.log('[OpenRV Parser] Coordinate scale:', scale);
    console.log('[OpenRV Parser] Coordinate offset:', offset);
  }

  // Extract paint annotations using gto-js paints() method
  const paints = dto.paints();

  if (paints.length === 0) {
    if (debug) console.log('[OpenRV Parser] No RVPaint objects found');
    return result;
  }

  if (debug) console.log('[OpenRV Parser] Found', paints.length, 'RVPaint objects');

  // Group shapes by frame
  const frameShapes = new Map<number, IShape[]>();

  // Iterate through all RVPaint objects
  for (const paint of paints) {
    for (const comp of paint.components()) {
      const compName = comp.name;

      // Parse pen components: pen:ID:FRAME:user
      const penMatch = compName.match(/^pen:\d+:(\d+):/i);
      if (penMatch) {
        const frame = parseInt(penMatch[1]);
        const shape = penComponentToCurve(comp, width, height, targetHeight, scale, offset);
        if (shape) {
          if (!frameShapes.has(frame)) {
            frameShapes.set(frame, []);
          }
          frameShapes.get(frame)!.push(shape);
        }
        continue;
      }

      // Parse text components: text:ID:FRAME:user
      const textMatch = compName.match(/^text:\d+:(\d+):/i);
      if (textMatch) {
        const frame = parseInt(textMatch[1]);
        const shape = textComponentToText(comp, width, height, targetHeight, scale, offset);
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
 * Parse OpenRV GTO file content and convert to sm-annotate format
 */
export function parseOpenRV(
  content: string,
  options: OpenRVParseOptions = {}
): ParsedOpenRVResult {
  // Parse using gto-js SimpleReader
  const reader = new SimpleReader();
  const success = reader.open(content);

  if (!success) {
    if (options.debug) {
      console.log('[OpenRV Parser] Failed to parse GTO content');
    }
    return { frames: [] };
  }

  return processGTODto(new GTODTO(reader.result), options);
}

/**
 * Parse OpenRV file from File object
 */
export async function parseOpenRVFile(
  file: File,
  options: OpenRVParseOptions = {}
): Promise<ParsedOpenRVResult> {
  const content = await file.text();
  return parseOpenRV(content, options);
}

/**
 * Parse OpenRV GTO file content asynchronously (supports gzip-compressed binary files)
 */
export async function parseOpenRVAsync(
  content: string | ArrayBuffer | Uint8Array,
  options: OpenRVParseOptions = {}
): Promise<ParsedOpenRVResult> {
  // Parse using gto-js SimpleReader with async support for gzip
  const reader = new SimpleReader();
  const success = await reader.openAsync(content);

  if (!success) {
    if (options.debug) {
      console.log('[OpenRV Parser] Failed to parse GTO content');
    }
    return { frames: [] };
  }

  return processGTODto(new GTODTO(reader.result), options);
}
