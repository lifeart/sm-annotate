import { describe, it, expect } from 'vitest';
import { Point, douglasPeucker } from '../src/plugins/utils/douglas-peucker';

describe('Point', () => {
  describe('constructor', () => {
    it('should create a point with x and y coordinates', () => {
      const point = new Point(10, 20);
      expect(point.x).toBe(10);
      expect(point.y).toBe(20);
    });
  });

  describe('distanceToLine', () => {
    it('should calculate distance from point to a horizontal line', () => {
      const point = new Point(5, 5);
      const p1 = new Point(0, 0);
      const p2 = new Point(10, 0);

      const distance = point.distanceToLine(p1, p2);
      expect(distance).toBe(5);
    });

    it('should calculate distance from point to a vertical line', () => {
      const point = new Point(5, 5);
      const p1 = new Point(0, 0);
      const p2 = new Point(0, 10);

      const distance = point.distanceToLine(p1, p2);
      expect(distance).toBe(5);
    });

    it('should calculate distance from point to a diagonal line', () => {
      const point = new Point(0, 10);
      const p1 = new Point(0, 0);
      const p2 = new Point(10, 10);

      const distance = point.distanceToLine(p1, p2);
      // Distance from (0,10) to line y=x is |0-10|/sqrt(2) = 10/sqrt(2) ≈ 7.07
      expect(distance).toBeCloseTo(7.07, 1);
    });

    it('should return 0 when point is on the line', () => {
      const point = new Point(5, 5);
      const p1 = new Point(0, 0);
      const p2 = new Point(10, 10);

      const distance = point.distanceToLine(p1, p2);
      expect(distance).toBeCloseTo(0, 5);
    });
  });
});

describe('douglasPeucker', () => {
  it('should return same points if 2 or fewer points', () => {
    const points = [new Point(0, 0), new Point(10, 10)];
    const result = douglasPeucker(points, 1);
    expect(result).toEqual(points);
  });

  it('should return same points if only 1 point', () => {
    const points = [new Point(0, 0)];
    const result = douglasPeucker(points, 1);
    expect(result).toEqual(points);
  });

  it('should return empty array for empty input', () => {
    const points: Point[] = [];
    const result = douglasPeucker(points, 1);
    expect(result).toEqual([]);
  });

  it('should simplify a straight line to two points', () => {
    const points = [
      new Point(0, 0),
      new Point(2, 2),
      new Point(4, 4),
      new Point(6, 6),
      new Point(10, 10),
    ];
    const result = douglasPeucker(points, 0.1);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(points[0]);
    expect(result[1]).toEqual(points[points.length - 1]);
  });

  it('should preserve points that deviate significantly from line', () => {
    const points = [
      new Point(0, 0),
      new Point(5, 10), // Significant deviation
      new Point(10, 0),
    ];
    const result = douglasPeucker(points, 1);
    expect(result.length).toBe(3);
  });

  it('should remove points that are within epsilon of the line', () => {
    const points = [
      new Point(0, 0),
      new Point(5, 0.1), // Very small deviation
      new Point(10, 0),
    ];
    const result = douglasPeucker(points, 1);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(points[0]);
    expect(result[1]).toEqual(points[2]);
  });

  it('should handle complex curves', () => {
    const points = [
      new Point(0, 0),
      new Point(1, 1),
      new Point(2, 0),
      new Point(3, 1),
      new Point(4, 0),
      new Point(5, 1),
      new Point(6, 0),
    ];
    const result = douglasPeucker(points, 0.5);
    // Should preserve most points due to zigzag pattern
    expect(result.length).toBeGreaterThan(2);
  });

  it('should work with epsilon of 0', () => {
    const points = [
      new Point(0, 0),
      new Point(5, 1), // Any deviation > 0
      new Point(10, 0),
    ];
    const result = douglasPeucker(points, 0);
    expect(result.length).toBe(3);
  });

  it('should handle recursive simplification', () => {
    const points = [
      new Point(0, 0),
      new Point(2, 5),  // First major deviation
      new Point(4, 0),
      new Point(6, 5),  // Second major deviation
      new Point(8, 0),
      new Point(10, 5), // Third major deviation
      new Point(12, 0),
    ];
    const result = douglasPeucker(points, 1);
    // All peaks should be preserved
    expect(result.length).toBeGreaterThanOrEqual(4);
  });
});
