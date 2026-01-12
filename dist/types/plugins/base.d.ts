import type { ShapeMap } from ".";
import type { AnnotationTool } from "./../core";
export interface IShapeBase {
    type: keyof ShapeMap;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    fillStyle: string | CanvasPattern | CanvasGradient;
    lineWidth: number;
    opacity?: number;
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
}
