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

interface AnnotationTool<T> {
  ctx: CanvasRenderingContext2D;
  addShape(shape: T): void;
  canvas: HTMLCanvasElement;
  getRelativeCoords(event: PointerEvent): { x: number; y: number };
}

export class BasePlugin<T extends IShapeBase> {
  annotationTool!: AnnotationTool<T>;
  startX = 0;
  startY = 0;
  isDrawing = false;
  constructor(annotationTool: AnnotationTool<T>) {
    this.annotationTool = annotationTool;
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
    this.annotationTool.addShape(shape);
  }
}
