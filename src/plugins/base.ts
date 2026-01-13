import type { ShapeMap } from ".";
import type { AnnotationTool  } from "./../core";

export interface IShapeBase {
  type: keyof ShapeMap;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  fillStyle: string | CanvasPattern | CanvasGradient;
  lineWidth: number;
  opacity?: number;
  rotation?: number;           // Rotation angle in radians
  rotationCenterX?: number;    // Normalized 0-1, custom rotation center X
  rotationCenterY?: number;    // Normalized 0-1, custom rotation center Y
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

export class BasePlugin<T extends IShapeBase> {
  annotationTool!: AnnotationTool;
  startX = 0;
  startY = 0;
  isDrawing = false;
  constructor(annotationTool: AnnotationTool) {
    this.annotationTool = annotationTool;
  }
  isPointerAtShape(_shape: T, _x: number, _y: number) {
    return false;
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

  /**
   * Apply rotation transform before drawing a shape.
   * Must be paired with restoreRotation() after drawing.
   * @param shape The shape being drawn
   * @param centerX The rotation center X in canvas coordinates
   * @param centerY The rotation center Y in canvas coordinates
   * @returns true if rotation was applied (and restore is needed)
   */
  protected applyRotation(shape: T, centerX: number, centerY: number): boolean {
    if (!shape.rotation) {
      return false;
    }
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(shape.rotation);
    this.ctx.translate(-centerX, -centerY);
    return true;
  }

  /**
   * Restore canvas state after rotation. Only call if applyRotation returned true.
   */
  protected restoreRotation(): void {
    this.ctx.restore();
  }

  /**
   * Get the rotation center for a shape in canvas coordinates.
   * Uses custom center if set, otherwise uses provided default center.
   * @param shape The shape
   * @param defaultCenterX Default center X in canvas coordinates
   * @param defaultCenterY Default center Y in canvas coordinates
   */
  protected getRotationCenter(shape: T, defaultCenterX: number, defaultCenterY: number): { x: number; y: number } {
    if (shape.rotationCenterX !== undefined && shape.rotationCenterY !== undefined) {
      return {
        x: shape.rotationCenterX * this.annotationTool.canvasWidth,
        y: shape.rotationCenterY * this.annotationTool.canvasHeight,
      };
    }
    return { x: defaultCenterX, y: defaultCenterY };
  }
}
