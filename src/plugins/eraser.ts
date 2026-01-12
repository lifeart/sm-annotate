import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export interface IEraser extends IShapeBase {
  type: "eraser";
  x: number;
  y: number;
  width: number;
  height: number;
}

export class EraserToolPlugin
  extends BasePlugin<IEraser>
  implements ToolPlugin<IEraser>
{
  name = "eraser" as keyof ShapeMap;
  move(shape: IEraser, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }
  normalize(
    shape: IEraser,
    canvasWidth: number,
    canvasHeight: number
  ): IEraser {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
      width: shape.width / canvasWidth,
      height: shape.height / canvasHeight,
    };
  }
  draw(shape: IEraser) {
    this.drawEraser(shape.x, shape.y, shape.width, shape.height);
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

    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.fillRect(
      this.startX,
      this.startY,
      x - this.startX,
      y - this.startY
    );
    this.ctx.strokeRect(
      this.startX,
      this.startY,
      x - this.startX,
      y - this.startY
    );
    this.ctx.restore();
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    this.isDrawing = false;
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.save({
      type: "eraser",
      x: this.startX,
      y: this.startY,
      width: x - this.startX,
      height: y - this.startY,
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    });

    // invoke draw shapes here to clear borders
  }
  drawEraser(x: number, y: number, width: number, height: number) {
    this.ctx.clearRect(x, y, width, height);
  }

  isPointerAtShape(shape: IEraser, x: number, y: number): boolean {
    // Normalize coordinates to handle negative width/height
    const minX = Math.min(shape.x, shape.x + shape.width);
    const maxX = Math.max(shape.x, shape.x + shape.width);
    const minY = Math.min(shape.y, shape.y + shape.height);
    const maxY = Math.max(shape.y, shape.y + shape.height);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
}
