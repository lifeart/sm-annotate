import type { IShape, ShapeMap } from ".";
import { IAudioPeaks } from "./audio-peaks";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { IImage } from "./image";
export interface IMove extends IShapeBase {
    type: "move";
}
type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class MoveToolPlugin extends BasePlugin<IMove> implements ToolPlugin<IMove> {
    name: keyof ShapeMap;
    shape: IShape | null;
    shapeIndex: number;
    lastDrawnShape: IShape | null;
    isScale: boolean;
    selectedShapeIndex: number;
    private boundHandleKeyDown;
    private activeHandle;
    private handleSize;
    private resizeStartBounds;
    private resizeOriginalShape;
    private rotationActive;
    private rotationStartAngle;
    private rotationShapeStartAngle;
    private centerDragActive;
    private rotationHandleDistance;
    /**
     * Deep clone a shape, preserving HTMLImageElement references that JSON.stringify can't handle
     */
    private cloneShape;
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
    /**
     * Duplicate the currently selected shape with an offset
     */
    private duplicateSelectedShape;
    /**
     * Copy current frame's annotations to the next frame
     */
    private copyAnnotationsToNextFrame;
    /**
     * Copy current frame's annotations to the previous frame
     */
    private copyAnnotationsToPrevFrame;
    /**
     * Offset a shape by dx, dy
     */
    private offsetShape;
    /**
     * Get bounding box for any shape
     */
    getShapeBounds(rawShape: IShape): BoundingBox | null;
    /**
     * Draw resize handles for the selected shape
     */
    drawResizeHandles(): void;
    /**
     * Get the rotation center for the selected shape in canvas coordinates
     */
    private getShapeRotationCenter;
    /**
     * Draw rotation handle and center point for the selected shape
     */
    private drawRotationHandles;
    /**
     * Check if pointer is at the rotation handle
     */
    private isPointerAtRotationHandle;
    /**
     * Check if pointer is at the rotation center
     */
    private isPointerAtRotationCenter;
    /**
     * Calculate angle from center to point
     */
    private calculateAngle;
    /**
     * Check if pointer is on a resize handle
     */
    getHandleAtPosition(x: number, y: number): HandlePosition | null;
    /**
     * Get cursor for handle position
     */
    private getCursorForHandle;
    /**
     * Resize shape based on handle drag
     * @param keepAspectRatio - When true (shift key), maintains original aspect ratio
     */
    private resizeShape;
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
export {};
