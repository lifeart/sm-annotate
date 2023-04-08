import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
export interface IText extends IShapeBase {
    type: "text";
    x: number;
    y: number;
    text: string;
}
export declare class TextToolPlugin extends BasePlugin<IText> implements ToolPlugin<IText> {
    name: string;
    onActivate(): void;
    onDeactivate(): void;
    draw(shape: IText): void;
    drawText(x: number, y: number, text: string): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    normalize(shape: IText, canvasWidth: number, canvasHeight: number): IText;
    onPointerUp(event: PointerEvent): void;
}
