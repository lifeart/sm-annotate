import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export interface IRectangle extends IShapeBase {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export class RectangleToolPlugin
  extends BasePlugin<IRectangle>
  implements ToolPlugin<IRectangle>
{
  name = "rectangle" as keyof ShapeMap;
  move(shape: IRectangle, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }
  normalize(
    shape: IRectangle,
    canvasWidth: number,
    canvasHeight: number
  ): IRectangle {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
      width: shape.width / canvasWidth,
      height: shape.height / canvasHeight,
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

    this.drawRectangle(
      this.startX,
      this.startY,
      x - this.startX,
      y - this.startY
    );
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.save({
      type: "rectangle",
      x: this.startX,
      y: this.startY,
      width: x - this.startX,
      height: y - this.startY,
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    });
    this.drawRectangle(
      this.startX,
      this.startY,
      x - this.startX,
      y - this.startY
    );
    this.isDrawing = false;
  }
  drawRectangle(x: number, y: number, width: number, height: number) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
  }
  draw(shape: IRectangle) {
    const centerX = shape.x + shape.width / 2;
    const centerY = shape.y + shape.height / 2;
    const rotationCenter = this.getRotationCenter(shape, centerX, centerY);
    const rotated = this.applyRotation(shape, rotationCenter.x, rotationCenter.y);

    this.drawRectangle(shape.x, shape.y, shape.width, shape.height);

    if (rotated) {
      this.restoreRotation();
    }
  }
  isPointerAtShape(shape: IRectangle, x: number, y: number): boolean {
    const tolerance = 5;

    // Normalize coordinates to handle negative width/height
    const minX = Math.min(shape.x, shape.x + shape.width);
    const maxX = Math.max(shape.x, shape.x + shape.width);
    const minY = Math.min(shape.y, shape.y + shape.height);
    const maxY = Math.max(shape.y, shape.y + shape.height);

    // Check if point is near any of the rectangle edges
    const nearLeftEdge = Math.abs(x - minX) <= tolerance;
    const nearRightEdge = Math.abs(x - maxX) <= tolerance;
    const nearTopEdge = Math.abs(y - minY) <= tolerance;
    const nearBottomEdge = Math.abs(y - maxY) <= tolerance;

    // Point must be within the vertical range of rectangle for left/right edges
    const withinVerticalBounds = y >= minY - tolerance && y <= maxY + tolerance;
    // Point must be within the horizontal range of rectangle for top/bottom edges
    const withinHorizontalBounds = x >= minX - tolerance && x <= maxX + tolerance;

    return (
      (nearLeftEdge || nearRightEdge) && withinVerticalBounds ||
      (nearTopEdge || nearBottomEdge) && withinHorizontalBounds
    );
  }
}
