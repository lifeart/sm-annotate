import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

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
  name = "image" as keyof ShapeMap;
  move(shape: IImage, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }
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
      console.error("Image is not an instance of HTMLImageElement");
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
  isPointerAtShape(shape: IImage, x: number, y: number): boolean {
    // Normalize coordinates to handle negative width/height
    const minX = Math.min(shape.x, shape.x + shape.width);
    const maxX = Math.max(shape.x, shape.x + shape.width);
    const minY = Math.min(shape.y, shape.y + shape.height);
    const maxY = Math.max(shape.y, shape.y + shape.height);

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
}
