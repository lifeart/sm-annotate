import { BasePlugin, IShapeBase, ToolPlugin } from "./base";

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
  name = "line";
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
}
