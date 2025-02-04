import type { ShapeMap } from ".";
import { IShapeBase, BasePlugin, ToolPlugin } from "./base";

export interface ICircle extends IShapeBase {
  type: "circle";
  x: number;
  y: number;
  radius: number;
}

export class CircleToolPlugin
  extends BasePlugin<ICircle>
  implements ToolPlugin<ICircle>
{
  name = "circle"  as keyof ShapeMap;
  move(shape: ICircle, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }
  normalize(
    shape: ICircle,
    canvasWidth: number,
    canvasHeight: number
  ): ICircle {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
      radius: shape.radius / canvasWidth,
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

    const radius = Math.sqrt(
      Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
    );
    this.drawCircle(this.startX, this.startY, radius);
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    const radius = Math.sqrt(
      Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2)
    );
    this.save({
      type: "circle",
      x: this.startX,
      y: this.startY,
      radius: radius,
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    });
    this.drawCircle(this.startX, this.startY, radius);
    this.isDrawing = false;
  }
  drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
  draw(shape: ICircle) {
    this.drawCircle(shape.x, shape.y, shape.radius);
  }
  isPointerInsideShape(shape: ICircle, x: number, y: number): boolean {
    const dx = x - shape.x;
    const dy = y - shape.y;
    return dx * dx + dy * dy <= shape.radius * shape.radius;
  }
}
