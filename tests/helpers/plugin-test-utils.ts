import { vi } from 'vitest';
import {
  createMockContext,
  createMockAnnotationTool,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './mock-context';
import type { AnnotationTool } from '../../src/core';
import type { IShape } from '../../src/plugins';
import type { IRectangle } from '../../src/plugins/rectangle';
import type { ICircle } from '../../src/plugins/circle';
import type { ILine } from '../../src/plugins/line';
import type { IArrow } from '../../src/plugins/arrow';
import type { ICurve } from '../../src/plugins/curve';
import type { IText } from '../../src/plugins/text';
import type { IImage } from '../../src/plugins/image';
import type { ISelection } from '../../src/plugins/selection';

/**
 * Result of plugin test setup
 */
export interface PluginTestContext<T> {
  plugin: T;
  mockCtx: MockCanvasContext;
  mockAnnotationTool: MockAnnotationTool;
}

/**
 * Creates a standard plugin test context with mock context and annotation tool
 */
export function createPluginTestContext<T>(
  PluginClass: new (annotationTool: AnnotationTool) => T,
  customizeMockCtx?: (ctx: MockCanvasContext) => void,
  customizeMockTool?: (tool: MockAnnotationTool) => void
): PluginTestContext<T> {
  const mockCtx = createMockContext();
  if (customizeMockCtx) {
    customizeMockCtx(mockCtx);
  }

  const mockAnnotationTool = createMockAnnotationTool(mockCtx);
  if (customizeMockTool) {
    customizeMockTool(mockAnnotationTool);
  }

  const plugin = new PluginClass(asAnnotationTool(mockAnnotationTool));

  return { plugin, mockCtx, mockAnnotationTool };
}

/**
 * Creates a prototype-based plugin for testing static methods like normalize, move, isPointerAtShape
 * without requiring full plugin instantiation
 */
export function createPrototypePlugin<T>(PluginClass: { prototype: T }): T {
  return Object.create(PluginClass.prototype);
}

/**
 * Creates a mock pluginForTool function that returns a plugin with common methods
 */
export interface MockPluginOptions {
  isPointerAtShape?: boolean | ((shape: IShape, x: number, y: number) => boolean);
  move?: (shape: IShape, dx: number, dy: number) => IShape;
  draw?: () => void;
  save?: () => void;
}

export function createMockPluginForTool(options: MockPluginOptions = {}) {
  const isPointerAtShapeFn = typeof options.isPointerAtShape === 'function'
    ? options.isPointerAtShape
    : () => options.isPointerAtShape ?? false;

  return vi.fn(() => ({
    isPointerAtShape: vi.fn(isPointerAtShapeFn),
    move: vi.fn(options.move ?? ((s: IShape) => s)),
    draw: vi.fn(options.draw ?? (() => {})),
    save: vi.fn(options.save ?? (() => {})),
  }));
}

/**
 * Creates a mock video element with specified dimensions
 */
export interface MockVideoOptions {
  videoWidth?: number;
  videoHeight?: number;
  currentTime?: number;
}

export function createMockVideo(options: MockVideoOptions = {}): HTMLVideoElement {
  const video = document.createElement('video');
  Object.defineProperty(video, 'videoWidth', { value: options.videoWidth ?? 800 });
  Object.defineProperty(video, 'videoHeight', { value: options.videoHeight ?? 600 });
  if (options.currentTime !== undefined) {
    Object.defineProperty(video, 'currentTime', { value: options.currentTime });
  }
  return video;
}

/**
 * Creates a mock video frame buffer
 */
export interface MockFrameBufferOptions {
  frameNumber?: number;
  frame?: { width: number; height: number } | null;
  audioFingerprint?: number[];
  signatureFrame?: number;
}

export function createMockVideoFrameBuffer(options: MockFrameBufferOptions = {}) {
  return {
    frameNumberFromTime: vi.fn(() => options.frameNumber ?? 30),
    getFrame: vi.fn(() => options.frame ?? { width: 800, height: 600 }),
    getAudioFingerprint: vi.fn(() => options.audioFingerprint ?? [0.1, 0.2, 0.3]),
  };
}

export function createMockReferenceVideoFrameBuffer(options: MockFrameBufferOptions = {}) {
  return {
    frameNumberFromTime: vi.fn(() => options.frameNumber ?? 30),
    getFrame: vi.fn(() => options.frame ?? { width: 800, height: 600 }),
    getAudioFingerprint: vi.fn(() => options.audioFingerprint ?? [0.1, 0.2, 0.3]),
    getFrameNumberBySignature: vi.fn(() => options.signatureFrame ?? 32),
  };
}

/**
 * Shape deserializer factory - creates a mock deserialize function for move tests
 */
export type DeserializeConfig = {
  [K in IShape['type']]?: (shape: IShape) => IShape;
};

export function createMockDeserialize(config: DeserializeConfig = {}) {
  return vi.fn((shapes: IShape[]) =>
    shapes.map((s) => {
      const handler = config[s.type];
      if (handler) {
        return handler(s);
      }
      return s;
    })
  );
}

// Common deserializer configurations
export const deserializeRectangle = (shape: IShape): IShape => {
  if (shape.type !== 'rectangle') return shape;
  const rect = shape as IRectangle;
  return {
    ...rect,
    x: rect.x * 800,
    y: rect.y * 600,
    width: rect.width * 800,
    height: rect.height * 600,
  };
};

export const deserializeCircle = (shape: IShape): IShape => {
  if (shape.type !== 'circle') return shape;
  const circle = shape as ICircle;
  return {
    ...circle,
    x: circle.x * 800,
    y: circle.y * 600,
    radius: circle.radius * 800,
  };
};

export const deserializeLine = (shape: IShape): IShape => {
  if (shape.type !== 'line') return shape;
  const line = shape as ILine;
  return {
    ...line,
    x1: line.x1 * 800,
    y1: line.y1 * 600,
    x2: line.x2 * 800,
    y2: line.y2 * 600,
  };
};

export const deserializeArrow = (shape: IShape): IShape => {
  if (shape.type !== 'arrow') return shape;
  const arrow = shape as IArrow;
  return {
    ...arrow,
    x1: arrow.x1 * 800,
    y1: arrow.y1 * 600,
    x2: arrow.x2 * 800,
    y2: arrow.y2 * 600,
  };
};

export const deserializeCurve = (shape: IShape): IShape => {
  if (shape.type !== 'curve') return shape;
  const curve = shape as ICurve;
  return {
    ...curve,
    points: curve.points.map((p) => ({ x: p.x * 800, y: p.y * 600 })),
  };
};

export const deserializeText = (shape: IShape): IShape => {
  if (shape.type !== 'text') return shape;
  const text = shape as IText;
  return {
    ...text,
    x: text.x * 800,
    y: text.y * 600,
  };
};

export const deserializeImage = (shape: IShape): IShape => {
  if (shape.type !== 'image') return shape;
  const img = shape as IImage;
  return {
    ...img,
    x: img.x * 800,
    y: img.y * 600,
    width: img.width * 800,
    height: img.height * 600,
  };
};

export const deserializeSelection = (shape: IShape): IShape => {
  if (shape.type !== 'selection') return shape;
  const sel = shape as ISelection;
  return {
    ...sel,
    x: sel.x * 800,
    y: sel.y * 600,
    width: sel.width * 800,
    height: sel.height * 600,
  };
};

/**
 * Creates a mock deserializer that handles all common shape types
 */
export function createFullMockDeserialize() {
  return createMockDeserialize({
    rectangle: deserializeRectangle,
    circle: deserializeCircle,
    line: deserializeLine,
    arrow: deserializeArrow,
    curve: deserializeCurve,
    text: deserializeText,
    image: deserializeImage,
    selection: deserializeSelection,
  });
}

/**
 * Sets up canvas-related mocks on the mock context
 */
export function setupCanvasMocks(mockCtx: MockCanvasContext) {
  mockCtx.save = vi.fn();
  mockCtx.restore = vi.fn();
  mockCtx.fillRect = vi.fn();
  mockCtx.strokeRect = vi.fn();
  mockCtx.clearRect = vi.fn();
  mockCtx.setLineDash = vi.fn();
  mockCtx.drawImage = vi.fn();
  mockCtx.clip = vi.fn();
  mockCtx.closePath = vi.fn();
}

/**
 * Sets up standard drawing mocks on annotation tool
 */
export function setupDrawingMocks(mockAnnotationTool: MockAnnotationTool) {
  mockAnnotationTool.clearCanvas = vi.fn();
  mockAnnotationTool.addVideoOverlay = vi.fn();
  mockAnnotationTool.drawShapesOverlay = vi.fn();
  mockAnnotationTool.redrawFullCanvas = vi.fn();
}
