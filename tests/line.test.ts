import { describe, it, expect } from 'vitest';
import { ILine, LineToolPlugin } from '../src/plugins/line';

describe('LineToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize line coordinates relative to canvas size', () => {
      const plugin = Object.create(LineToolPlugin.prototype);

      const shape: ILine = {
        type: 'line',
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
    it('should move both line endpoints by delta values', () => {
      const plugin = Object.create(LineToolPlugin.prototype);

      const shape: ILine = {
        type: 'line',
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
    const plugin = Object.create(LineToolPlugin.prototype);

    const shape: ILine = {
      type: 'line',
      x1: 100,
      y1: 100,
      x2: 200,
      y2: 100, // Horizontal line
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is on the line', () => {
      expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
    });

    it('should return true when pointer is near the line (within tolerance)', () => {
      expect(plugin.isPointerAtShape(shape, 150, 103)).toBe(true);
    });

    it('should return true at start point', () => {
      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
    });

    it('should return true at end point', () => {
      expect(plugin.isPointerAtShape(shape, 200, 100)).toBe(true);
    });

    it('should return false when pointer is far from the line', () => {
      expect(plugin.isPointerAtShape(shape, 150, 150)).toBe(false);
    });

    it('should return false when pointer is beyond line endpoints', () => {
      expect(plugin.isPointerAtShape(shape, 50, 100)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 250, 100)).toBe(false);
    });
  });

  describe('isPointerAtShape - diagonal line', () => {
    const plugin = Object.create(LineToolPlugin.prototype);

    const diagonalShape: ILine = {
      type: 'line',
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is on diagonal line', () => {
      expect(plugin.isPointerAtShape(diagonalShape, 50, 50)).toBe(true);
    });

    it('should return true when pointer is near diagonal line', () => {
      expect(plugin.isPointerAtShape(diagonalShape, 52, 50)).toBe(true);
    });

    it('should return false when pointer is far from diagonal line', () => {
      expect(plugin.isPointerAtShape(diagonalShape, 20, 80)).toBe(false);
    });
  });
});
