import { BasePlugin, IShapeBase, ToolPlugin } from "./base";

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
  name = "rectangle";
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
    this.drawRectangle(shape.x, shape.y, shape.width, shape.height);
  }
}
