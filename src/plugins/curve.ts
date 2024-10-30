import { Point, douglasPeucker } from "./utils/douglas-peucker";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export type IPoint = {
  x: number;
  y: number;
};

export interface ICurve extends IShapeBase {
  type: "curve";
  points: IPoint[];
}

export class CurveToolPlugin
  extends BasePlugin<ICurve>
  implements ToolPlugin<ICurve>
{
  name = "curve" as keyof ShapeMap;
  curvePoints: IPoint[] = [];
  move(shape: ICurve, dx: number, dy: number) {
    shape.points = shape.points.map((point) => ({
      x: point.x + dx,
      y: point.y + dy,
    }));
    return shape;
  }
  normalize(shape: ICurve, canvasWidth: number, canvasHeight: number): ICurve {
    return {
      ...shape,
      points: shape.points.map((point) => ({
        x: point.x / canvasWidth,
        y: point.y / canvasHeight,
      })),
    };
  }
  draw(shape: ICurve) {
    this.drawCurve(shape);
  }
  reset(): void {
    super.reset();
    this.curvePoints = [];
  }
  onPointerDown(event: PointerEvent) {
    if (this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.curvePoints = [];
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
    this.curvePoints.push({ x, y });
  }
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.curvePoints.push({ x, y });
    this.drawCurve({
      points: this.curvePoints,
      lineWidth: this.ctx.lineWidth,
    });
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.curvePoints.push({ x, y });

    const curvePointsAsPoints = this.curvePoints.map(
      (pt) => new Point(pt.x, pt.y)
    );

    // Optimize the points using the Douglas-Peucker algorithm
    const epsilon = 2; // Adjust the epsilon value to control the level of simplification
    const optimizedPoints = douglasPeucker(curvePointsAsPoints, epsilon);

    // Convert the optimized points back to the original point format
    const optimizedCurvePoints = optimizedPoints.map((pt) => ({
      x: pt.x,
      y: pt.y,
    }));

    const shape: ICurve = {
      type: "curve",
      points: optimizedCurvePoints,
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    };
    this.save(shape);
    this.curvePoints = []; // Reset curve points
    this.isDrawing = false;
  }
  drawCurve(shape: Pick<ICurve, "points" | "lineWidth">) {
    // if only two points and they are the same, draw a circle

    if (
      shape.points.length === 2 &&
      shape.points[0].x === shape.points[1].x &&
      shape.points[0].y === shape.points[1].y
    ) {
      const radius = shape.lineWidth / 4;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;
      this.ctx.beginPath();
      this.ctx.arc(
        shape.points[0].x,
        shape.points[0].y,
        radius,
        startAngle,
        endAngle
      );
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

      for (let i = 0; i < shape.points.length - 1; i++) {
        const controlPoint = shape.points[i];
        const endPoint = shape.points[i + 1];
        this.ctx.quadraticCurveTo(
          controlPoint.x,
          controlPoint.y,
          endPoint.x,
          endPoint.y
        );
      }
      this.ctx.stroke();
    }
  }
}
