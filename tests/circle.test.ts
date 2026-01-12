import { describe, it, expect } from 'vitest';
import { ICircle, CircleToolPlugin } from '../src/plugins/circle';

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
});
