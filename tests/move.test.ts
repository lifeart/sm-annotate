import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MoveToolPlugin } from '../src/plugins/move';
import { createMockContext, createMockAnnotationTool, createMockPointerEvent, asAnnotationTool, type MockAnnotationTool, type MockCanvasContext } from './helpers/mock-context';
import type { IRectangle } from '../src/plugins/rectangle';
import type { ICircle } from '../src/plugins/circle';
import type { ILine } from '../src/plugins/line';
import type { IArrow } from '../src/plugins/arrow';
import type { ICurve } from '../src/plugins/curve';
import type { IText } from '../src/plugins/text';
import type { IImage } from '../src/plugins/image';
import type { ISelection } from '../src/plugins/selection';
import type { IShape } from '../src/plugins';

describe('MoveToolPlugin', () => {
  let plugin: MoveToolPlugin;
  let mockCtx: MockCanvasContext;
  let mockAnnotationTool: MockAnnotationTool;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockAnnotationTool = createMockAnnotationTool(mockCtx);
    plugin = new MoveToolPlugin(asAnnotationTool(mockAnnotationTool));
  });

  describe('normalize', () => {
    it('should return shape unchanged', () => {
      const shape = {
        type: 'move' as const,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const normalized = plugin.normalize(shape);

      expect(normalized).toEqual(shape);
    });
  });

  describe('move', () => {
    it('should return shape unchanged', () => {
      const shape = {
        type: 'move' as const,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape);

      expect(moved).toEqual(shape);
    });
  });

  describe('onActivate', () => {
    it('should add keydown listener', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      plugin.onActivate();

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });
  });

  describe('onDeactivate', () => {
    it('should remove keydown listener and reset selection', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      plugin.onActivate();
      plugin.selectedShapeIndex = 5;

      plugin.onDeactivate();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(plugin.selectedShapeIndex).toBe(-1);

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('getSelectedShape', () => {
    it('should return null when no shape selected', () => {
      plugin.selectedShapeIndex = -1;

      expect(plugin.getSelectedShape()).toBeNull();
    });

    it('should return null when index is out of bounds', () => {
      plugin.selectedShapeIndex = 10;
      mockAnnotationTool.shapes = [];

      expect(plugin.getSelectedShape()).toBeNull();
    });

    it('should return the selected shape', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.2,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      expect(plugin.getSelectedShape()).toBe(shape);
    });
  });

  describe('setSelectedShapeOpacity', () => {
    it('should return false when no shape selected', () => {
      plugin.selectedShapeIndex = -1;

      expect(plugin.setSelectedShapeOpacity(0.5)).toBe(false);
    });

    it('should update opacity and redraw', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.2,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
        opacity: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      const result = plugin.setSelectedShapeOpacity(0.5);

      expect(result).toBe(true);
      expect(shape.opacity).toBe(0.5);
      expect(mockAnnotationTool.undoStack.length).toBe(1);
      expect(mockAnnotationTool.redrawFullCanvas).toHaveBeenCalled();
    });
  });

  describe('getShapeBounds', () => {
    it('should return bounds for rectangle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 100, y: 50, width: 200, height: 100 });
    });

    it('should handle negative rectangle dimensions', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 300,
        y: 150,
        width: -200,
        height: -100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 100, y: 50, width: 200, height: 100 });
    });

    it('should return bounds for circle', () => {
      const shape: ICircle = {
        type: 'circle',
        x: 150,
        y: 100,
        radius: 50,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 100, y: 50, width: 100, height: 100 });
    });

    it('should return bounds for line', () => {
      const shape: ILine = {
        type: 'line',
        x1: 50,
        y1: 50,
        x2: 150,
        y2: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 50, y: 50, width: 100, height: 50 });
    });

    it('should return bounds for arrow', () => {
      const shape: IArrow = {
        type: 'arrow',
        x1: 50,
        y1: 50,
        x2: 150,
        y2: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 50, y: 50, width: 100, height: 50 });
    });

    it('should return bounds for curve', () => {
      const shape: ICurve = {
        type: 'curve',
        points: [
          { x: 50, y: 50 },
          { x: 100, y: 100 },
          { x: 150, y: 50 },
        ],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 50, y: 50, width: 100, height: 50 });
    });

    it('should return null for curve with no points', () => {
      const shape: ICurve = {
        type: 'curve',
        points: [],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toBeNull();
    });

    it('should return bounds for text', () => {
      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Hello',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBe(100);
    });

    it('should return null for text with empty text', () => {
      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: '',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toBeNull();
    });

    it('should return null for text with undefined text', () => {
      const shape = {
        type: 'text',
        x: 100,
        y: 100,
        text: undefined,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      } as unknown as IText;

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toBeNull();
    });

    it('should return null for curve with undefined points', () => {
      const shape = {
        type: 'curve',
        points: undefined,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      } as unknown as ICurve;

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toBeNull();
    });

    it('should return bounds for image', () => {
      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 100, y: 50, width: 200, height: 150 });
    });

    it('should return bounds for selection', () => {
      const shape: ISelection = {
        type: 'selection',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toEqual({ x: 100, y: 50, width: 200, height: 150 });
    });

    it('should return null for unknown shape type', () => {
      const shape = { type: 'unknown' } as unknown as IShape;

      const bounds = plugin.getShapeBounds(shape);

      expect(bounds).toBeNull();
    });
  });

  describe('getHandleAtPosition', () => {
    it('should return null when no shape selected', () => {
      plugin.selectedShapeIndex = -1;

      expect(plugin.getHandleAtPosition(100, 100)).toBeNull();
    });

    it('should return handle position when clicking on nw handle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      expect(plugin.getHandleAtPosition(100, 50)).toBe('nw');
    });

    it('should return handle position when clicking on se handle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      expect(plugin.getHandleAtPosition(300, 150)).toBe('se');
    });

    it('should return null when not on any handle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      expect(plugin.getHandleAtPosition(200, 100)).toBeNull();
    });
  });

  describe('drawResizeHandles', () => {
    it('should return early when no shape selected', () => {
      plugin.selectedShapeIndex = -1;

      plugin.drawResizeHandles();

      expect(mockCtx.save).not.toHaveBeenCalled();
    });

    it('should draw handles for selected shape', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      plugin.drawResizeHandles();

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.setLineDash).toHaveBeenCalledWith([4, 4]);
      expect(mockCtx.strokeRect).toHaveBeenCalled();
      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });
  });

  describe('onPointerDown', () => {
    it('should start resize when clicking on handle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      const event = createMockPointerEvent(100, 50);
      plugin.onPointerDown(event);

      expect(plugin.isDrawing).toBe(true);
      expect(mockAnnotationTool.canvas.style.cursor).toBe('nw-resize');
    });

    it('should select shape when clicking on it', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.pluginForTool = vi.fn(() => ({
        isPointerAtShape: vi.fn(() => true),
        move: vi.fn((s: IShape) => s),
        draw: vi.fn(),
      }));

      const event = createMockPointerEvent(200, 100);
      plugin.onPointerDown(event);

      expect(plugin.selectedShapeIndex).toBe(0);
      expect(plugin.isDrawing).toBe(true);
    });

    it('should deselect when clicking empty area', () => {
      mockAnnotationTool.shapes = [];
      plugin.selectedShapeIndex = 0;

      const event = createMockPointerEvent(500, 500);
      plugin.onPointerDown(event);

      expect(plugin.selectedShapeIndex).toBe(-1);
      expect(mockAnnotationTool.redrawFullCanvas).toHaveBeenCalled();
    });

    it('should set scale mode when clicking image corner', () => {
      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.pluginForTool = vi.fn(() => ({
        isPointerAtShape: vi.fn(() => true),
        move: vi.fn((s: IShape) => s),
        draw: vi.fn(),
      }));

      const event = createMockPointerEvent(100, 50);
      plugin.onPointerDown(event);

      expect(plugin.isScale).toBe(true);
      expect(mockAnnotationTool.canvas.style.cursor).toBe('nw-resize');
    });
  });

  describe('onPointerMove', () => {
    it('should resize shape when dragging handle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return {
              ...rect,
              x: rect.x * 800,
              y: rect.y * 600,
              width: rect.width * 800,
              height: rect.height * 600,
            };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin.isDrawing = true;
      plugin['activeHandle'] = 'se';
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin.startX = 300;
      plugin.startY = 150;

      const event = { ...createMockPointerEvent(320, 170), shiftKey: false } as PointerEvent;
      plugin.onPointerMove(event);

      expect(mockAnnotationTool.redrawFullCanvas).toHaveBeenCalled();
    });

    it('should update cursor when hovering over handle', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;
      plugin.isDrawing = false;

      const event = createMockPointerEvent(100, 50);
      plugin.onPointerMove(event);

      expect(mockAnnotationTool.canvas.style.cursor).toBe('nw-resize');
    });

    it('should reset cursor when not on handle and not drawing', () => {
      plugin.isDrawing = false;
      plugin.selectedShapeIndex = -1;

      const event = createMockPointerEvent(400, 300);
      plugin.onPointerMove(event);

      expect(mockAnnotationTool.canvas.style.cursor).toBe('default');
    });

    it('should move shape when dragging', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      plugin.shape = shape;
      plugin.isDrawing = true;
      plugin.startX = 150;
      plugin.startY = 80;
      mockAnnotationTool.pluginForTool = vi.fn(() => ({
        isPointerAtShape: vi.fn(() => true),
        move: vi.fn((s: IShape) => ({ ...s, x: (s as IRectangle).x + 10 })),
        draw: vi.fn(),
      }));

      const event = createMockPointerEvent(160, 90);
      plugin.onPointerMove(event);

      expect(plugin.lastDrawnShape).not.toBeNull();
    });

    it('should skip audio-peaks shapes', () => {
      const shape = {
        type: 'audio-peaks' as const,
        x: 0.125,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      plugin.shape = shape as IShape;
      plugin.isDrawing = true;
      plugin.startX = 150;
      plugin.startY = 80;

      const event = createMockPointerEvent(160, 90);
      plugin.onPointerMove(event);

      expect(plugin.lastDrawnShape).toBeNull();
    });

    it('should scale image when in scale mode', () => {
      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      plugin.shape = shape;
      plugin.isDrawing = true;
      plugin.isScale = true;
      plugin.startX = 100;
      plugin.startY = 50;
      mockAnnotationTool.pluginForTool = vi.fn(() => ({
        isPointerAtShape: vi.fn(() => true),
        move: vi.fn((s: IShape) => s),
        draw: vi.fn(),
      }));

      const event = createMockPointerEvent(120, 70);
      plugin.onPointerMove(event);

      expect(plugin.lastDrawnShape).not.toBeNull();
      expect((plugin.lastDrawnShape as IImage).width).not.toBe(200);
    });
  });

  describe('onPointerUp', () => {
    it('should complete resize when releasing handle', () => {
      plugin['activeHandle'] = 'se';
      plugin.isDrawing = true;

      const event = createMockPointerEvent(350, 200);
      plugin.onPointerUp(event);

      expect(plugin['activeHandle']).toBeNull();
      expect(plugin.isDrawing).toBe(false);
      expect(mockAnnotationTool.redrawFullCanvas).toHaveBeenCalled();
    });

    it('should save moved shape on release', () => {
      const originalShape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        fillStyle: '#fff',
        strokeStyle: '#000',
        lineWidth: 2,
      };
      const movedShape: IRectangle = {
        type: 'rectangle',
        x: 0.15,
        y: 0.1,
        width: 0.25,
        height: 0.167,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
      };
      plugin.shape = originalShape;
      plugin.lastDrawnShape = movedShape;
      plugin.isDrawing = true;
      plugin.shapeIndex = 0;

      const event = createMockPointerEvent(200, 120);
      plugin.onPointerUp(event);

      expect(mockAnnotationTool.replaceShape).toHaveBeenCalled();
      expect(movedShape.fillStyle).toBe('#fff');
      expect(movedShape.strokeStyle).toBe('#000');
      expect(movedShape.lineWidth).toBe(2);
    });

    it('should handle no lastDrawnShape', () => {
      plugin.isDrawing = true;
      plugin.lastDrawnShape = null;

      const event = createMockPointerEvent(200, 120);
      plugin.onPointerUp(event);

      expect(plugin.isDrawing).toBe(false);
      expect(mockAnnotationTool.redrawFullCanvas).toHaveBeenCalled();
    });

    it('should preserve opacity on save', () => {
      const originalShape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        opacity: 0.5,
        fillStyle: '#fff',
        strokeStyle: '#000',
        lineWidth: 2,
      };
      const movedShape: IRectangle = {
        type: 'rectangle',
        x: 0.15,
        y: 0.1,
        width: 0.25,
        height: 0.167,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
      };
      plugin.shape = originalShape;
      plugin.lastDrawnShape = movedShape;
      plugin.isDrawing = true;
      plugin.shapeIndex = 0;

      const event = createMockPointerEvent(200, 120);
      plugin.onPointerUp(event);

      expect(movedShape.opacity).toBe(0.5);
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      plugin.isDrawing = true;
      plugin.shape = { type: 'rectangle' } as IRectangle;
      plugin.isScale = true;
      plugin.lastDrawnShape = { type: 'rectangle' } as IRectangle;
      plugin.shapeIndex = 5;
      plugin.selectedShapeIndex = 3;
      plugin['activeHandle'] = 'se';

      plugin.reset();

      expect(plugin.isDrawing).toBe(false);
      expect(plugin.shape).toBeNull();
      expect(plugin.isScale).toBe(false);
      expect(plugin.lastDrawnShape).toBeNull();
      expect(plugin.shapeIndex).toBe(-1);
      expect(plugin.selectedShapeIndex).toBe(-1);
      expect(plugin['activeHandle']).toBeNull();
    });
  });

  describe('draw', () => {
    it('should throw error (not implemented)', () => {
      expect(() => plugin.draw()).toThrow('Method not implemented.');
    });
  });

  describe('isPointerAtShape', () => {
    it('should delegate to plugin', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      const mockPlugin = {
        isPointerAtShape: vi.fn(() => true),
      };
      mockAnnotationTool.pluginForTool = vi.fn(() => mockPlugin);

      const result = plugin.isPointerAtShape(shape, 100, 50);

      expect(result).toBe(true);
      expect(mockPlugin.isPointerAtShape).toHaveBeenCalled();
    });
  });

  describe('isPointerAtCorner', () => {
    it('should return false when shape has no type', () => {
      const shape = { x: 100, y: 50, width: 200, height: 150 };

      const result = plugin.isPointerAtCorner(shape as IImage, 100, 50);

      expect(result).toBe(false);
    });

    it('should return true when near top-left corner', () => {
      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const result = plugin.isPointerAtCorner(shape, 105, 55);

      expect(result).toBe(true);
    });

    it('should return true when near bottom-right corner', () => {
      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const result = plugin.isPointerAtCorner(shape, 295, 195);

      expect(result).toBe(true);
    });

    it('should return false when not near any corner', () => {
      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 150,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const result = plugin.isPointerAtCorner(shape, 200, 125);

      expect(result).toBe(false);
    });
  });

  describe('resizeShape integration', () => {
    it('should resize rectangle shape', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'se', 20, 30, plugin['resizeStartBounds']!);

      expect(shape.width).not.toBe(0.25);
    });

    it('should resize circle shape', () => {
      const shape: ICircle = {
        type: 'circle',
        x: 0.25,
        y: 0.167,
        radius: 0.0625,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'circle') {
            const circle = s as ICircle;
            return { ...circle, x: circle.x * 800, y: circle.y * 600, radius: circle.radius * 800 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 150, y: 50, width: 100, height: 100 };

      plugin['resizeShape'](shape, 'se', 20, 20, plugin['resizeStartBounds']!);

      expect(shape.radius).not.toBe(0.0625);
    });

    it('should resize line shape', () => {
      const shape: ILine = {
        type: 'line',
        x1: 0.0625,
        y1: 0.083,
        x2: 0.1875,
        y2: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'line') {
            const line = s as ILine;
            return { ...line, x1: line.x1 * 800, y1: line.y1 * 600, x2: line.x2 * 800, y2: line.y2 * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 50, y: 50, width: 100, height: 50 };

      plugin['resizeShape'](shape, 'se', 20, 10, plugin['resizeStartBounds']!);

      expect(shape.x2).not.toBe(0.1875);
    });

    it('should resize arrow shape', () => {
      const shape: IArrow = {
        type: 'arrow',
        x1: 0.0625,
        y1: 0.083,
        x2: 0.1875,
        y2: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'arrow') {
            const arrow = s as IArrow;
            return { ...arrow, x1: arrow.x1 * 800, y1: arrow.y1 * 600, x2: arrow.x2 * 800, y2: arrow.y2 * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 50, y: 50, width: 100, height: 50 };

      plugin['resizeShape'](shape, 'se', 20, 10, plugin['resizeStartBounds']!);

      expect(shape.x2).not.toBe(0.1875);
    });

    it('should resize curve shape', () => {
      const shape: ICurve = {
        type: 'curve',
        points: [
          { x: 0.0625, y: 0.083 },
          { x: 0.125, y: 0.125 },
          { x: 0.1875, y: 0.083 },
        ],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'curve') {
            const curve = s as ICurve;
            return { ...curve, points: curve.points.map((p) => ({ x: p.x * 800, y: p.y * 600 })) };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 50, y: 50, width: 100, height: 50 };

      plugin['resizeShape'](shape, 'se', 20, 10, plugin['resizeStartBounds']!);

      expect(shape.points[2].x).not.toBe(0.1875);
    });

    it('should resize text shape', () => {
      const shape: IText = {
        type: 'text',
        x: 0.125,
        y: 0.167,
        text: 'Hello',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'text') {
            const text = s as IText;
            return { ...text, x: text.x * 800, y: text.y * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 83, width: 50, height: 17 };

      const originalLineWidth = shape.lineWidth;
      plugin['resizeShape'](shape, 'se', 50, 30, plugin['resizeStartBounds']!);

      expect(shape.lineWidth).not.toBe(originalLineWidth);
    });

    it('should resize image shape', () => {
      const shape: IImage = {
        type: 'image',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        image: new Image(),
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'image') {
            const img = s as IImage;
            return { ...img, x: img.x * 800, y: img.y * 600, width: img.width * 800, height: img.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'se', 20, 30, plugin['resizeStartBounds']!);

      expect(shape.width).not.toBe(0.25);
    });

    it('should resize selection shape', () => {
      const shape: ISelection = {
        type: 'selection',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'selection') {
            const sel = s as ISelection;
            return { ...sel, x: sel.x * 800, y: sel.y * 600, width: sel.width * 800, height: sel.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'se', 20, 30, plugin['resizeStartBounds']!);

      expect(shape.width).not.toBe(0.25);
    });

    it('should handle curve with empty points array during resize', () => {
      const shape: ICurve = {
        type: 'curve',
        points: [],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'curve') {
            const curve = s as ICurve;
            return { ...curve, points: curve.points?.map((p) => ({ x: p.x * 800, y: p.y * 600 })) || [] };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 50, y: 50, width: 100, height: 50 };

      // Should not throw
      expect(() => plugin['resizeShape'](shape, 'se', 20, 10, plugin['resizeStartBounds']!)).not.toThrow();
    });

    it('should handle curve with undefined points during resize', () => {
      const shape = {
        type: 'curve',
        points: undefined,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      } as unknown as ICurve;
      mockAnnotationTool.shapes = [shape as IShape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'curve') {
            const curve = s as ICurve;
            return { ...curve };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 50, y: 50, width: 100, height: 50 };

      // Should not throw
      expect(() => plugin['resizeShape'](shape, 'se', 20, 10, plugin['resizeStartBounds']!)).not.toThrow();
    });

    it('should keep aspect ratio when shift is pressed', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'se', 40, 10, plugin['resizeStartBounds']!, true);

      expect(shape.width).toBeDefined();
    });

    it('should handle vertical handles with aspect ratio', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 's', 0, 50, plugin['resizeStartBounds']!, true);

      expect(shape.width).toBeDefined();
    });

    it('should handle horizontal handles with aspect ratio', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'e', 50, 0, plugin['resizeStartBounds']!, true);

      expect(shape.height).toBeDefined();
    });

    it('should handle nw corner with aspect ratio', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'nw', -20, -10, plugin['resizeStartBounds']!, true);

      expect(shape.x).toBeDefined();
    });

    it('should enforce minimum size', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = JSON.parse(JSON.stringify(shape));
      plugin['resizeStartBounds'] = { x: 100, y: 50, width: 200, height: 100 };

      plugin['resizeShape'](shape, 'se', -195, -95, plugin['resizeStartBounds']!);

      expect(shape.width).toBeGreaterThan(0);
    });

    it('should return early if resizeOriginalShape is null', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;
      plugin['resizeOriginalShape'] = null;

      plugin['resizeShape'](shape, 'se', 20, 30, { x: 100, y: 50, width: 200, height: 100 });

      expect(shape.width).toBe(0.25);
    });
  });

  describe('handleKeyDown', () => {
    beforeEach(() => {
      plugin.onActivate();
    });

    afterEach(() => {
      plugin.onDeactivate();
    });

    it('should delete shape on Backspace', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      const event = new KeyboardEvent('keydown', { key: 'Backspace' });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.shapes.length).toBe(0);
      expect(plugin.selectedShapeIndex).toBe(-1);
    });

    it('should delete shape on Delete', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      plugin.selectedShapeIndex = 0;

      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.shapes.length).toBe(0);
    });

    it('should duplicate shape on Ctrl+D', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.1,
        width: 0.2,
        height: 0.15,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.deserialize = vi.fn((shapes: IShape[]) =>
        shapes.map((s) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x * 800, y: rect.y * 600, width: rect.width * 800, height: rect.height * 600 };
          }
          return s;
        })
      );
      mockAnnotationTool.pluginForTool = vi.fn(() => ({
        move: vi.fn((s: IShape, dx: number, dy: number) => {
          if (s.type === 'rectangle') {
            const rect = s as IRectangle;
            return { ...rect, x: rect.x + dx, y: rect.y + dy };
          }
          return s;
        }),
      }));
      plugin.selectedShapeIndex = 0;

      const event = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.shapes.length).toBe(2);
      expect(plugin.selectedShapeIndex).toBe(1);
    });

    it('should copy annotations to next frame on Ctrl+Shift+Right', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.activeTimeFrame = 5;
      mockAnnotationTool.totalFrames = 100;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true, shiftKey: true });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.timeStack.get(6)).toBeDefined();
      expect(mockAnnotationTool.playbackFrame).toBe(6);
    });

    it('should copy annotations to previous frame on Ctrl+Shift+Left', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.activeTimeFrame = 5;

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, shiftKey: true });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.timeStack.get(4)).toBeDefined();
      expect(mockAnnotationTool.playbackFrame).toBe(4);
    });

    it('should not copy to next frame if at last frame', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.activeTimeFrame = 100;
      mockAnnotationTool.totalFrames = 100;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', ctrlKey: true, shiftKey: true });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.timeStack.get(101)).toBeUndefined();
    });

    it('should not copy to previous frame if at first frame', () => {
      const shape: IRectangle = {
        type: 'rectangle',
        x: 0.125,
        y: 0.083,
        width: 0.25,
        height: 0.167,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };
      mockAnnotationTool.shapes = [shape];
      mockAnnotationTool.activeTimeFrame = 1;

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true, shiftKey: true });
      document.dispatchEvent(event);

      expect(mockAnnotationTool.timeStack.get(0)).toBeUndefined();
    });
  });
});
