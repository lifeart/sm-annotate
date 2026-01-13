import { describe, it, expect, beforeEach } from 'vitest';
import { IRectangle, RectangleToolPlugin } from '../src/plugins/rectangle';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('RectangleToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize rectangle coordinates relative to canvas size', () => {
      const plugin = Object.create(RectangleToolPlugin.prototype);

      const shape: IRectangle = {
        type: 'rectangle',
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

    it('should preserve non-coordinate properties', () => {
      const plugin = Object.create(RectangleToolPlugin.prototype);

      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#ff0000',
        fillStyle: '#00ff00',
        lineWidth: 5,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.type).toBe('rectangle');
      expect(normalized.strokeStyle).toBe('#ff0000');
      expect(normalized.fillStyle).toBe('#00ff00');
      expect(normalized.lineWidth).toBe(5);
    });
  });

  describe('move', () => {
    it('should move rectangle by delta values', () => {
      const plugin = Object.create(RectangleToolPlugin.prototype);

      const shape: IRectangle = {
        type: 'rectangle',
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 20, -10);

      expect(moved.x).toBe(120);
      expect(moved.y).toBe(90);
      expect(moved.width).toBe(50); // width should remain unchanged
      expect(moved.height).toBe(50); // height should remain unchanged
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = Object.create(RectangleToolPlugin.prototype);

    const shape: IRectangle = {
      type: 'rectangle',
      x: 100,
      y: 100,
      width: 100,
      height: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is near left edge', () => {
      expect(plugin.isPointerAtShape(shape, 100, 125)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 102, 125)).toBe(true);
    });

    it('should return true when pointer is near right edge', () => {
      expect(plugin.isPointerAtShape(shape, 200, 125)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 198, 125)).toBe(true);
    });

    it('should return true when pointer is near top edge', () => {
      expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 150, 102)).toBe(true);
    });

    it('should return true when pointer is near bottom edge', () => {
      expect(plugin.isPointerAtShape(shape, 150, 150)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 150, 148)).toBe(true);
    });

    it('should return false when pointer is inside rectangle but not near edge', () => {
      expect(plugin.isPointerAtShape(shape, 150, 125)).toBe(false);
    });

    it('should return false when pointer is outside rectangle', () => {
      expect(plugin.isPointerAtShape(shape, 50, 50)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 250, 125)).toBe(false);
    });
  });

  describe('isPointerAtShape - negative dimensions', () => {
    const plugin = Object.create(RectangleToolPlugin.prototype);

    const negativeWidthShape: IRectangle = {
      type: 'rectangle',
      x: 200,
      y: 100,
      width: -100, // Ends at x=100
      height: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative width correctly', () => {
      expect(plugin.isPointerAtShape(negativeWidthShape, 100, 125)).toBe(true); // left edge (x + width)
      expect(plugin.isPointerAtShape(negativeWidthShape, 200, 125)).toBe(true); // right edge (x)
      expect(plugin.isPointerAtShape(negativeWidthShape, 150, 125)).toBe(false); // inside
    });

    const negativeHeightShape: IRectangle = {
      type: 'rectangle',
      x: 100,
      y: 150,
      width: 100,
      height: -50, // Ends at y=100
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative height correctly', () => {
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 100)).toBe(true); // top edge (y + height)
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 150)).toBe(true); // bottom edge (y)
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 125)).toBe(false); // inside
    });
  });

  describe('drawing methods', () => {
    let plugin: RectangleToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new RectangleToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('draw', () => {
      it('should call drawRectangle with shape coordinates', () => {
        const shape: IRectangle = {
          type: 'rectangle',
          x: 100,
          y: 100,
          width: 50,
          height: 30,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.rect).toHaveBeenCalledWith(100, 100, 50, 30);
        expect(mockCtx.stroke).toHaveBeenCalled();
      });
    });

    describe('drawRectangle', () => {
      it('should draw rectangle with given parameters', () => {
        plugin.drawRectangle(10, 20, 100, 80);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.rect).toHaveBeenCalledWith(10, 20, 100, 80);
        expect(mockCtx.stroke).toHaveBeenCalled();
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

        expect(mockCtx.beginPath).not.toHaveBeenCalled();
      });

      it('should draw rectangle when in drawing mode', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        const event = createMockPointerEvent(110, 100);

        plugin.onPointerMove(event);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.rect).toHaveBeenCalledWith(10, 20, 100, 80);
        expect(mockCtx.stroke).toHaveBeenCalled();
      });
    });

    describe('onPointerUp', () => {
      it('should not save when not in drawing mode', () => {
        plugin.isDrawing = false;
        const event = createMockPointerEvent(100, 100);

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.addShape).not.toHaveBeenCalled();
      });

      it('should save rectangle shape and reset drawing flag', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        mockCtx.strokeStyle = '#ff0000';
        mockCtx.fillStyle = '#00ff00';
        mockCtx.lineWidth = 3;
        const event = createMockPointerEvent(110, 100);

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.addShape).toHaveBeenCalledWith({
          type: 'rectangle',
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
