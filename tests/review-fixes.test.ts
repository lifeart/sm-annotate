import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MoveToolPlugin } from '../src/plugins/move';
import { RectangleToolPlugin, type IRectangle } from '../src/plugins/rectangle';
import { CircleToolPlugin, type ICircle } from '../src/plugins/circle';
import { CompareToolPlugin } from '../src/plugins/compare';
import { Point, douglasPeucker } from '../src/plugins/utils/douglas-peucker';
import { isEditableTarget } from '../src/events/utils';
import type { IShape } from '../src/plugins';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  type MockAnnotationTool,
} from './helpers/mock-context';

// Wire the mock tool to real plugins so serialize/deserialize/move behave like core.
function withRealPlugins(tool: MockAnnotationTool) {
  const at = asAnnotationTool(tool);
  const plugins: Record<string, any> = {
    rectangle: new RectangleToolPlugin(at),
    circle: new CircleToolPlugin(at),
  };
  tool.pluginForTool = vi.fn((type: string) => plugins[type]);
  tool.serialize = vi.fn((shapes: IShape[]) =>
    shapes.map((s) => plugins[s.type].normalize(s, tool.canvasWidth, tool.canvasHeight))
  );
  tool.deserialize = vi.fn((shapes: IShape[]) =>
    shapes.map((s) => plugins[s.type].normalize(s, 1 / tool.canvasWidth, 1 / tool.canvasHeight))
  );
  tool.replaceShape = vi.fn((shape: IShape, index: number) => {
    tool.undoStack.push([...tool.shapes]);
    tool.shapes[index] = tool.serialize([shape])[0];
  });
}

const rect = (): IRectangle => ({
  type: 'rectangle',
  x: 0.25,
  y: 0.25,
  width: 0.25,
  height: 0.25,
  strokeStyle: '#000',
  fillStyle: '#fff',
  lineWidth: 2,
});

describe('move tool regressions', () => {
  let tool: MockAnnotationTool;
  let plugin: MoveToolPlugin;

  beforeEach(() => {
    tool = createMockAnnotationTool(createMockContext());
    withRealPlugins(tool);
    plugin = new MoveToolPlugin(asAnnotationTool(tool));
  });

  it('Ctrl+D duplicates a shape at the offset position, normalized once', () => {
    tool.shapes = [rect()];
    plugin.selectedShapeIndex = 0;
    plugin.onActivate();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true }));
    plugin.onDeactivate();

    const dup = tool.shapes[1] as IRectangle;
    expect(dup.x).toBeCloseTo(0.25 + 20 / 800);
    expect(dup.y).toBeCloseTo(0.25 + 20 / 600);
    expect(dup.width).toBeCloseTo(0.25);
  });

  it('undo after rotation restores the previous rotation', () => {
    tool.shapes = [rect()];
    plugin.selectedShapeIndex = 0;
    // emulate a rotation drag start + in-place edit, as onPointerDown/Move do
    (plugin as any).pushUndoSnapshot();
    tool.shapes[0].rotation = Math.PI / 2;

    const snapshot = tool.undoStack.pop()!;
    expect(snapshot[0].rotation).toBeUndefined();
  });

  it('undo after opacity change restores previous opacity', () => {
    tool.shapes = [{ ...rect(), opacity: 1 }];
    plugin.selectedShapeIndex = 0;
    plugin.setSelectedShapeOpacity(0.3);
    expect(tool.shapes[0].opacity).toBe(0.3);
    expect(tool.undoStack[0][0].opacity).toBe(1);
  });

  it('clicking a shape without dragging does not let an empty-area drag move it', () => {
    tool.shapes = [rect()];
    // click on the rectangle's top edge (200, 150) and release without moving
    plugin.onPointerDown(createMockPointerEvent(250, 150));
    plugin.onPointerUp(createMockPointerEvent(250, 150));
    // now drag on empty canvas
    plugin.onPointerDown(createMockPointerEvent(700, 550));
    plugin.onPointerMove(createMockPointerEvent(750, 580));
    plugin.onPointerUp(createMockPointerEvent(750, 580));

    expect((tool.shapes[0] as IRectangle).x).toBe(0.25);
    expect(plugin.selectedShapeIndex).toBe(-1);
  });

  it('dragging a shape moves its custom rotation center with it', () => {
    tool.shapes = [{ ...rect(), rotationCenterX: 0.5, rotationCenterY: 0.5 }];
    // grab the top edge
    plugin.onPointerDown(createMockPointerEvent(250, 150));
    expect(plugin.selectedShapeIndex).toBe(0);
    plugin.onPointerMove(createMockPointerEvent(330, 150));
    plugin.onPointerUp(createMockPointerEvent(330, 150));

    const moved = tool.shapes[0] as IRectangle;
    expect(moved.x).toBeCloseTo(0.25 + 80 / 800);
    expect(moved.rotationCenterX).toBeCloseTo(0.5 + 80 / 800);
    expect(moved.rotationCenterY).toBeCloseTo(0.5);
  });

  it('dragging the east handle of a circle grows it from the west edge', () => {
    const circle: ICircle = {
      type: 'circle', x: 0.5, y: 0.5, radius: 0.1,
      strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1,
    };
    tool.shapes = [circle];
    plugin.selectedShapeIndex = 0;
    const bounds = plugin.getShapeBounds(circle)!;
    (plugin as any).resizeOriginalShape = { ...circle };
    (plugin as any).resizeShape(tool.shapes[0], 'e', 40, 0, bounds, false);

    const c = tool.shapes[0] as ICircle;
    // west edge stays put at 400 - 80 = 320px, radius grows by 20px
    expect(c.radius * 800).toBeCloseTo(100);
    expect(c.x * 800 - c.radius * 800).toBeCloseTo(320);
  });

  it('ignores Backspace typed into a text input', () => {
    tool.shapes = [rect()];
    plugin.selectedShapeIndex = 0;
    plugin.onActivate();
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    plugin.onDeactivate();
    input.remove();
    expect(tool.shapes.length).toBe(1);
  });
});

describe('douglasPeucker', () => {
  it('keeps closed strokes whose first and last points coincide', () => {
    const pts = [
      new Point(0, 0), new Point(10, 0), new Point(10, 10), new Point(0, 10), new Point(0, 0),
    ];
    expect(douglasPeucker(pts, 1).length).toBeGreaterThan(2);
  });
});

describe('isEditableTarget', () => {
  it('detects text-entry elements only', () => {
    const text = document.createElement('input');
    const range = document.createElement('input');
    range.type = 'range';
    expect(isEditableTarget(text)).toBe(true);
    expect(isEditableTarget(range)).toBe(false);
    expect(isEditableTarget(document.createElement('textarea'))).toBe(true);
    expect(isEditableTarget(document.createElement('canvas'))).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});

describe('compare tool', () => {
  it('looks up main and reference frames with their own frame rates', () => {
    const tool = createMockAnnotationTool(createMockContext());
    const plugin = new CompareToolPlugin(asAnnotationTool(tool));
    const video1 = document.createElement('video');
    const video2 = document.createElement('video');
    Object.defineProperty(video1, 'currentTime', { value: 1 });
    tool.videoElement = video1;
    tool.referenceVideoElement = video2;
    const mainGetFrame = vi.fn(() => null);
    const refGetFrame = vi.fn(() => null);
    tool.videoFrameBuffer = { frameNumberFromTime: (t: number) => Math.round(t * 24), getFrame: mainGetFrame, getAudioFingerprint: vi.fn() };
    tool.referenceVideoFrameBuffer = { frameNumberFromTime: (t: number) => Math.round(t * 30), getFrame: refGetFrame, getFrameNumberBySignature: vi.fn() };

    plugin.drawShape({ type: 'compare', x: 400, disabled: false, strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1 });

    expect(mainGetFrame).toHaveBeenCalledWith(24);
    expect(refGetFrame).toHaveBeenCalledWith(30);
  });
});
