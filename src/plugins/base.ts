import type { ShapeMap } from ".";
import type { AnnotationTool  } from "./../core";

export interface IShapeBase {
  type: keyof ShapeMap;
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
  move: (shape: T, deltaX: number, deltaY: number) => T;
  normalize: (shape: T, canvasWidth: number, canvasHeight: number) => T;
}

export class BasePlugin<T extends IShapeBase> {
  annotationTool!: AnnotationTool;
  startX = 0;
  startY = 0;
  isDrawing = false;
  constructor(annotationTool: AnnotationTool) {
    this.annotationTool = annotationTool;
  }
  on(event: string, arg: unknown) {
    // noop
  }
  get ctx() {
    return this.annotationTool.ctx;
  }
  onDeactivate() {}
  onActivate() {
    // noop
  }
  reset() {
    this.startX = 0;
    this.startY = 0;
    this.isDrawing = false;
  }
  save(shape: T) {
    // @todo - fix types here
    this.annotationTool.addShape(shape as any);
  }
}
