import { describe, it, expect } from 'vitest';
import { IArrow, ArrowToolPlugin } from '../src/plugins/arrow';

describe('ArrowToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize arrow coordinates relative to canvas size', () => {
      const plugin = Object.create(ArrowToolPlugin.prototype);

      const shape: IArrow = {
        type: 'arrow',
        x1: 100,
        y1: 50,
        x2: 300,
        y2: 150,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x1).toBe(0.25); // 100 / 400
      expect(normalized.y1).toBe(0.25); // 50 / 200
      expect(normalized.x2).toBe(0.75); // 300 / 400
      expect(normalized.y2).toBe(0.75); // 150 / 200
    });
  });

  describe('move', () => {
    it('should move both arrow endpoints by delta values', () => {
      const plugin = Object.create(ArrowToolPlugin.prototype);

      const shape: IArrow = {
        type: 'arrow',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 150,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 50, -25);

      expect(moved.x1).toBe(150);
      expect(moved.y1).toBe(75);
      expect(moved.x2).toBe(250);
      expect(moved.y2).toBe(125);
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = Object.create(ArrowToolPlugin.prototype);

    const shape: IArrow = {
      type: 'arrow',
      x1: 100,
      y1: 100,
      x2: 200,
      y2: 100, // Horizontal arrow
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is on the arrow', () => {
      expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
    });

    it('should return true when pointer is near the arrow (within tolerance)', () => {
      expect(plugin.isPointerAtShape(shape, 150, 103)).toBe(true);
    });

    it('should return true at start point', () => {
      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
    });

    it('should return true at end point', () => {
      expect(plugin.isPointerAtShape(shape, 200, 100)).toBe(true);
    });

    it('should return false when pointer is far from the arrow', () => {
      expect(plugin.isPointerAtShape(shape, 150, 150)).toBe(false);
    });

    it('should return false when pointer is beyond arrow endpoints', () => {
      expect(plugin.isPointerAtShape(shape, 50, 100)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 250, 100)).toBe(false);
    });
  });

  describe('isPointerAtShape - diagonal arrow', () => {
    const plugin = Object.create(ArrowToolPlugin.prototype);

    const diagonalShape: IArrow = {
      type: 'arrow',
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is on diagonal arrow', () => {
      expect(plugin.isPointerAtShape(diagonalShape, 50, 50)).toBe(true);
    });

    it('should return true when pointer is near diagonal arrow', () => {
      expect(plugin.isPointerAtShape(diagonalShape, 52, 50)).toBe(true);
    });

    it('should return false when pointer is far from diagonal arrow', () => {
      expect(plugin.isPointerAtShape(diagonalShape, 20, 80)).toBe(false);
    });
  });

  describe('isPointerAtShape - zero-length arrow', () => {
    const plugin = Object.create(ArrowToolPlugin.prototype);

    const pointShape: IArrow = {
      type: 'arrow',
      x1: 100,
      y1: 100,
      x2: 100,
      y2: 100, // Zero-length (point)
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is at the point', () => {
      expect(plugin.isPointerAtShape(pointShape, 100, 100)).toBe(true);
    });

    it('should return true when pointer is near the point (within tolerance)', () => {
      expect(plugin.isPointerAtShape(pointShape, 103, 100)).toBe(true);
    });

    it('should return false when pointer is far from the point', () => {
      expect(plugin.isPointerAtShape(pointShape, 120, 100)).toBe(false);
    });
  });

  describe('isPointerAtShape - lineWidth tolerance', () => {
    const plugin = Object.create(ArrowToolPlugin.prototype);

    it('should use shape lineWidth for tolerance calculation', () => {
      const thinArrow: IArrow = {
        type: 'arrow',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const thickArrow: IArrow = {
        type: 'arrow',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 20,
      };

      // At y=108, thin arrow should not be detected (tolerance ~5)
      expect(plugin.isPointerAtShape(thinArrow, 150, 108)).toBe(false);
      // At y=108, thick arrow should be detected (tolerance ~10)
      expect(plugin.isPointerAtShape(thickArrow, 150, 108)).toBe(true);
    });
  });
});
