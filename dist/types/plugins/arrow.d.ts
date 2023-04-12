import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
export interface IArrow extends IShapeBase {
    type: "arrow";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare class ArrowToolPlugin extends BasePlugin<IArrow> implements ToolPlugin<IArrow> {
    name: string;
    normalize(shape: IArrow, canvasWidth: number, canvasHeight: number): IArrow;
    move(shape: IArrow, dx: number, dy: number): IArrow;
    draw(shape: IArrow): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawArrow(x1: number, y1: number, x2: number, y2: number): void;
}
