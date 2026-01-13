import type { ShapeMap } from ".";
import type { AnnotationTool } from "./../core";
export interface IShapeBase {
    type: keyof ShapeMap;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    fillStyle: string | CanvasPattern | CanvasGradient;
    lineWidth: number;
    opacity?: number;
    rotation?: number;
    rotationCenterX?: number;
    rotationCenterY?: number;
}
export interface ToolPlugin<T extends IShapeBase> {
    name: IShapeBase["type"];
    isDrawing: boolean;
    onPointerDown: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    isPointerAtShape: (shape: T, x: number, y: number) => boolean;
    onActivate: () => void;
    onDeactivate: () => void;
    reset: () => void;
    draw: (shape: T) => void;
    save: (shape: T) => void;
    move: (shape: T, deltaX: number, deltaY: number) => T;
    normalize: (shape: T, canvasWidth: number, canvasHeight: number) => T;
}
export declare class BasePlugin<T extends IShapeBase> {
    annotationTool: AnnotationTool;
    startX: number;
    startY: number;
    isDrawing: boolean;
    constructor(annotationTool: AnnotationTool);
    isPointerAtShape(_shape: T, _x: number, _y: number): boolean;
    on(event: string, arg: unknown): void;
    get ctx(): CanvasRenderingContext2D;
    onDeactivate(): void;
    onActivate(): void;
    reset(): void;
    save(shape: T): void;
    /**
     * Apply rotation transform before drawing a shape.
     * Must be paired with restoreRotation() after drawing.
     * @param shape The shape being drawn
     * @param centerX The rotation center X in canvas coordinates
     * @param centerY The rotation center Y in canvas coordinates
     * @returns true if rotation was applied (and restore is needed)
     */
    protected applyRotation(shape: T, centerX: number, centerY: number): boolean;
    /**
     * Restore canvas state after rotation. Only call if applyRotation returned true.
     */
    protected restoreRotation(): void;
    /**
     * Get the rotation center for a shape in canvas coordinates.
     * Uses custom center if set, otherwise uses provided default center.
     * @param shape The shape
     * @param defaultCenterX Default center X in canvas coordinates
     * @param defaultCenterY Default center Y in canvas coordinates
     */
    protected getRotationCenter(shape: T, defaultCenterX: number, defaultCenterY: number): {
        x: number;
        y: number;
    };
}
