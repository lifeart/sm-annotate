import type { ShapeMap } from ".";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";

export interface IArrow extends IShapeBase {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class ArrowToolPlugin
  extends BasePlugin<IArrow>
  implements ToolPlugin<IArrow>
{
  name = "arrow" as keyof ShapeMap;
  normalize(shape: IArrow, canvasWidth: number, canvasHeight: number): IArrow {
    return {
      ...shape,
      x1: shape.x1 / canvasWidth,
      y1: shape.y1 / canvasHeight,
      x2: shape.x2 / canvasWidth,
      y2: shape.y2 / canvasHeight,
    };
  }
  move(shape: IArrow, dx: number, dy: number) {
    shape.x1 += dx;
    shape.y1 += dy;
    shape.x2 += dx;
    shape.y2 += dy;
    return shape;
  }
  draw(shape: IArrow) {
    const centerX = (shape.x1 + shape.x2) / 2;
    const centerY = (shape.y1 + shape.y2) / 2;
    const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
    const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);

    this.drawArrow(shape.x1, shape.y1, shape.x2, shape.y2, shape.lineWidth);

    if (rotated) {
      this.restoreRotation();
    }
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

    this.drawArrow(this.startX, this.startY, x, y);
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.save({
      type: "arrow",
      x1: this.startX,
      y1: this.startY,
      x2: x,
      y2: y,
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    });
    this.drawArrow(this.startX, this.startY, x, y);
    this.isDrawing = false;
  }
  drawArrow(x1: number, y1: number, x2: number, y2: number, lineWidth?: number) {
    const headLength = 10 + 2.5 * (lineWidth ?? this.ctx.lineWidth); // Length of the arrowhead
    const headAngle = Math.PI / 6; // Angle of arrowhead from the line

    // Calculate the angle of the line
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Draw the line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Draw the arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - headLength * Math.cos(angle + headAngle),
      y2 - headLength * Math.sin(angle + headAngle)
    );
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - headLength * Math.cos(angle - headAngle),
      y2 - headLength * Math.sin(angle - headAngle)
    );
    this.ctx.stroke();
  }
  isPointerAtShape(shape: IArrow, x: number, y: number): boolean {
    const { x1, y1, x2, y2 } = shape;
    const tolerance = Math.max((shape.lineWidth ?? 1) / 2, 5);

    const distance = (x2 - x1) * (y1 - y) - (x1 - x) * (y2 - y1);
    const lengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

    // Handle zero-length arrows (point)
    if (lengthSquared === 0) {
      const dx = x - x1;
      const dy = y - y1;
      return Math.sqrt(dx * dx + dy * dy) <= tolerance;
    }

    return (
      Math.abs(distance) / Math.sqrt(lengthSquared) <= tolerance &&
      x >= Math.min(x1, x2) - tolerance &&
      x <= Math.max(x1, x2) + tolerance &&
      y >= Math.min(y1, y2) - tolerance &&
      y <= Math.max(y1, y2) + tolerance
    );
  }
}
