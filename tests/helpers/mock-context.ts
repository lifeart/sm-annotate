import { vi, type Mock } from 'vitest';
import type { IShape } from '../../src/plugins';
import type { AnnotationTool } from '../../src/core';

export interface MockCanvasContext {
  beginPath: Mock;
  moveTo: Mock;
  lineTo: Mock;
  stroke: Mock;
  fill: Mock;
  arc: Mock;
  rect: Mock;
  fillText: Mock;
  fillRect: Mock;
  strokeRect: Mock;
  quadraticCurveTo: Mock;
  measureText: Mock;
  save: Mock;
  restore: Mock;
  clip: Mock;
  closePath: Mock;
  clearRect: Mock;
  setLineDash: Mock;
  getImageData: Mock;
  putImageData: Mock;
  drawImage: Mock;
  strokeStyle: string;
  fillStyle: string;
  lineWidth: number;
  globalAlpha: number;
  font: string;
  imageSmoothingQuality: ImageSmoothingQuality;
  imageSmoothingEnabled: boolean;
  canvas: { width: number; height: number };
}

export function createMockContext(): MockCanvasContext {
  return {
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    quadraticCurveTo: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 } as TextMetrics)),
    save: vi.fn(),
    restore: vi.fn(),
    clip: vi.fn(),
    closePath: vi.fn(),
    clearRect: vi.fn(),
    setLineDash: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })),
    putImageData: vi.fn(),
    drawImage: vi.fn(),
    strokeStyle: '#000000',
    fillStyle: '#ffffff',
    lineWidth: 1,
    globalAlpha: 1,
    font: '16px Arial',
    imageSmoothingQuality: 'high',
    imageSmoothingEnabled: true,
    canvas: { width: 800, height: 600 },
  };
}

export interface MockAnnotationTool {
  ctx: MockCanvasContext;
  getRelativeCoords: Mock;
  addShape: Mock;
  replaceShape: Mock;
  shapes: IShape[];
  globalShapes: IShape[];
  canvasWidth: number;
  canvasHeight: number;
  canvas: { style: { cursor: string }; parentElement: HTMLElement | null };
  videoElement: HTMLVideoElement | null;
  referenceVideoElement: HTMLVideoElement | null;
  videoFrameBuffer: {
    getFrame: Mock;
    getAudioFingerprint: Mock;
    frameNumberFromTime: Mock;
  } | null;
  referenceVideoFrameBuffer: {
    getFrame: Mock;
    getAudioFingerprint: Mock;
    frameNumberFromTime: Mock;
    getFrameNumberBySignature: Mock;
  } | null;
  undoStack: IShape[][];
  redrawFullCanvas: Mock;
  clearCanvas: Mock;
  addVideoOverlay: Mock;
  drawShapesOverlay: Mock;
  addFrameSquareOverlay: Mock;
  addGlobalShape: Mock;
  serialize: Mock;
  deserialize: Mock;
  pluginForTool: Mock;
  overlayOpacity: number;
  pixelRatio: number;
  isMobile: boolean;
  currentTool: string | null;
  timeStack: Map<number, IShape[]>;
  activeTimeFrame: number;
  totalFrames: number;
  playbackFrame: number;
  colorPicker: { value: string };
  strokeSizePicker: { value: string };
  setCanvasSettings: Mock;
}

export function createMockAnnotationTool(ctx: MockCanvasContext): MockAnnotationTool {
  return {
    ctx,
    getRelativeCoords: vi.fn((event: { clientX: number; clientY: number }) => ({
      x: event.clientX,
      y: event.clientY,
    })),
    addShape: vi.fn(),
    replaceShape: vi.fn(),
    shapes: [],
    globalShapes: [],
    canvasWidth: 800,
    canvasHeight: 600,
    canvas: { style: { cursor: 'default' }, parentElement: null },
    videoElement: null,
    referenceVideoElement: null,
    videoFrameBuffer: null,
    referenceVideoFrameBuffer: null,
    undoStack: [],
    redrawFullCanvas: vi.fn(),
    clearCanvas: vi.fn(),
    addVideoOverlay: vi.fn(),
    drawShapesOverlay: vi.fn(),
    addFrameSquareOverlay: vi.fn(),
    addGlobalShape: vi.fn(),
    serialize: vi.fn((shapes: IShape[]) => shapes),
    deserialize: vi.fn((shapes: IShape[]) => shapes),
    pluginForTool: vi.fn(() => ({
      isPointerAtShape: vi.fn(() => false),
      move: vi.fn((shape: IShape) => shape),
      draw: vi.fn(),
      save: vi.fn(),
    })),
    overlayOpacity: 1,
    pixelRatio: 1,
    isMobile: false,
    currentTool: null,
    timeStack: new Map(),
    activeTimeFrame: 1,
    totalFrames: 100,
    playbackFrame: 1,
    colorPicker: { value: '' },
    strokeSizePicker: { value: '' },
    setCanvasSettings: vi.fn(),
  };
}

export function createMockPointerEvent(x: number, y: number): PointerEvent {
  return { clientX: x, clientY: y } as PointerEvent;
}

// Helper to cast mock annotation tool to AnnotationTool for plugin constructors
export function asAnnotationTool(mock: MockAnnotationTool): AnnotationTool {
  return mock as unknown as AnnotationTool;
}
