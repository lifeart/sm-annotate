export class Point {
    constructor(public x: number, public y: number) {}
  
    distanceToLine(p1: Point, p2: Point): number {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
  
      const numerator = Math.abs(
        dy * this.x - dx * this.y + p2.x * p1.y - p2.y * p1.x
      );
      const denominator = Math.sqrt(dy * dy + dx * dx);
  
      return numerator / denominator;
    }
  }
  
export function douglasPeucker(points: Point[], epsilon: number): Point[] {
    if (points.length <= 2) return points;
  
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
  
    let index = -1;
    let maxDistance = 0;
  
    for (let i = 1; i < points.length - 1; i++) {
      const distance = points[i].distanceToLine(firstPoint, lastPoint);
      if (distance > maxDistance) {
        index = i;
        maxDistance = distance;
      }
    }
  
    if (maxDistance > epsilon) {
      const left = douglasPeucker(points.slice(0, index + 1), epsilon);
      const right = douglasPeucker(points.slice(index), epsilon);
  
      return left.slice(0, left.length - 1).concat(right);
    } else {
      return [firstPoint, lastPoint];
    }
  }