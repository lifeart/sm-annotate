import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";
export interface ILine extends IShapeBase {
    type: "line";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare class LineToolPlugin extends BasePlugin<ILine> implements ToolPlugin<ILine> {
    name: keyof ShapeMap;
    move(shape: ILine, dx: number, dy: number): ILine;
    normalize(shape: ILine, canvasWidth: number, canvasHeight: number): ILine;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawLine(x1: number, y1: number, x2: number, y2: number): void;
    draw(shape: ILine): void;
    isPointerAtShape(shape: ILine, x: number, y: number): boolean;
}
