import type { IShape } from ".";
import { IAudioPeaks } from "./audio-peaks";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { IImage } from "./image";
import type { ShapeMap } from ".";
export interface IMove extends IShapeBase {
    type: "move";
}
export declare class MoveToolPlugin extends BasePlugin<IMove> implements ToolPlugin<IMove> {
    name: keyof ShapeMap;
    shape: IShape | null;
    lastDrawnShape: IShape | null;
    shapeRemoved: boolean;
    isScale: boolean;
    move(shape: IMove): IMove;
    normalize(shape: IMove): IMove;
    onPointerDown(event: PointerEvent): void;
    isPointerAtCorner(rawShape: IImage | IAudioPeaks, x: number, y: number): boolean;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    draw(): void;
    reset(): void;
}
