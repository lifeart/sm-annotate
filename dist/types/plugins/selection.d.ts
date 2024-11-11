import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";
export interface ISelection extends IShapeBase {
    type: "selection";
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class SelectionToolPlugin extends BasePlugin<ISelection> implements ToolPlugin<ISelection> {
    name: keyof ShapeMap;
    selectedArea: ImageData | null;
    move(shape: ISelection, dx: number, dy: number): ISelection;
    normalize(shape: ISelection, canvasWidth: number, canvasHeight: number): ISelection;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawSelectionRect(x: number, y: number, width: number, height: number): void;
    draw(shape: ISelection): void;
    reset(): void;
}
