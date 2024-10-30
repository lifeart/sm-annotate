import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";
export interface IText extends IShapeBase {
    type: "text";
    x: number;
    y: number;
    text: string;
}
export declare class TextToolPlugin extends BasePlugin<IText> implements ToolPlugin<IText> {
    name: keyof ShapeMap;
    move(shape: IText, dx: number, dy: number): IText;
    onActivate(): void;
    onDeactivate(): void;
    draw(shape: IText): void;
    drawText(x: number, y: number, text: string): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    normalize(shape: IText, canvasWidth: number, canvasHeight: number): IText;
    onPointerUp(event: PointerEvent): void;
}
