/**
 * OpenRV GTO Exporter
 *
 * Exports sm-annotate annotations to OpenRV .rv (GTO text format) files.
 *
 * OpenRV uses RVPaint nodes to store annotations with components like:
 * - pen:N:frame:F - Freehand strokes (curves)
 * - text:N:frame:F - Text annotations
 * - rect:N:frame:F - Rectangle annotations (approximated as pen strokes)
 *
 * GTO Format Reference: https://aswf-openrv.readthedocs.io/en/latest/rv-manuals/rv-gto.html
 */

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

interface GTOComponent {
  name: string;
  properties: GTOProperty[];
}

interface GTOProperty {
  type: string;
  dimensions?: number;
  name: string;
  value: string | number | number[] | string[];
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
 * - Y: -1 (bottom) to +1 (top)
 */
function convertSmAnnotateToOpenRV(
  smX: number,
  smY: number,
  _aspectRatio: number
): { x: number; y: number } {
  // Convert from 0..1 to OpenRV NDC
  // X: -1 to +1
  // Y: -1 to +1 (inverted because sm-annotate Y+ is down, OpenRV Y+ is up)
  return {
    x: smX * 2 - 1,
    y: 1 - smY * 2,
  };
}

/**
 * Format a float array for GTO output (nested format)
 * Outputs: [ [ v1 v2 v3 ... ] ] for single vectors
 */
function formatFloatArray(arr: number[]): string {
  return `[ [ ${arr.map(n => formatNumber(n)).join(' ')} ] ]`;
}

/**
 * Format a simple flat array for GTO output
 */
function formatFlatArray(arr: number[]): string {
  return `[ ${arr.map(n => formatNumber(n)).join(' ')} ]`;
}

/**
 * Format a number for GTO output
 */
function formatNumber(n: number): string {
  // Use fixed point for most numbers, but keep reasonable precision
  if (Number.isInteger(n)) {
    return String(n);
  }
  return n.toFixed(9).replace(/\.?0+$/, '') || '0';
}

/**
 * Format points array for GTO (nested array of x y pairs)
 * Outputs: [ [ x1 y1 ] [ x2 y2 ] ... ]
 * Converts from sm-annotate coordinates to OpenRV NDC
 */
function formatPoints(points: IPoint[], aspectRatio: number): string {
  const pairs = points.map(p => {
    const converted = convertSmAnnotateToOpenRV(p.x, p.y, aspectRatio);
    return `[ ${formatNumber(converted.x)} ${formatNumber(converted.y)} ]`;
  });
  return `[ ${pairs.join(' ')} ]`;
}

/**
 * Convert curve shape to OpenRV pen component
 */
function curveToGTOComponent(shape: ICurve, id: number, frame: number, width: number, height: number): GTOComponent {
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

  return {
    name: `"pen:${id}:${frame}:User"`,
    properties: [
      { type: 'float', dimensions: 4, name: 'color', value: formatFloatArray(color) },
      { type: 'float', name: 'width', value: formatFlatArray(widthArray) },
      { type: 'string', name: 'brush', value: '"circle"' },
      { type: 'float', dimensions: 2, name: 'points', value: formatPoints(points, aspectRatio) },
      { type: 'int', name: 'debug', value: 0 },
      { type: 'int', name: 'join', value: 3 },
      { type: 'int', name: 'cap', value: 1 },
      { type: 'int', name: 'splat', value: 0 },
    ]
  };
}

/**
 * Convert line shape to OpenRV pen component (2-point curve)
 */
function lineToGTOComponent(shape: ILine, id: number, frame: number, width: number, height: number): GTOComponent {
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

  return {
    name: `"pen:${id}:${frame}:User"`,
    properties: [
      { type: 'float', dimensions: 4, name: 'color', value: formatFloatArray(color) },
      { type: 'float', name: 'width', value: formatFlatArray(widthArray) },
      { type: 'string', name: 'brush', value: '"circle"' },
      { type: 'float', dimensions: 2, name: 'points', value: formatPoints(points, aspectRatio) },
      { type: 'int', name: 'debug', value: 0 },
      { type: 'int', name: 'join', value: 3 },
      { type: 'int', name: 'cap', value: 1 },
      { type: 'int', name: 'splat', value: 0 },
    ]
  };
}

/**
 * Convert arrow shape to OpenRV pen component (line + arrowhead strokes)
 */
function arrowToGTOComponents(shape: IArrow, id: number, frame: number, width: number, height: number): GTOComponent[] {
  const color = extractColor(shape.strokeStyle, shape.opacity ?? 1);
  const colorStr = formatFloatArray(color);
  const aspectRatio = width / height;

  // Center is midpoint of arrow line
  const centerX = (shape.x1 + shape.x2) / 2;
  const centerY = (shape.y1 + shape.y2) / 2;

  // Main line
  let linePoints: IPoint[] = [
    { x: shape.x1, y: shape.y1 },
    { x: shape.x2, y: shape.y2 }
  ];

  // Arrowhead calculation
  const headLength = 10 + 2.5 * shape.lineWidth;
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

  return [
    {
      name: `"pen:${id}:${frame}:User"`,
      properties: [
        { type: 'float', dimensions: 4, name: 'color', value: colorStr },
        { type: 'float', name: 'width', value: formatFlatArray(widthArray2) },
        { type: 'string', name: 'brush', value: '"circle"' },
        { type: 'float', dimensions: 2, name: 'points', value: formatPoints(linePoints, aspectRatio) },
        { type: 'int', name: 'debug', value: 0 },
        { type: 'int', name: 'join', value: 3 },
        { type: 'int', name: 'cap', value: 1 },
        { type: 'int', name: 'splat', value: 0 },
      ]
    },
    {
      name: `"pen:${id + 1}:${frame}:User"`,
      properties: [
        { type: 'float', dimensions: 4, name: 'color', value: colorStr },
        { type: 'float', name: 'width', value: formatFlatArray(widthArray2) },
        { type: 'string', name: 'brush', value: '"circle"' },
        { type: 'float', dimensions: 2, name: 'points', value: formatPoints(arrowHead1, aspectRatio) },
        { type: 'int', name: 'debug', value: 0 },
        { type: 'int', name: 'join', value: 3 },
        { type: 'int', name: 'cap', value: 1 },
        { type: 'int', name: 'splat', value: 0 },
      ]
    },
    {
      name: `"pen:${id + 2}:${frame}:User"`,
      properties: [
        { type: 'float', dimensions: 4, name: 'color', value: colorStr },
        { type: 'float', name: 'width', value: formatFlatArray(widthArray2) },
        { type: 'string', name: 'brush', value: '"circle"' },
        { type: 'float', dimensions: 2, name: 'points', value: formatPoints(arrowHead2, aspectRatio) },
        { type: 'int', name: 'debug', value: 0 },
        { type: 'int', name: 'join', value: 3 },
        { type: 'int', name: 'cap', value: 1 },
        { type: 'int', name: 'splat', value: 0 },
      ]
    }
  ];
}

/**
 * Convert rectangle shape to OpenRV pen component (4-point closed path)
 */
function rectangleToGTOComponent(shape: IRectangle, id: number, frame: number, width: number, height: number): GTOComponent {
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

  return {
    name: `"pen:${id}:${frame}:User"`,
    properties: [
      { type: 'float', dimensions: 4, name: 'color', value: formatFloatArray(color) },
      { type: 'float', name: 'width', value: formatFlatArray(widthArray) },
      { type: 'string', name: 'brush', value: '"circle"' },
      { type: 'float', dimensions: 2, name: 'points', value: formatPoints(points, aspectRatio) },
      { type: 'int', name: 'debug', value: 0 },
      { type: 'int', name: 'join', value: 3 },
      { type: 'int', name: 'cap', value: 1 },
      { type: 'int', name: 'splat', value: 0 },
    ]
  };
}

/**
 * Convert circle shape to OpenRV pen component (approximated as polygon)
 */
function circleToGTOComponent(shape: ICircle, id: number, frame: number, width: number, height: number, segments: number = 32): GTOComponent {
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

  return {
    name: `"pen:${id}:${frame}:User"`,
    properties: [
      { type: 'float', dimensions: 4, name: 'color', value: formatFloatArray(color) },
      { type: 'float', name: 'width', value: formatFlatArray(widthArray) },
      { type: 'string', name: 'brush', value: '"circle"' },
      { type: 'float', dimensions: 2, name: 'points', value: formatPoints(points, aspectRatio) },
      { type: 'int', name: 'debug', value: 0 },
      { type: 'int', name: 'join', value: 3 },
      { type: 'int', name: 'cap', value: 1 },
      { type: 'int', name: 'splat', value: 0 },
    ]
  };
}

/**
 * Convert text shape to OpenRV text component
 * Note: OpenRV text doesn't support rotation natively, so rotation is applied to the position only
 */
function textToGTOComponent(shape: IText, id: number, frame: number, width: number, height: number): GTOComponent {
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
  // sm-annotate lineWidth is in pixels, convert to normalized
  const fontSize = 16 + (shape.lineWidth ?? 1) * 0.5;
  const normalizedSize = fontSize / height;

  return {
    name: `"text:${id}:${frame}:User"`,
    properties: [
      { type: 'float', dimensions: 2, name: 'position', value: formatFloatArray([openrvPos.x, openrvPos.y]) },
      { type: 'float', dimensions: 4, name: 'color', value: formatFloatArray(color) },
      { type: 'float', name: 'spacing', value: 0.8 },
      { type: 'float', name: 'size', value: normalizedSize },
      { type: 'float', name: 'scale', value: 1 },
      { type: 'float', name: 'rotation', value: textRotation },
      { type: 'string', name: 'font', value: '""' },
      { type: 'string', name: 'text', value: `"${shape.text.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"` },
      { type: 'string', name: 'origin', value: '""' },
      { type: 'int', name: 'debug', value: 0 },
    ]
  };
}

/**
 * Convert a shape to GTO components
 * Shapes are stored with 0-1 normalized coordinates in sm-annotate.
 * The component functions handle conversion to OpenRV's NDC coordinate system.
 */
function shapeToGTOComponents(
  shape: IShape,
  id: number,
  frame: number,
  width: number,
  height: number
): GTOComponent[] {
  // Note: Shapes use 0-1 normalized coordinates. The component functions
  // convert to OpenRV's NDC format (centered at 0, -1 to 1 range).
  switch (shape.type) {
    case 'curve':
      return [curveToGTOComponent(shape as ICurve, id, frame, width, height)];
    case 'line':
      return [lineToGTOComponent(shape as ILine, id, frame, width, height)];
    case 'arrow':
      return arrowToGTOComponents(shape as IArrow, id, frame, width, height);
    case 'rectangle':
      return [rectangleToGTOComponent(shape as IRectangle, id, frame, width, height)];
    case 'circle':
      return [circleToGTOComponent(shape as ICircle, id, frame, width, height)];
    case 'text':
      return [textToGTOComponent(shape as IText, id, frame, width, height)];
    // Skip non-visual shapes
    case 'eraser':
    case 'move':
    case 'image':
    case 'compare':
    case 'audio-peaks':
    case 'selection':
      return [];
    default:
      return [];
  }
}

/**
 * Format a GTO component to string
 */
function formatGTOComponent(component: GTOComponent): string {
  const lines: string[] = [];
  lines.push(`    ${component.name}`);
  lines.push(`    {`);

  for (const prop of component.properties) {
    const typeStr = prop.dimensions ? `${prop.type}[${prop.dimensions}]` : prop.type;
    const valueStr = typeof prop.value === 'string' ? prop.value : String(prop.value);
    lines.push(`        ${typeStr} ${prop.name} = ${valueStr}`);
  }

  lines.push(`    }`);
  return lines.join('\n');
}

/**
 * Export annotations to OpenRV GTO format string
 */
export function exportToOpenRV(
  frames: FrameAnnotationV1[],
  options: OpenRVExportOptions
): string {
  const { mediaPath, width, height, sessionName = 'sm-annotate-session' } = options;

  const lines: string[] = [];

  // GTO Header
  lines.push('GTOa (4)');
  lines.push('');
  lines.push('# Generated by sm-annotate OpenRV exporter');
  lines.push(`# Media: ${mediaPath}`);
  lines.push(`# Resolution: ${width}x${height}`);
  lines.push('');

  // RVSession object
  lines.push(`RVSession : RVSession (4)`);
  lines.push(`{`);
  lines.push(`    session`);
  lines.push(`    {`);
  lines.push(`        string name = "${sessionName}"`);
  lines.push(`        int version = 4`);
  lines.push(`    }`);
  lines.push(`}`);
  lines.push('');

  // RVSourceGroup for media
  lines.push(`sourceGroup000000_source : RVFileSource (1)`);
  lines.push(`{`);
  lines.push(`    media`);
  lines.push(`    {`);
  lines.push(`        string movie = "${mediaPath}"`);
  lines.push(`    }`);
  lines.push(`    request`);
  lines.push(`    {`);
  lines.push(`        int width = ${width}`);
  lines.push(`        int height = ${height}`);
  lines.push(`    }`);
  lines.push(`}`);
  lines.push('');

  // Collect all paint components
  const components: GTOComponent[] = [];
  let nextId = 0;

  for (const frameData of frames) {
    for (const shape of frameData.shapes) {
      const shapeComponents = shapeToGTOComponents(
        shape,
        nextId,
        frameData.frame,
        width,
        height
      );
      components.push(...shapeComponents);
      nextId += shapeComponents.length;
    }
  }

  if (components.length > 0) {
    // Build frame order map
    const frameOrders = new Map<number, string[]>();
    for (const comp of components) {
      // Component name format: "type:ID:FRAME:User" - extract the frame number
      // Name is quoted now, e.g., "pen:0:5:User"
      const frameMatch = comp.name.match(/:\d+:(\d+):/);
      if (frameMatch) {
        const frame = parseInt(frameMatch[1]);
        if (!frameOrders.has(frame)) {
          frameOrders.set(frame, []);
        }
        // Store the inner name without outer quotes for the order list
        const innerName = comp.name.startsWith('"') && comp.name.endsWith('"')
          ? comp.name.slice(1, -1)
          : comp.name;
        frameOrders.get(frame)!.push(innerName);
      }
    }

    // RVPaint node
    lines.push(`sourceGroup000000_paint : RVPaint (3)`);
    lines.push(`{`);
    lines.push(`    paint`);
    lines.push(`    {`);
    lines.push(`        int nextId = ${nextId}`);
    lines.push(`        int nextAnnotationId = 0`);
    lines.push(`        int show = 1`);
    lines.push(`        string exclude = [ ]`);
    lines.push(`        string include = [ ]`);
    lines.push(`    }`);

    // Add all shape components first
    for (const component of components) {
      lines.push(formatGTOComponent(component));
    }

    // Add frame order components
    for (const [frame, order] of frameOrders) {
      lines.push(`    "frame:${frame}"`);
      lines.push(`    {`);
      lines.push(`        string order = [ ${order.map(o => `"${o}"`).join(' ')} ]`);
      lines.push(`    }`);
    }

    lines.push(`}`);
  }

  return lines.join('\n');
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
