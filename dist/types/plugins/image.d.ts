import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
export interface IImage extends IShapeBase {
    type: "image";
    image: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class ImageToolPlugin extends BasePlugin<IImage> implements ToolPlugin<IImage> {
    name: string;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    normalize(shape: IImage, canvasWidth: number, canvasHeight: number): IImage;
    draw(shape: IImage): void;
}
