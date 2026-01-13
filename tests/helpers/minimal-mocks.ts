import { vi } from 'vitest';
import type { AnnotationTool } from '../../src/core';

/**
 * Creates a minimal canvas context spy that records method calls.
 * Only includes methods that are actually used for drawing.
 */
export function createDrawingContext() {
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
    closePath: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    clearRect: vi.fn(),
    setLineDash: vi.fn(),
    clip: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 })),
    putImageData: vi.fn(),
    drawImage: vi.fn(),
    // Style properties
    strokeStyle: '#000000',
    fillStyle: '#ffffff',
    lineWidth: 1,
    globalAlpha: 1,
    font: '16px Arial',
    canvas: { width: 800, height: 600 },
  };
}

export type DrawingContext = ReturnType<typeof createDrawingContext>;

/**
 * Creates a minimal annotation tool for testing plugins.
 * Only includes properties that plugins actually use.
 */
export function createMinimalAnnotationTool(ctx: DrawingContext) {
  return {
    ctx,
    getRelativeCoords: vi.fn((e: { clientX: number; clientY: number }) => ({
      x: e.clientX,
      y: e.clientY,
    })),
    addShape: vi.fn(),
    replaceShape: vi.fn(),
    shapes: [] as unknown[],
    canvasWidth: 800,
    canvasHeight: 600,
    canvas: { style: { cursor: 'default' }, parentElement: null },
    redrawFullCanvas: vi.fn(),
  } as unknown as AnnotationTool;
}

/**
 * Quick setup for plugin drawing tests.
 * Returns plugin instance with minimal mocks.
 */
export function setupPluginTest<T>(
  PluginClass: new (tool: AnnotationTool) => T
): { plugin: T; ctx: DrawingContext; tool: ReturnType<typeof createMinimalAnnotationTool> } {
  const ctx = createDrawingContext();
  const tool = createMinimalAnnotationTool(ctx);
  const plugin = new PluginClass(tool);
  return { plugin, ctx, tool: tool as ReturnType<typeof createMinimalAnnotationTool> };
}

/**
 * For testing pure methods (normalize, move, isPointerAtShape),
 * no mocks are needed - just create the plugin prototype.
 */
export function createPurePlugin<T>(PluginClass: { prototype: T }): T {
  return Object.create(PluginClass.prototype);
}

/**
 * Simple pointer event - just x,y coordinates
 */
export function pointerAt(x: number, y: number): PointerEvent {
  return { clientX: x, clientY: y } as PointerEvent;
}
