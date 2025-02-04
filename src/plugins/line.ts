import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export interface ILine extends IShapeBase {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class LineToolPlugin
  extends BasePlugin<ILine>
  implements ToolPlugin<ILine>
{
  name = "line" as keyof ShapeMap;
  move(shape: ILine, dx: number, dy: number) {
    shape.x1 += dx;
    shape.y1 += dy;
    shape.x2 += dx;
    shape.y2 += dy;
    return shape;
  }
  normalize(shape: ILine, canvasWidth: number, canvasHeight: number): ILine {
    return {
      ...shape,
      x1: shape.x1 / canvasWidth,
      y1: shape.y1 / canvasHeight,
      x2: shape.x2 / canvasWidth,
      y2: shape.y2 / canvasHeight,
    };
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
  }
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.drawLine(this.startX, this.startY, x, y);
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.save({
      type: "line",
      x1: this.startX,
      y1: this.startY,
      x2: x,
      y2: y,
      fillStyle: this.ctx.fillStyle,
      strokeStyle: this.ctx.strokeStyle,
      lineWidth: this.ctx.lineWidth,
    });
    this.drawLine(this.startX, this.startY, x, y);
    this.isDrawing = false;
  }
  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
  draw(shape: ILine) {
    this.drawLine(shape.x1, shape.y1, shape.x2, shape.y2);
  }
  isPointerAtShape(shape: ILine, x: number, y: number): boolean {
    const { x1, y1, x2, y2 } = shape;
    const tolerance = 5; // Adjust as needed

    const distance = (x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1);
    const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

    return (
      Math.abs(distance) / Math.sqrt(lengthSquared) <= tolerance &&
      x >= Math.min(x1, x2) - tolerance &&
      x <= Math.max(x1, x2) + tolerance &&
      y >= Math.min(y1, y2) - tolerance &&
      y <= Math.max(y1, y2) + tolerance
    );
  }
}
