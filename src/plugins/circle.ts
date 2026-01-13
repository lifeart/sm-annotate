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
    // Handle missing or invalid radius
    if (shape.radius === undefined || shape.radius < 0) {
      return;
    }

    // Circle center is already at x, y
    const rotationCenter = this.getRotationCenter(shape, shape.x, shape.y);
    const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);

    this.drawCircle(shape.x, shape.y, shape.radius);

    if (rotated) {
      this.restoreRotation();
    }
  }
  isPointerAtShape(shape: ICircle, x: number, y: number): boolean {
    if (shape.radius === undefined || shape.radius < 0) return false;
    const dx = x - shape.x;
    const dy = y - shape.y;
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    const tolerance = Math.max((shape.lineWidth ?? 1) / 2, 5);
    // Check if inside circle or near the edge (stroke)
    return distanceFromCenter <= shape.radius + tolerance;
  }
}
