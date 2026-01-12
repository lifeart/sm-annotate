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
    shapeIndex: number;
    lastDrawnShape: IShape | null;
    isScale: boolean;
    selectedShapeIndex: number;
    private boundHandleKeyDown;
    /**
     * Get the currently selected shape, if any
     */
    getSelectedShape(): IShape | null;
    /**
     * Set opacity for the currently selected shape
     */
    setSelectedShapeOpacity(opacity: number): boolean;
    move(shape: IMove): IMove;
    normalize(shape: IMove): IMove;
    onActivate(): void;
    onDeactivate(): void;
    private handleKeyDown;
    private deleteSelectedShape;
    onPointerDown(event: PointerEvent): void;
    isPointerAtShape(shape: IShape, x: number, y: number): boolean;
    isPointerAtCorner(rawShape: IImage | IAudioPeaks, x: number, y: number): boolean;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    draw(): void;
    reset(): void;
    save(shape: IShape): void;
}
