import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IImage, ImageToolPlugin } from '../src/plugins/image';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('ImageToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize image coordinates relative to canvas size', () => {
      const plugin = Object.create(ImageToolPlugin.prototype);

      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        image: {} as HTMLImageElement,
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
    it('should move image by delta values', () => {
      const plugin = Object.create(ImageToolPlugin.prototype);

      const shape: IImage = {
        type: 'image',
        x: 100,
        y: 100,
        width: 50,
        height: 30,
        image: {} as HTMLImageElement,
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
    const plugin = Object.create(ImageToolPlugin.prototype);

    const shape: IImage = {
      type: 'image',
      x: 100,
      y: 100,
      width: 100,
      height: 50,
      image: {} as HTMLImageElement,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is inside image bounds', () => {
      expect(plugin.isPointerAtShape(shape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 200, 150)).toBe(true);
    });

    it('should return false when pointer is outside image bounds', () => {
      expect(plugin.isPointerAtShape(shape, 50, 125)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 250, 125)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 50)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 200)).toBe(false);
    });
  });

  describe('isPointerAtShape - negative dimensions', () => {
    const plugin = Object.create(ImageToolPlugin.prototype);

    const negativeWidthShape: IImage = {
      type: 'image',
      x: 200,
      y: 100,
      width: -100,
      height: 50,
      image: {} as HTMLImageElement,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative width correctly', () => {
      expect(plugin.isPointerAtShape(negativeWidthShape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(negativeWidthShape, 50, 125)).toBe(false);
    });

    const negativeHeightShape: IImage = {
      type: 'image',
      x: 100,
      y: 150,
      width: 100,
      height: -50,
      image: {} as HTMLImageElement,
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
    let plugin: ImageToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockCtx.drawImage = vi.fn();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new ImageToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('draw', () => {
      it('should draw image with shape coordinates', () => {
        // Create a mock HTMLImageElement
        const mockImage = document.createElement('img');

        const shape: IImage = {
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          image: mockImage,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.drawImage).toHaveBeenCalledWith(mockImage, 100, 100, 200, 150);
      });

      it('should log error and not draw if image is not HTMLImageElement', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const shape: IImage = {
          type: 'image',
          x: 100,
          y: 100,
          width: 200,
          height: 150,
          image: {} as HTMLImageElement, // Not a real HTMLImageElement
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(consoleSpy).toHaveBeenCalledWith('Image is not an instance of HTMLImageElement');
        expect(mockCtx.drawImage).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });

    describe('onPointerDown', () => {
      it('should be a no-op', () => {
        const event = createMockPointerEvent(50, 75);
        // Should not throw
        expect(() => plugin.onPointerDown(event)).not.toThrow();
      });
    });

    describe('onPointerMove', () => {
      it('should be a no-op', () => {
        const event = createMockPointerEvent(50, 75);
        // Should not throw
        expect(() => plugin.onPointerMove(event)).not.toThrow();
      });
    });

    describe('onPointerUp', () => {
      it('should be a no-op', () => {
        const event = createMockPointerEvent(50, 75);
        // Should not throw
        expect(() => plugin.onPointerUp(event)).not.toThrow();
      });
    });
  });
});
