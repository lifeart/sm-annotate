import type { IShape } from ".";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
export interface IMove extends IShapeBase {
    type: "move";
}
export declare class MoveToolPlugin extends BasePlugin<IMove> implements ToolPlugin<IMove> {
    name: string;
    shape: IShape | null;
    lastDrawnShape: IShape | null;
    shapeRemoved: boolean;
    move(shape: IMove): IMove;
    normalize(shape: IMove): IMove;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    draw(): void;
    reset(): void;
}
