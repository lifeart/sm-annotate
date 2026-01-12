import { describe, it, expect } from 'vitest';
import { IRectangle, RectangleToolPlugin } from '../src/plugins/rectangle';

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
});
