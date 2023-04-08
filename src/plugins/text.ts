import { BasePlugin, IShapeBase, ToolPlugin } from "./base";

export interface IText extends IShapeBase {
  type: "text";
  x: number;
  y: number;
  text: string;
}

export class TextToolPlugin
  extends BasePlugin<IText>
  implements ToolPlugin<IText>
{
  name = "text";
  onActivate() {
    this.annotationTool.canvas.style.cursor = "text";
    this.isDrawing = true;
  }
  onDeactivate() {
    this.annotationTool.canvas.style.cursor = "default";
    this.isDrawing = false;
  }

  draw(shape: IText) {
    this.drawText(shape.x, shape.y, shape.text);
  }
  drawText(x: number, y: number, text: string) {
    const fontSize = 16 + this.ctx.lineWidth * 0.5;
    this.ctx.font = `${fontSize}px Helvetica Neue, Arial`;
    this.ctx.fillText(text, x, y);
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.startX = x;
    this.startY = y;
  }
  onPointerMove(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  normalize(shape: IText, canvasWidth: number, canvasHeight: number): IText {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
    };
  }
  onPointerUp(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    const inputText = prompt("Enter the text to be drawn:");
    if (inputText !== null) {
      this.save({
        type: "text",
        x,
        y,
        text: inputText,
        strokeStyle: this.ctx.strokeStyle,
        fillStyle: this.ctx.fillStyle,
        lineWidth: this.ctx.lineWidth,
      });
    }
  }
}
