import type { IRectangle } from '../../src/plugins/rectangle';
import type { ICircle } from '../../src/plugins/circle';
import type { ILine } from '../../src/plugins/line';
import type { IArrow } from '../../src/plugins/arrow';
import type { ICurve } from '../../src/plugins/curve';
import type { IText } from '../../src/plugins/text';
import type { IImage } from '../../src/plugins/image';
import type { ISelection } from '../../src/plugins/selection';
import type { IEraser } from '../../src/plugins/eraser';
import type { ICompare } from '../../src/plugins/compare';
import type { IShapeBase } from '../../src/plugins/base';

// Default style values used across all shapes
const DEFAULT_STROKE_STYLE = '#000';
const DEFAULT_FILL_STYLE = '#fff';
const DEFAULT_LINE_WIDTH = 1;

type ShapeStyle = Pick<IShapeBase, 'strokeStyle' | 'fillStyle' | 'lineWidth'>;

/**
 * Creates default shape style properties
 */
export function createShapeStyle(overrides?: Partial<ShapeStyle>): ShapeStyle {
  return {
    strokeStyle: DEFAULT_STROKE_STYLE,
    fillStyle: DEFAULT_FILL_STYLE,
    lineWidth: DEFAULT_LINE_WIDTH,
    ...overrides,
  };
}

// Rectangle factory
export interface RectangleOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
  opacity?: number;
}

export function createRectangle(options: RectangleOptions = {}): IRectangle {
  return {
    type: 'rectangle',
    x: options.x ?? 100,
    y: options.y ?? 50,
    width: options.width ?? 200,
    height: options.height ?? 100,
    ...createShapeStyle(options),
    ...(options.opacity !== undefined && { opacity: options.opacity }),
  };
}

// Circle factory
export interface CircleOptions {
  x?: number;
  y?: number;
  radius?: number;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createCircle(options: CircleOptions = {}): ICircle {
  return {
    type: 'circle',
    x: options.x ?? 100,
    y: options.y ?? 100,
    radius: options.radius ?? 50,
    ...createShapeStyle(options),
  };
}

// Line factory
export interface LineOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createLine(options: LineOptions = {}): ILine {
  return {
    type: 'line',
    x1: options.x1 ?? 100,
    y1: options.y1 ?? 100,
    x2: options.x2 ?? 200,
    y2: options.y2 ?? 100,
    ...createShapeStyle(options),
  };
}

// Arrow factory
export interface ArrowOptions {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createArrow(options: ArrowOptions = {}): IArrow {
  return {
    type: 'arrow',
    x1: options.x1 ?? 100,
    y1: options.y1 ?? 100,
    x2: options.x2 ?? 200,
    y2: options.y2 ?? 100,
    ...createShapeStyle(options),
  };
}

// Curve factory
export interface CurveOptions {
  points?: Array<{ x: number; y: number }>;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createCurve(options: CurveOptions = {}): ICurve {
  return {
    type: 'curve',
    points: options.points ?? [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 0 },
    ],
    ...createShapeStyle(options),
  };
}

// Text factory
export interface TextOptions {
  x?: number;
  y?: number;
  text?: string;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createText(options: TextOptions = {}): IText {
  return {
    type: 'text',
    x: options.x ?? 100,
    y: options.y ?? 100,
    text: options.text ?? 'Hello',
    ...createShapeStyle(options),
  };
}

// Image factory
export interface ImageOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  image?: HTMLImageElement;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createImage(options: ImageOptions = {}): IImage {
  return {
    type: 'image',
    x: options.x ?? 100,
    y: options.y ?? 50,
    width: options.width ?? 200,
    height: options.height ?? 150,
    image: options.image ?? new Image(),
    ...createShapeStyle(options),
  };
}

// Selection factory
export interface SelectionOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createSelection(options: SelectionOptions = {}): ISelection {
  return {
    type: 'selection',
    x: options.x ?? 100,
    y: options.y ?? 50,
    width: options.width ?? 200,
    height: options.height ?? 100,
    ...createShapeStyle(options),
  };
}

// Eraser factory
export interface EraserOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createEraser(options: EraserOptions = {}): IEraser {
  return {
    type: 'eraser',
    x: options.x ?? 100,
    y: options.y ?? 50,
    width: options.width ?? 200,
    height: options.height ?? 100,
    ...createShapeStyle(options),
  };
}

// Compare factory
export interface CompareOptions {
  x?: number;
  disabled?: boolean;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export function createCompare(options: CompareOptions = {}): ICompare {
  return {
    type: 'compare',
    x: options.x ?? 400,
    disabled: options.disabled ?? false,
    ...createShapeStyle(options),
  };
}

// Horizontal line (x1, y1) to (x2, y1) - useful for hit testing
export function createHorizontalLine(options: LineOptions = {}): ILine {
  const y = options.y1 ?? 100;
  return createLine({ ...options, y1: y, y2: y });
}

// Horizontal arrow
export function createHorizontalArrow(options: ArrowOptions = {}): IArrow {
  const y = options.y1 ?? 100;
  return createArrow({ ...options, y1: y, y2: y });
}

// Diagonal line from (0, 0) to (100, 100)
export function createDiagonalLine(options: LineOptions = {}): ILine {
  return createLine({ x1: 0, y1: 0, x2: 100, y2: 100, ...options });
}

// Diagonal arrow
export function createDiagonalArrow(options: ArrowOptions = {}): IArrow {
  return createArrow({ x1: 0, y1: 0, x2: 100, y2: 100, ...options });
}

// Zero-length line (a point)
export function createPointLine(x = 100, y = 100, lineWidth = 1): ILine {
  return createLine({ x1: x, y1: y, x2: x, y2: y, lineWidth });
}

// Zero-length arrow (a point)
export function createPointArrow(x = 100, y = 100, lineWidth = 1): IArrow {
  return createArrow({ x1: x, y1: y, x2: x, y2: y, lineWidth });
}

// Thin and thick shapes for tolerance testing
export function createThinShape<T extends IShapeBase>(factory: (options: { lineWidth: number }) => T): T {
  return factory({ lineWidth: 2 });
}

export function createThickShape<T extends IShapeBase>(factory: (options: { lineWidth: number }) => T): T {
  return factory({ lineWidth: 20 });
}
