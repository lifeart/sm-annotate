import type { IShape } from ".";
import { IAudioPeaks } from "./audio-peaks";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { IImage } from "./image";
import type { ShapeMap } from ".";

export interface IMove extends IShapeBase {
  type: "move";
}

export class MoveToolPlugin
  extends BasePlugin<IMove>
  implements ToolPlugin<IMove>
{
  name = "move" as keyof ShapeMap;
  shape: IShape | null = null;
  shapeIndex: number = -1;
  lastDrawnShape: IShape | null = null;
  isScale = false;
  // Track selected shape for deletion with Backspace
  selectedShapeIndex: number = -1;
  private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;
  move(shape: IMove) {
    return shape;
  }
  normalize(shape: IMove): IMove {
    return {
      ...shape,
    };
  }

  onActivate(): void {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }

  onDeactivate(): void {
    if (this.boundHandleKeyDown) {
      document.removeEventListener('keydown', this.boundHandleKeyDown);
      this.boundHandleKeyDown = null;
    }
    this.selectedShapeIndex = -1;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Delete selected shape with Backspace or Delete key
    if ((event.key === 'Backspace' || event.key === 'Delete') && this.selectedShapeIndex >= 0) {
      event.preventDefault();
      this.deleteSelectedShape();
    }
  }

  private deleteSelectedShape(): void {
    if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.annotationTool.shapes.length) {
      return;
    }
    // Save current state for undo
    this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
    // Remove the selected shape
    this.annotationTool.shapes.splice(this.selectedShapeIndex, 1);
    // Reset selection
    this.selectedShapeIndex = -1;
    this.shapeIndex = -1;
    // Redraw canvas
    this.annotationTool.redrawFullCanvas();
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    const originalShapes = this.annotationTool.shapes;
    const shapes = originalShapes.slice().reverse();
    let foundShape = false;
    for (const shape of shapes) {
      if (this.isPointerAtShape(shape, x, y)) {
        this.shape = {...shape};
        shape.fillStyle = 'rgba(0, 0, 0, 0)';
        shape.strokeStyle = 'rgba(0, 0, 0, 0)';
        this.shapeIndex = originalShapes.indexOf(shape);
        this.selectedShapeIndex = this.shapeIndex;
        foundShape = true;
        break;
      }
    }
    if (!foundShape) {
      // Clicked on empty area - deselect
      this.selectedShapeIndex = -1;
    }
    if (!this.shape) {
      return;
    }
    this.lastDrawnShape = null;
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
    this.isScale =
      this.shape.type === "image"
        ? this.isPointerAtCorner(this.shape, x, y)
        : false;

    if (this.isScale) {
      this.annotationTool.canvas.style.cursor = 'nw-resize';
    } else {
      this.annotationTool.canvas.style.cursor = 'move';
    }
  }

  isPointerAtShape(shape: IShape, x: number, y: number): boolean {
    const deserializedShape = this.annotationTool.deserialize([shape])[0];
    const plugin = this.annotationTool.pluginForTool(deserializedShape.type);
    return plugin.isPointerAtShape(deserializedShape, x, y);
  }

  isPointerAtCorner(rawShape: IImage | IAudioPeaks, x: number, y: number) {
    if (!('type' in rawShape)) {
      return false;
    }
    const shapeToResolve = this.annotationTool.deserialize([
      rawShape,
    ])[0] as IImage;
    const tolerance = 15;

    const isPointer5pxCloseToImageTop =
      Math.abs(shapeToResolve.y - y) < tolerance;
    const isPointer5pxCloseToImageLeft =
      Math.abs(shapeToResolve.x - x) < tolerance;
    const isPointer5pxCloseToImageRight =
      Math.abs(shapeToResolve.x + shapeToResolve.width - x) < tolerance;
    const isPointer5pxCloseToImageBottom =
      Math.abs(shapeToResolve.y + shapeToResolve.height - y) < tolerance;

    const isTopLeftCorner =
      isPointer5pxCloseToImageTop && isPointer5pxCloseToImageLeft;
    const isTopRightCorner =
      isPointer5pxCloseToImageTop && isPointer5pxCloseToImageRight;
    const isBottomLeftCorner =
      isPointer5pxCloseToImageBottom && isPointer5pxCloseToImageLeft;
    const isBottomRightCorner =
      isPointer5pxCloseToImageBottom && isPointer5pxCloseToImageRight;
    const isInCorner =
      isTopLeftCorner ||
      isTopRightCorner ||
      isBottomLeftCorner ||
      isBottomRightCorner;

    return isInCorner;
  }
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing || !this.shape) {
      return;
    }

    const { x, y } = this.annotationTool.getRelativeCoords(event);
    const dx = x - this.startX;
    const dy = y - this.startY;

    this.startX = x - dx;
    this.startY = y - dy;

    const lastShape = this.annotationTool.deserialize([this.shape])[0];

    const shapeCopy =
      lastShape.type === "image"
        ? lastShape
        : (JSON.parse(JSON.stringify(lastShape)) as typeof lastShape);

    if (shapeCopy.type === 'audio-peaks') {
      return;
    }
    if (shapeCopy.type === "image") {
      // if it's an image angle, we need to resize it, keeping the same proportions

      if (this.isScale) {
        const { width, height } = shapeCopy as IImage;
        const ratio = width / height;
        const newWidth = width + dx;
        const newHeight = newWidth / ratio;
        (shapeCopy as IImage).width = newWidth;
        (shapeCopy as IImage).height = newHeight;

        this.lastDrawnShape = shapeCopy;

        this.annotationTool.pluginForTool((shapeCopy as IImage).type).draw(shapeCopy as IImage);
      } else {
        const item = this.annotationTool
          .pluginForTool(shapeCopy.type)
          // @ts-expect-error copy
          .move(shapeCopy, dx, dy);

        this.lastDrawnShape = item;

        this.annotationTool.pluginForTool(shapeCopy.type).draw(item);
      }
    } else {
      const item = this.annotationTool
        .pluginForTool(shapeCopy.type)
        // @ts-expect-error copy
        .move(shapeCopy, dx, dy);

      this.lastDrawnShape = item;

      this.annotationTool.pluginForTool(shapeCopy.type).draw(item);
    }
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing || !this.lastDrawnShape) {
      return;
    }
    if (this.lastDrawnShape) {
      // enforce the current tool's fill and stroke style
      this.lastDrawnShape.fillStyle = this.annotationTool.ctx.fillStyle;
      this.lastDrawnShape.strokeStyle = this.annotationTool.ctx.strokeStyle;
      this.lastDrawnShape.lineWidth = this.annotationTool.ctx.lineWidth;
      this.save(this.lastDrawnShape as IMove);
    }
    this.isDrawing = false;
    this.isScale = false;
    this.shape = null;
    this.lastDrawnShape = null;
    this.annotationTool.canvas.style.cursor = 'default';
  }
  draw() {
    throw new Error("Method not implemented.");
  }
  reset() {
    this.isDrawing = false;
    this.shape = null;
    this.isScale = false;
    this.lastDrawnShape = null;
    this.shapeIndex = -1;
    this.selectedShapeIndex = -1;
    this.annotationTool.canvas.style.cursor = 'default';
  }
  save(shape: IShape) {
    this.annotationTool.replaceShape(shape, this.shapeIndex);
  }
}
