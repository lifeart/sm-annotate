import { IShapeBase, BasePlugin, ToolPlugin } from "./base";

export interface ICompare extends IShapeBase {
  type: "compare";
  x: number;
}

export class CompareToolPlugin
  extends BasePlugin<ICompare>
  implements ToolPlugin<ICompare>
{
  name = "compare";
  comparisonLine = 0;
  leftOpacity = 1;
  rightOpacity = 1;
  isDrawing = false;
  move(shape: ICompare, dx: number, dy: number) {
    shape.x += dx;
    return shape;
  }
  onActivate(): void {
    this.comparisonLine = this.annotationTool.canvasWidth / 2;
    this.leftOpacity = 0.7;
    this.rightOpacity = 0.7;
  }
  onDeactivate(): void {
    this.comparisonLine = 0;
    this.leftOpacity = 1;
    this.rightOpacity = 1;
  }
  normalize(shape: ICompare, canvasWidth: number): ICompare {
    return {
      ...shape,
      x: shape.x / canvasWidth,
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
    const { x } = this.annotationTool.getRelativeCoords(event);

    this.comparisonLine = x;
    // this.startY = this.comparisonLine;
    this.draw({
      type: "compare",
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
      x: x,
    });
  }
  onPointerUp() {
    if (!this.isDrawing) {
      return;
    }

    this.save({
      type: "compare",
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
      x: this.comparisonLine,
    });
    this.isDrawing = false;
  }

  save(shape: ICompare) {
    this.annotationTool.addSingletonShape(shape);
  }

  draw(shape: ICompare) {
    const video1 = this.annotationTool.videoElement;

    const globalAlpha = this.ctx.globalAlpha;
    const w = this.annotationTool.canvasWidth;
    const h = this.annotationTool.canvasHeight;
    const x = shape.x;

    const strokeStyle = this.ctx.strokeStyle;

    this.ctx.globalAlpha = this.leftOpacity;
    const filter = this.ctx.filter;

    const cropWidth = x;

    this.ctx.filter = "grayscale(80%) brightness(120%)";

    this.ctx.drawImage(
      video1,
      0,
      0,
      cropWidth,
      h, // Source cropping parameters
      0,
      0,
      cropWidth,
      h // Destination position and size
    );

    this.ctx.filter = "contrast(140%) blur(1px)";

    const cropX = x; // The X coordinate of the vertical crop line
    const cropWidth1 = w - cropX;

    this.ctx.drawImage(
      video1,
      cropX,
      0,
      cropWidth1,
      h, // Source cropping parameters
      cropX,
      0,
      cropWidth1,
      h // Destination position and size
    );

    this.ctx.filter = filter;
    this.ctx.globalAlpha = globalAlpha;
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    this.ctx.lineTo(x, w);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
  }
}
