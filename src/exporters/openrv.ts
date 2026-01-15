/**
 * OpenRV GTO Exporter
 *
 * Exports sm-annotate annotations to OpenRV .rv (GTO text format) files.
 *
 * Uses gto-js library for robust GTO generation with support for:
 * - Text (.rv) and binary (.gto) formats
 * - Proper string table management
 * - Clean builder API
 *
 * OpenRV uses RVPaint nodes to store annotations with components like:
 * - pen:N:frame:F - Freehand strokes (curves)
 * - text:N:frame:F - Text annotations
 * - rect:N:frame:F - Rectangle annotations (approximated as pen strokes)
 *
 * GTO Format Reference: https://aswf-openrv.readthedocs.io/en/latest/rv-manuals/rv-gto.html
 */

import { GTOBuilder, SimpleWriter } from 'gto-js';
import type { FrameAnnotationV1 } from "../core";
import type { IShape } from "../plugins";
import type { ICurve, IPoint } from "../plugins/curve";
import type { ILine } from "../plugins/line";
import type { IArrow } from "../plugins/arrow";
import type { IRectangle } from "../plugins/rectangle";
import type { ICircle } from "../plugins/circle";
import type { IText } from "../plugins/text";

export interface OpenRVExportOptions {
  /** Source media path (required by OpenRV) */
  mediaPath: string;
  /** Canvas/media width in pixels */
  width: number;
  /** Canvas/media height in pixels */
  height: number;
  /** Session name for the RV file */
  sessionName?: string;
}

/**
 * Convert hex color string to RGBA float array [r, g, b, a]
 */
export function hexToRGBA(hex: string, opacity: number = 1): [number, number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  let r = 0, g = 0, b = 0;

  if (cleanHex.length === 3) {
    // Short form #RGB
    r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
  } else if (cleanHex.length === 6) {
    // Full form #RRGGBB
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  } else if (cleanHex.length === 8) {
    // With alpha #RRGGBBAA
    r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    opacity = parseInt(cleanHex.substring(6, 8), 16) / 255;
  }

  return [r, g, b, opacity];
}

/**
 * Extract color from strokeStyle/fillStyle which may be hex string or gradient
 */
function extractColor(style: string | CanvasGradient | CanvasPattern, opacity: number = 1): [number, number, number, number] {
  if (typeof style === 'string') {
    // Handle rgb/rgba format
    if (style.startsWith('rgb')) {
      const match = style.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        return [
          parseInt(match[1]) / 255,
          parseInt(match[2]) / 255,
          parseInt(match[3]) / 255,
          match[4] ? parseFloat(match[4]) : opacity
        ];
      }
    }
    return hexToRGBA(style, opacity);
  }
  // Default red color for gradients/patterns (not supported)
  return [1, 0, 0, opacity];
}

/**
 * Rotate a point around a center by given angle (radians)
 */
function rotatePoint(point: IPoint, centerX: number, centerY: number, angle: number): IPoint {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - centerX;
  const dy = point.y - centerY;
  return {
    x: centerX + dx * cos - dy * sin,
    y: centerY + dx * sin + dy * cos
  };
}

/**
 * Apply rotation to an array of points if shape has rotation
 * Note: Points, defaultCenter, and rotationCenterX/Y should all be denormalized (pixel coords)
 */
function applyRotationToPoints(
  points: IPoint[],
  shape: IShape,
  defaultCenterX: number,
  defaultCenterY: number
): IPoint[] {
  if (!shape.rotation) {
    return points;
  }

  // Use custom rotation center if set, otherwise use default (both should be denormalized)
  const centerX = shape.rotationCenterX !== undefined ? shape.rotationCenterX : defaultCenterX;
  const centerY = shape.rotationCenterY !== undefined ? shape.rotationCenterY : defaultCenterY;

  return points.map(p => rotatePoint(p, centerX, centerY, shape.rotation!));
}

/**
 * Convert sm-annotate coordinates to OpenRV normalized device coordinates.
 *
 * sm-annotate uses:
 * - (0, 0) is the top-left corner
 * - X: 0 (left) to 1 (right)
 * - Y: 0 (top) to 1 (bottom)
 *
 * OpenRV uses NDC where:
 * - (0, 0) is the center of the image
 * - X: -1 (left) to +1 (right)
 * - Y: -1/aspect (bottom) to +1/aspect (top), where aspect = width/height
 */
function convertSmAnnotateToOpenRV(
  smX: number,
  smY: number,
  aspectRatio: number
): { x: number; y: number } {
  // Convert from 0..1 to OpenRV NDC
  // X: -1 to +1
  // Y: -1/aspect to +1/aspect (inverted because sm-annotate Y+ is down, OpenRV Y+ is up)
  // The Y range is scaled by aspect ratio to maintain proper proportions
  return {
    x: smX * 2 - 1,
    y: (1 - smY * 2) / aspectRatio,
  };
}

/**
 * Pen component data structure for building GTO
 */
interface PenComponentData {
  name: string;
  frame: number;
  color: [number, number, number, number];
  width: number[];
  points: number[][];
  brush: string;
}

/**
 * Text component data structure for building GTO
 */
interface TextComponentData {
  name: string;
  frame: number;
  position: [number, number];
  color: [number, number, number, number];
  text: string;
  size: number;
  rotation: number;
}

/**
 * Convert curve shape to pen component data
 */
function curveToPenData(shape: ICurve, id: number, frame: number, width: number, height: number): PenComponentData {
  const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
  const aspectRatio = width / height;

  // Calculate center for rotation (average of all points)
  let centerX = 0, centerY = 0;
  for (const p of shape.points) {
    centerX += p.x;
    centerY += p.y;
  }
  centerX /= shape.points.length;
  centerY /= shape.points.length;

  const points = applyRotationToPoints(shape.points, shape, centerX, centerY);

  // Create width array (one value per point) - OpenRV format uses normalized width (relative to height)
  const normalizedWidth = shape.lineWidth / height;
  const widthArray = new Array(points.length).fill(normalizedWidth);

  // Convert points to OpenRV NDC
  const convertedPoints = points.map(p => {
    const converted = convertSmAnnotateToOpenRV(p.x, p.y, aspectRatio);
    return [converted.x, converted.y];
  });

  return {
    name: `pen:${id}:${frame}:User`,
    frame,
    color,
    width: widthArray,
    points: convertedPoints,
    brush: 'circle'
  };
}

/**
 * Convert line shape to pen component data (2-point curve)
 */
function lineToPenData(shape: ILine, id: number, frame: number, width: number, height: number): PenComponentData {
  const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
  const aspectRatio = width / height;

  // Center is midpoint of line
  const centerX = (shape.x1 + shape.x2) / 2;
  const centerY = (shape.y1 + shape.y2) / 2;

  let points: IPoint[] = [
    { x: shape.x1, y: shape.y1 },
    { x: shape.x2, y: shape.y2 }
  ];
  points = applyRotationToPoints(points, shape, centerX, centerY);

  const normalizedWidth = shape.lineWidth / height;
  const widthArray = new Array(points.length).fill(normalizedWidth);

  const convertedPoints = points.map(p => {
    const converted = convertSmAnnotateToOpenRV(p.x, p.y, aspectRatio);
    return [converted.x, converted.y];
  });

  return {
    name: `pen:${id}:${frame}:User`,
    frame,
    color,
    width: widthArray,
    points: convertedPoints,
    brush: 'circle'
  };
}

/**
 * Convert arrow shape to pen component data (line + arrowhead strokes)
 */
function arrowToPenDataArray(shape: IArrow, id: number, frame: number, width: number, height: number): PenComponentData[] {
  const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
  const aspectRatio = width / height;

  // Center is midpoint of arrow line
  const centerX = (shape.x1 + shape.x2) / 2;
  const centerY = (shape.y1 + shape.y2) / 2;

  // Main line
  let linePoints: IPoint[] = [
    { x: shape.x1, y: shape.y1 },
    { x: shape.x2, y: shape.y2 }
  ];

  // Arrowhead calculation - normalize to coordinate system (0-1)
  const headLengthPx = 10 + 2.5 * shape.lineWidth;
  const headLength = headLengthPx / ((width + height) / 2);
  const headAngle = Math.PI / 6;
  const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);

  let arrowHead1: IPoint[] = [
    { x: shape.x2, y: shape.y2 },
    {
      x: shape.x2 - headLength * Math.cos(angle + headAngle),
      y: shape.y2 - headLength * Math.sin(angle + headAngle)
    }
  ];

  let arrowHead2: IPoint[] = [
    { x: shape.x2, y: shape.y2 },
    {
      x: shape.x2 - headLength * Math.cos(angle - headAngle),
      y: shape.y2 - headLength * Math.sin(angle - headAngle)
    }
  ];

  // Apply rotation to all points
  linePoints = applyRotationToPoints(linePoints, shape, centerX, centerY);
  arrowHead1 = applyRotationToPoints(arrowHead1, shape, centerX, centerY);
  arrowHead2 = applyRotationToPoints(arrowHead2, shape, centerX, centerY);

  const normalizedWidth = shape.lineWidth / height;
  const widthArray2 = new Array(2).fill(normalizedWidth);

  const convertPoints = (pts: IPoint[]) => pts.map(p => {
    const converted = convertSmAnnotateToOpenRV(p.x, p.y, aspectRatio);
    return [converted.x, converted.y];
  });

  return [
    {
      name: `pen:${id}:${frame}:User`,
      frame,
      color,
      width: widthArray2,
      points: convertPoints(linePoints),
      brush: 'circle'
    },
    {
      name: `pen:${id + 1}:${frame}:User`,
      frame,
      color,
      width: widthArray2,
      points: convertPoints(arrowHead1),
      brush: 'circle'
    },
    {
      name: `pen:${id + 2}:${frame}:User`,
      frame,
      color,
      width: widthArray2,
      points: convertPoints(arrowHead2),
      brush: 'circle'
    }
  ];
}

/**
 * Convert rectangle shape to pen component data (5-point closed path)
 */
function rectangleToPenData(shape: IRectangle, id: number, frame: number, width: number, height: number): PenComponentData {
  const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
  const aspectRatio = width / height;

  // Center is center of rectangle
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  // Convert rectangle to 5 points (closed path)
  let points: IPoint[] = [
    { x: shape.x, y: shape.y },
    { x: shape.x + shape.width, y: shape.y },
    { x: shape.x + shape.width, y: shape.y + shape.height },
    { x: shape.x, y: shape.y + shape.height },
    { x: shape.x, y: shape.y }, // Close the path
  ];

  points = applyRotationToPoints(points, shape, centerX, centerY);

  const normalizedWidth = shape.lineWidth / height;
  const widthArray = new Array(points.length).fill(normalizedWidth);

  const convertedPoints = points.map(p => {
    const converted = convertSmAnnotateToOpenRV(p.x, p.y, aspectRatio);
    return [converted.x, converted.y];
  });

  return {
    name: `pen:${id}:${frame}:User`,
    frame,
    color,
    width: widthArray,
    points: convertedPoints,
    brush: 'circle'
  };
}

/**
 * Convert circle shape to pen component data (approximated as polygon)
 */
function circleToPenData(shape: ICircle, id: number, frame: number, width: number, height: number, segments: number = 32): PenComponentData {
  const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
  const aspectRatio = width / height;

  // Center is center of circle
  const centerX = shape.x;
  const centerY = shape.y;

  // Approximate circle with polygon
  let points: IPoint[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push({
      x: shape.x + Math.cos(angle) * shape.radius,
      y: shape.y + Math.sin(angle) * shape.radius
    });
  }

  points = applyRotationToPoints(points, shape, centerX, centerY);

  const normalizedWidth = shape.lineWidth / height;
  const widthArray = new Array(points.length).fill(normalizedWidth);

  const convertedPoints = points.map(p => {
    const converted = convertSmAnnotateToOpenRV(p.x, p.y, aspectRatio);
    return [converted.x, converted.y];
  });

  return {
    name: `pen:${id}:${frame}:User`,
    frame,
    color,
    width: widthArray,
    points: convertedPoints,
    brush: 'circle'
  };
}

/**
 * Convert text shape to text component data
 */
function textToTextData(shape: IText, id: number, frame: number, width: number, height: number): TextComponentData {
  const color = extractColor(shape.fillStyle, shape.opacity ?? 1);
  const aspectRatio = width / height;

  // Apply rotation to position if set
  let posX = shape.x;
  let posY = shape.y;
  let textRotation = 0;
  if (shape.rotation) {
    const centerX = shape.rotationCenterX ?? shape.x;
    const centerY = shape.rotationCenterY ?? shape.y;
    const rotated = rotatePoint({ x: shape.x, y: shape.y }, centerX, centerY, shape.rotation);
    posX = rotated.x;
    posY = rotated.y;
    // OpenRV text rotation is in degrees
    textRotation = (shape.rotation * 180) / Math.PI;
  }

  // Convert position from sm-annotate to OpenRV coordinates
  const openrvPos = convertSmAnnotateToOpenRV(posX, posY, aspectRatio);

  // Font size: OpenRV uses normalized size (relative to height)
  const fontSize = 16 + (shape.lineWidth ?? 1) * 0.5;
  const normalizedSize = fontSize / height;

  return {
    name: `text:${id}:${frame}:User`,
    frame,
    position: [openrvPos.x, openrvPos.y],
    color,
    text: shape.text,
    size: normalizedSize,
    rotation: textRotation
  };
}

/**
 * Convert a shape to component data
 */
function shapeToComponentData(
  shape: IShape,
  id: number,
  frame: number,
  width: number,
  height: number
): { penData: PenComponentData[]; textData: TextComponentData[]; nextId: number } {
  const penData: PenComponentData[] = [];
  const textData: TextComponentData[] = [];
  let nextId = id;

  switch (shape.type) {
    case 'curve':
      penData.push(curveToPenData(shape as ICurve, nextId, frame, width, height));
      nextId++;
      break;
    case 'line':
      penData.push(lineToPenData(shape as ILine, nextId, frame, width, height));
      nextId++;
      break;
    case 'arrow':
      const arrowData = arrowToPenDataArray(shape as IArrow, nextId, frame, width, height);
      penData.push(...arrowData);
      nextId += arrowData.length;
      break;
    case 'rectangle':
      penData.push(rectangleToPenData(shape as IRectangle, nextId, frame, width, height));
      nextId++;
      break;
    case 'circle':
      penData.push(circleToPenData(shape as ICircle, nextId, frame, width, height));
      nextId++;
      break;
    case 'text':
      textData.push(textToTextData(shape as IText, nextId, frame, width, height));
      nextId++;
      break;
    // Skip non-visual shapes
    case 'eraser':
    case 'move':
    case 'image':
    case 'compare':
    case 'audio-peaks':
    case 'selection':
      break;
  }

  return { penData, textData, nextId };
}

/**
 * Build GTO data structure from frames
 */
function buildGTOData(
  frames: FrameAnnotationV1[],
  options: OpenRVExportOptions
): ReturnType<GTOBuilder['build']> {
  const { mediaPath, width, height, sessionName = 'sm-annotate-session' } = options;

  // Collect all component data
  const allPenData: PenComponentData[] = [];
  const allTextData: TextComponentData[] = [];
  let nextId = 0;

  for (const frameData of frames) {
    for (const shape of frameData.shapes) {
      const result = shapeToComponentData(shape, nextId, frameData.frame, width, height);
      allPenData.push(...result.penData);
      allTextData.push(...result.textData);
      nextId = result.nextId;
    }
  }

  // Build frame order map
  const frameOrders = new Map<number, string[]>();
  for (const pen of allPenData) {
    if (!frameOrders.has(pen.frame)) {
      frameOrders.set(pen.frame, []);
    }
    frameOrders.get(pen.frame)!.push(pen.name);
  }
  for (const text of allTextData) {
    if (!frameOrders.has(text.frame)) {
      frameOrders.set(text.frame, []);
    }
    frameOrders.get(text.frame)!.push(text.name);
  }

  // Build GTO structure using GTOBuilder
  const builder = new GTOBuilder();

  // RVSession object
  builder
    .object('RVSession', 'RVSession', 4)
    .component('session')
    .string('name', sessionName)
    .int('version', 4)
    .end()
    .end();

  // RVFileSource object
  builder
    .object('sourceGroup000000_source', 'RVFileSource', 1)
    .component('media')
    .string('movie', mediaPath)
    .end()
    .component('request')
    .int('width', width)
    .int('height', height)
    .end()
    .end();

  // RVPaint object with all annotations
  if (allPenData.length > 0 || allTextData.length > 0) {
    const paintObj = builder.object('sourceGroup000000_paint', 'RVPaint', 3);

    // Paint metadata component
    paintObj
      .component('paint')
      .int('nextId', nextId)
      .int('nextAnnotationId', 0)
      .int('show', 1)
      .string('exclude', [])
      .string('include', [])
      .end();

    // Add pen components
    for (const pen of allPenData) {
      paintObj
        .component(pen.name)
        .float4('color', [pen.color])
        .float('width', pen.width)
        .string('brush', pen.brush)
        .float2('points', pen.points)
        .int('debug', 0)
        .int('join', 3)
        .int('cap', 1)
        .int('splat', 0)
        .end();
    }

    // Add text components
    for (const text of allTextData) {
      paintObj
        .component(text.name)
        .float2('position', [text.position])
        .float4('color', [text.color])
        .float('spacing', 0.8)
        .float('size', text.size)
        .float('scale', 1)
        .float('rotation', text.rotation)
        .string('font', '')
        .string('text', text.text)
        .string('origin', '')
        .int('debug', 0)
        .end();
    }

    // Add frame order components
    for (const [frame, order] of frameOrders) {
      paintObj
        .component(`frame:${frame}`)
        .string('order', order)
        .end();
    }

    paintObj.end();
  }

  return builder.build();
}

/**
 * Export annotations to OpenRV GTO format string
 */
export function exportToOpenRV(
  frames: FrameAnnotationV1[],
  options: OpenRVExportOptions
): string {
  const { mediaPath, width, height } = options;
  const gtoData = buildGTOData(frames, options);
  const output = SimpleWriter.write(gtoData) as string;

  // Add header comments
  const header = [
    'GTOa (4)',
    '',
    '# Generated by sm-annotate OpenRV exporter',
    `# Media: ${mediaPath}`,
    `# Resolution: ${width}x${height}`,
    ''
  ].join('\n');

  // Remove the GTOa (4) line from the output since we're adding our own header
  const outputWithoutHeader = output.replace(/^GTOa \(\d+\)\s*\n?/, '');

  return header + outputWithoutHeader;
}

/**
 * Export annotations to OpenRV GTO binary format
 */
export function exportToOpenRVBinary(
  frames: FrameAnnotationV1[],
  options: OpenRVExportOptions
): ArrayBuffer {
  const gtoData = buildGTOData(frames, options);
  return SimpleWriter.write(gtoData, { binary: true }) as ArrayBuffer;
}

/**
 * Download annotations as OpenRV .rv file
 */
export function downloadAsOpenRV(
  frames: FrameAnnotationV1[],
  options: OpenRVExportOptions,
  filename: string = 'annotations.rv'
): void {
  const content = exportToOpenRV(frames, options);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download annotations as OpenRV .gto binary file
 */
export function downloadAsOpenRVBinary(
  frames: FrameAnnotationV1[],
  options: OpenRVExportOptions,
  filename: string = 'annotations.gto'
): void {
  const content = exportToOpenRVBinary(frames, options);
  const blob = new Blob([content], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
