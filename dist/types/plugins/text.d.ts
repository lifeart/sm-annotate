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
    private activePopup;
    handleKeyDown: (_e: KeyboardEvent) => undefined;
    move(shape: IText, dx: number, dy: number): IText;
    onActivate(): void;
    onDeactivate(): void;
    draw(shape: IText): void;
    drawText(x: number, y: number, text: string): void;
    private drawTextLine;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    normalize(shape: IText, canvasWidth: number, canvasHeight: number): IText;
    private destroyPopup;
    private createTextInputPopup;
    onPointerUp(event: PointerEvent): void;
    isPointerAtShape(shape: IText, x: number, y: number): boolean;
}
