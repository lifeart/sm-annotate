import { BasePlugin, IShapeBase, ToolPlugin } from "./base";

export interface IImage extends IShapeBase {
  type: "image";
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class ImageToolPlugin
  extends BasePlugin<IImage>
  implements ToolPlugin<IImage>
{
  name = "image";
  onPointerDown(event: PointerEvent) {
    // eol
  }
  onPointerMove(event: PointerEvent) {
    // eol
  }
  onPointerUp(event: PointerEvent) {
    // eol
  }
  normalize(shape: IImage, canvasWidth: number, canvasHeight: number): IImage {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
      width: shape.width / canvasWidth,
      height: shape.height / canvasHeight,
    };
  }
  draw(shape: IImage) {
    if (!(shape.image instanceof HTMLImageElement)) {
        return;
    }
    this.ctx.drawImage(
      shape.image,
      shape.x,
      shape.y,
      shape.width,
      shape.height
    );
  }
}
