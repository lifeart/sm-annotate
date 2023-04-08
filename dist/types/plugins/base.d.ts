import type { AnnotationTool } from "./../core";
export interface IShapeBase {
    type: string;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    fillStyle: string | CanvasPattern | CanvasGradient;
    lineWidth: number;
}
export interface ToolPlugin<T extends IShapeBase> {
    name: IShapeBase["type"];
    isDrawing: boolean;
    onPointerDown: (event: PointerEvent) => void;
    onPointerUp: (event: PointerEvent) => void;
    onPointerMove: (event: PointerEvent) => void;
    onActivate: () => void;
    onDeactivate: () => void;
    reset: () => void;
    draw: (shape: T) => void;
    save: (shape: T) => void;
    normalize: (shape: T, canvasWidth: number, canvasHeight: number) => T;
}
export declare class BasePlugin<T extends IShapeBase> {
    annotationTool: AnnotationTool;
    startX: number;
    startY: number;
    isDrawing: boolean;
    constructor(annotationTool: AnnotationTool);
    get ctx(): CanvasRenderingContext2D;
    onDeactivate(): void;
    onActivate(): void;
    reset(): void;
    save(shape: T): void;
}
