// Setup canvas mock for jsdom
import { vi } from 'vitest';

// Mock canvas context
const createMockContext = () => ({
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter',
  globalAlpha: 1,
  globalCompositeOperation: 'source-over',
  imageSmoothingEnabled: true,
  imageSmoothingQuality: 'low',
  filter: 'none',
  font: '10px sans-serif',
  textAlign: 'start',
  textBaseline: 'alphabetic',
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  createPattern: vi.fn(),
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  ellipse: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  clip: vi.fn(),
  isPointInPath: vi.fn(),
  isPointInStroke: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  drawImage: vi.fn(),
  createImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
  })),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 1,
    height: 1,
  })),
  putImageData: vi.fn(),
  setLineDash: vi.fn(),
  getLineDash: vi.fn(() => []),
  canvas: null as HTMLCanvasElement | null,
});

// Store contexts per canvas to maintain state
const canvasContexts = new WeakMap<HTMLCanvasElement, ReturnType<typeof createMockContext>>();

// Mock getContext on HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === '2d') {
    let ctx = canvasContexts.get(this);
    if (!ctx) {
      ctx = createMockContext();
      ctx.canvas = this;
      canvasContexts.set(this, ctx);
    }
    return ctx as unknown as CanvasRenderingContext2D;
  }
  return null;
} as typeof HTMLCanvasElement.prototype.getContext;

// Mock toDataURL
HTMLCanvasElement.prototype.toDataURL = function() {
  return 'data:image/png;base64,';
};

// Mock toBlob
HTMLCanvasElement.prototype.toBlob = function(callback: BlobCallback) {
  setTimeout(() => callback(new Blob([''], { type: 'image/png' })), 0);
};

// Mock requestAnimationFrame if not available
if (typeof requestAnimationFrame === 'undefined') {
  (global as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(() => callback(Date.now()), 16);
  };
}

if (typeof cancelAnimationFrame === 'undefined') {
  (global as any).cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
  };
}
