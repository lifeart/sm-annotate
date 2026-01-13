import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IEraser, EraserToolPlugin } from '../src/plugins/eraser';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('EraserToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize eraser coordinates relative to canvas size', () => {
      const plugin = Object.create(EraserToolPlugin.prototype);

      const shape: IEraser = {
        type: 'eraser',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x).toBe(0.25); // 100 / 400
      expect(normalized.y).toBe(0.25); // 50 / 200
      expect(normalized.width).toBe(0.5); // 200 / 400
      expect(normalized.height).toBe(0.5); // 100 / 200
    });
  });

  describe('move', () => {
    it('should move eraser by delta values', () => {
      const plugin = Object.create(EraserToolPlugin.prototype);

      const shape: IEraser = {
        type: 'eraser',
        x: 100,
        y: 100,
        width: 50,
        height: 30,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 30, -20);

      expect(moved.x).toBe(130);
      expect(moved.y).toBe(80);
      expect(moved.width).toBe(50); // width should remain unchanged
      expect(moved.height).toBe(30); // height should remain unchanged
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = Object.create(EraserToolPlugin.prototype);

    const shape: IEraser = {
      type: 'eraser',
      x: 100,
      y: 100,
      width: 100,
      height: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is inside eraser bounds', () => {
      expect(plugin.isPointerAtShape(shape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 200, 150)).toBe(true);
    });

    it('should return false when pointer is outside eraser bounds', () => {
      expect(plugin.isPointerAtShape(shape, 50, 125)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 250, 125)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 50)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 200)).toBe(false);
    });
  });

  describe('isPointerAtShape - negative dimensions', () => {
    const plugin = Object.create(EraserToolPlugin.prototype);

    const negativeWidthShape: IEraser = {
      type: 'eraser',
      x: 200,
      y: 100,
      width: -100,
      height: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative width correctly', () => {
      expect(plugin.isPointerAtShape(negativeWidthShape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(negativeWidthShape, 50, 125)).toBe(false);
    });

    const negativeHeightShape: IEraser = {
      type: 'eraser',
      x: 100,
      y: 150,
      width: 100,
      height: -50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative height correctly', () => {
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 175)).toBe(false);
    });
  });

  describe('drawing methods', () => {
    let plugin: EraserToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockCtx.save = vi.fn();
      mockCtx.restore = vi.fn();
      mockCtx.fillRect = vi.fn();
      mockCtx.strokeRect = vi.fn();
      mockCtx.clearRect = vi.fn();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new EraserToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('draw', () => {
      it('should call drawEraser with shape coordinates', () => {
        const shape: IEraser = {
          type: 'eraser',
          x: 100,
          y: 100,
          width: 50,
          height: 30,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.clearRect).toHaveBeenCalledWith(100, 100, 50, 30);
      });
    });

    describe('drawEraser', () => {
      it('should clear the specified rectangle', () => {
        plugin.drawEraser(10, 20, 100, 80);

        expect(mockCtx.clearRect).toHaveBeenCalledWith(10, 20, 100, 80);
      });
    });

    describe('onPointerDown', () => {
      it('should set start coordinates and isDrawing flag', () => {
        const event = createMockPointerEvent(50, 75);

        plugin.onPointerDown(event);

        expect(plugin.startX).toBe(50);
        expect(plugin.startY).toBe(75);
        expect(plugin.isDrawing).toBe(true);
      });
    });

    describe('onPointerMove', () => {
      it('should not draw when not in drawing mode', () => {
        plugin.isDrawing = false;
        const event = createMockPointerEvent(100, 100);

        plugin.onPointerMove(event);

        expect(mockCtx.save).not.toHaveBeenCalled();
      });

      it('should draw selection rectangle when in drawing mode', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        const event = createMockPointerEvent(110, 100);

        plugin.onPointerMove(event);

        expect(mockCtx.save).toHaveBeenCalled();
        expect(mockCtx.fillRect).toHaveBeenCalledWith(10, 20, 100, 80);
        expect(mockCtx.strokeRect).toHaveBeenCalledWith(10, 20, 100, 80);
        expect(mockCtx.restore).toHaveBeenCalled();
      });
    });

    describe('onPointerUp', () => {
      it('should not save when not in drawing mode', () => {
        plugin.isDrawing = false;
        const event = createMockPointerEvent(100, 100);

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.addShape).not.toHaveBeenCalled();
      });

      it('should save eraser shape and reset drawing flag', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        mockCtx.strokeStyle = '#ff0000';
        mockCtx.fillStyle = '#00ff00';
        mockCtx.lineWidth = 3;
        const event = createMockPointerEvent(110, 100);

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.addShape).toHaveBeenCalledWith({
          type: 'eraser',
          x: 10,
          y: 20,
          width: 100,
          height: 80,
          strokeStyle: '#ff0000',
          fillStyle: '#00ff00',
          lineWidth: 3,
        });
        expect(plugin.isDrawing).toBe(false);
      });
    });
  });
});
