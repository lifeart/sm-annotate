import { describe, it, expect, beforeEach } from 'vitest';
import { ICircle, CircleToolPlugin } from '../src/plugins/circle';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('CircleToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize circle coordinates relative to canvas size', () => {
      const plugin = Object.create(CircleToolPlugin.prototype);

      const shape: ICircle = {
        type: 'circle',
        x: 200,
        y: 100,
        radius: 50,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x).toBe(0.5); // 200 / 400
      expect(normalized.y).toBe(0.5); // 100 / 200
      expect(normalized.radius).toBe(0.125); // 50 / 400
    });
  });

  describe('move', () => {
    it('should move circle by delta values', () => {
      const plugin = Object.create(CircleToolPlugin.prototype);

      const shape: ICircle = {
        type: 'circle',
        x: 100,
        y: 100,
        radius: 50,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 30, -20);

      expect(moved.x).toBe(130);
      expect(moved.y).toBe(80);
      expect(moved.radius).toBe(50); // radius should remain unchanged
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = Object.create(CircleToolPlugin.prototype);

    const shape: ICircle = {
      type: 'circle',
      x: 100,
      y: 100,
      radius: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is at center', () => {
      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
    });

    it('should return true when pointer is inside circle', () => {
      expect(plugin.isPointerAtShape(shape, 120, 110)).toBe(true);
    });

    it('should return true when pointer is on the edge', () => {
      expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
    });

    it('should return false when pointer is outside circle', () => {
      expect(plugin.isPointerAtShape(shape, 200, 100)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 100, 200)).toBe(false);
    });
  });

  describe('isPointerAtShape - lineWidth tolerance', () => {
    const plugin = Object.create(CircleToolPlugin.prototype);

    it('should use shape lineWidth for tolerance calculation', () => {
      const thinCircle: ICircle = {
        type: 'circle',
        x: 100,
        y: 100,
        radius: 50,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const thickCircle: ICircle = {
        type: 'circle',
        x: 100,
        y: 100,
        radius: 50,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 20,
      };

      // At distance 58 from center, thin circle should not be detected (radius 50 + tolerance ~5 = 55)
      expect(plugin.isPointerAtShape(thinCircle, 158, 100)).toBe(false);
      // At distance 58 from center, thick circle should be detected (radius 50 + tolerance ~10 = 60)
      expect(plugin.isPointerAtShape(thickCircle, 158, 100)).toBe(true);
    });
  });

  describe('drawing methods', () => {
    let plugin: CircleToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new CircleToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('draw', () => {
      it('should call drawCircle with shape coordinates', () => {
        const shape: ICircle = {
          type: 'circle',
          x: 100,
          y: 100,
          radius: 50,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, 50, 0, 2 * Math.PI);
        expect(mockCtx.stroke).toHaveBeenCalled();
      });
    });

    describe('drawCircle', () => {
      it('should draw circle with given parameters', () => {
        plugin.drawCircle(50, 75, 30);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(50, 75, 30, 0, 2 * Math.PI);
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

      it('should draw circle when in drawing mode', () => {
        plugin.isDrawing = true;
        plugin.startX = 100;
        plugin.startY = 100;
        const event = createMockPointerEvent(150, 100); // 50 pixels away = radius 50

        plugin.onPointerMove(event);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, 50, 0, 2 * Math.PI);
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

      it('should save circle shape and reset drawing flag', () => {
        plugin.isDrawing = true;
        plugin.startX = 100;
        plugin.startY = 100;
        mockCtx.strokeStyle = '#ff0000';
        mockCtx.fillStyle = '#00ff00';
        mockCtx.lineWidth = 3;
        const event = createMockPointerEvent(150, 100); // 50 pixels away = radius 50

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.addShape).toHaveBeenCalledWith({
          type: 'circle',
          x: 100,
          y: 100,
          radius: 50,
          strokeStyle: '#ff0000',
          fillStyle: '#00ff00',
          lineWidth: 3,
        });
        expect(plugin.isDrawing).toBe(false);
      });
    });
  });
});
