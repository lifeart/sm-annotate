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
export declare class ImageToolPlugin extends BasePlugin<IImage> implements ToolPlugin<IImage> {
    name: keyof ShapeMap;
    move(shape: IImage, dx: number, dy: number): IImage;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    normalize(shape: IImage, canvasWidth: number, canvasHeight: number): IImage;
    draw(shape: IImage): void;
    isPointerAtShape(shape: IImage, x: number, y: number): boolean;
}
