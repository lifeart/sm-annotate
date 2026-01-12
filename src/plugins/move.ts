import type { IShape } from ".";
import { IAudioPeaks } from "./audio-peaks";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { IImage } from "./image";
import type { ShapeMap } from ".";

export interface IMove extends IShapeBase {
  type: "move";
}

// Resize handle positions
type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
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
  // Resize handle tracking
  private activeHandle: HandlePosition | null = null;
  private handleSize = 8;
  private resizeStartBounds: BoundingBox | null = null;

  /**
   * Get the currently selected shape, if any
   */
  getSelectedShape(): IShape | null {
    if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.annotationTool.shapes.length) {
      return null;
    }
    return this.annotationTool.shapes[this.selectedShapeIndex];
  }

  /**
   * Set opacity for the currently selected shape
   */
  setSelectedShapeOpacity(opacity: number): boolean {
    if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.annotationTool.shapes.length) {
      return false;
    }
    // Save current state for undo
    this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
    // Update opacity
    this.annotationTool.shapes[this.selectedShapeIndex].opacity = opacity;
    // Redraw canvas
    this.annotationTool.redrawFullCanvas();
    return true;
  }
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
      return;
    }

    // Duplicate shape with Ctrl+D
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'd' && this.selectedShapeIndex >= 0) {
      event.preventDefault();
      this.duplicateSelectedShape();
      return;
    }

    // Copy annotations to next frame with Ctrl+Shift+Right
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'ArrowRight') {
      event.preventDefault();
      this.copyAnnotationsToNextFrame();
      return;
    }

    // Copy annotations to previous frame with Ctrl+Shift+Left
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'ArrowLeft') {
      event.preventDefault();
      this.copyAnnotationsToPrevFrame();
      return;
    }
  }

  /**
   * Duplicate the currently selected shape with an offset
   */
  private duplicateSelectedShape(): void {
    const shape = this.getSelectedShape();
    if (!shape) return;

    // Deep clone the shape
    const clonedShape = JSON.parse(JSON.stringify(shape)) as IShape;

    // Offset the clone
    const offset = 20;
    const bounds = this.getShapeBounds(clonedShape);
    if (bounds) {
      this.offsetShape(clonedShape, offset, offset);
    }

    // Save for undo
    this.annotationTool.undoStack.push([...this.annotationTool.shapes]);

    // Add the new shape
    const serializedShape = this.annotationTool.serialize([clonedShape])[0];
    this.annotationTool.shapes.push(serializedShape);

    // Select the new shape
    this.selectedShapeIndex = this.annotationTool.shapes.length - 1;

    this.annotationTool.redrawFullCanvas();
  }

  /**
   * Copy current frame's annotations to the next frame
   */
  private copyAnnotationsToNextFrame(): void {
    const currentFrame = this.annotationTool.activeTimeFrame;
    const nextFrame = currentFrame + 1;

    if (nextFrame > this.annotationTool.totalFrames) return;
    if (this.annotationTool.shapes.length === 0) return;

    // Get existing shapes on next frame
    const existingShapes = this.annotationTool.timeStack.get(nextFrame) || [];

    // Clone current shapes
    const clonedShapes = this.annotationTool.shapes.map(s => JSON.parse(JSON.stringify(s)) as IShape);

    // Merge with existing (append)
    const mergedShapes = [...existingShapes, ...clonedShapes];

    // Save to next frame
    this.annotationTool.timeStack.set(nextFrame, mergedShapes);

    // Navigate to next frame to show the result
    this.annotationTool.playbackFrame = nextFrame;
    this.annotationTool.redrawFullCanvas();
  }

  /**
   * Copy current frame's annotations to the previous frame
   */
  private copyAnnotationsToPrevFrame(): void {
    const currentFrame = this.annotationTool.activeTimeFrame;
    const prevFrame = currentFrame - 1;

    if (prevFrame < 1) return;
    if (this.annotationTool.shapes.length === 0) return;

    // Get existing shapes on prev frame
    const existingShapes = this.annotationTool.timeStack.get(prevFrame) || [];

    // Clone current shapes
    const clonedShapes = this.annotationTool.shapes.map(s => JSON.parse(JSON.stringify(s)) as IShape);

    // Merge with existing (append)
    const mergedShapes = [...existingShapes, ...clonedShapes];

    // Save to prev frame
    this.annotationTool.timeStack.set(prevFrame, mergedShapes);

    // Navigate to prev frame to show the result
    this.annotationTool.playbackFrame = prevFrame;
    this.annotationTool.redrawFullCanvas();
  }

  /**
   * Offset a shape by dx, dy
   */
  private offsetShape(shape: IShape, dx: number, dy: number): void {
    const deserialized = this.annotationTool.deserialize([shape])[0];
    const plugin = this.annotationTool.pluginForTool(deserialized.type);
    const moved = plugin.move(deserialized as any, dx, dy);
    // Copy moved properties back to original shape
    Object.assign(shape, this.annotationTool.serialize([moved])[0]);
  }

  /**
   * Get bounding box for any shape
   */
  getShapeBounds(rawShape: IShape): BoundingBox | null {
    const shape = this.annotationTool.deserialize([rawShape])[0];

    switch (shape.type) {
      case 'rectangle':
      case 'image':
      case 'selection': {
        const s = shape as { x: number; y: number; width: number; height: number };
        return {
          x: Math.min(s.x, s.x + s.width),
          y: Math.min(s.y, s.y + s.height),
          width: Math.abs(s.width),
          height: Math.abs(s.height)
        };
      }
      case 'circle': {
        const c = shape as unknown as { cx: number; cy: number; radius: number };
        return {
          x: c.cx - c.radius,
          y: c.cy - c.radius,
          width: c.radius * 2,
          height: c.radius * 2
        };
      }
      case 'line':
      case 'arrow': {
        const l = shape as unknown as { x1: number; y1: number; x2: number; y2: number };
        const minX = Math.min(l.x1, l.x2);
        const minY = Math.min(l.y1, l.y2);
        const maxX = Math.max(l.x1, l.x2);
        const maxY = Math.max(l.y1, l.y2);
        return {
          x: minX,
          y: minY,
          width: maxX - minX || 10,
          height: maxY - minY || 10
        };
      }
      case 'curve': {
        const c = shape as unknown as { points: { x: number; y: number }[] };
        if (!c.points || c.points.length === 0) return null;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of c.points) {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        }
        return {
          x: minX,
          y: minY,
          width: maxX - minX || 10,
          height: maxY - minY || 10
        };
      }
      case 'text': {
        const t = shape as unknown as { x: number; y: number; text: string; fontSize?: number };
        const fontSize = t.fontSize || 16;
        const estimatedWidth = t.text.length * fontSize * 0.6;
        return {
          x: t.x,
          y: t.y - fontSize,
          width: estimatedWidth,
          height: fontSize * 1.2
        };
      }
      default:
        return null;
    }
  }

  /**
   * Draw resize handles for the selected shape
   */
  drawResizeHandles(): void {
    const shape = this.getSelectedShape();
    if (!shape) return;

    const bounds = this.getShapeBounds(shape);
    if (!bounds) return;

    const ctx = this.annotationTool.ctx;
    const hs = this.handleSize;
    const halfHs = hs / 2;

    // Handle positions
    const handles: { pos: HandlePosition; x: number; y: number }[] = [
      { pos: 'nw', x: bounds.x, y: bounds.y },
      { pos: 'n', x: bounds.x + bounds.width / 2, y: bounds.y },
      { pos: 'ne', x: bounds.x + bounds.width, y: bounds.y },
      { pos: 'e', x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
      { pos: 'se', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
      { pos: 's', x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
      { pos: 'sw', x: bounds.x, y: bounds.y + bounds.height },
      { pos: 'w', x: bounds.x, y: bounds.y + bounds.height / 2 },
    ];

    ctx.save();

    // Draw selection border
    ctx.strokeStyle = '#5b9fff';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.setLineDash([]);

    // Draw handles
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#5b9fff';
    ctx.lineWidth = 1;

    for (const handle of handles) {
      ctx.fillRect(handle.x - halfHs, handle.y - halfHs, hs, hs);
      ctx.strokeRect(handle.x - halfHs, handle.y - halfHs, hs, hs);
    }

    ctx.restore();
  }

  /**
   * Check if pointer is on a resize handle
   */
  getHandleAtPosition(x: number, y: number): HandlePosition | null {
    const shape = this.getSelectedShape();
    if (!shape) return null;

    const bounds = this.getShapeBounds(shape);
    if (!bounds) return null;

    const hs = this.handleSize + 4; // Slightly larger hit area
    const halfHs = hs / 2;

    const handles: { pos: HandlePosition; x: number; y: number }[] = [
      { pos: 'nw', x: bounds.x, y: bounds.y },
      { pos: 'n', x: bounds.x + bounds.width / 2, y: bounds.y },
      { pos: 'ne', x: bounds.x + bounds.width, y: bounds.y },
      { pos: 'e', x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
      { pos: 'se', x: bounds.x + bounds.width, y: bounds.y + bounds.height },
      { pos: 's', x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
      { pos: 'sw', x: bounds.x, y: bounds.y + bounds.height },
      { pos: 'w', x: bounds.x, y: bounds.y + bounds.height / 2 },
    ];

    for (const handle of handles) {
      if (x >= handle.x - halfHs && x <= handle.x + halfHs &&
          y >= handle.y - halfHs && y <= handle.y + halfHs) {
        return handle.pos;
      }
    }

    return null;
  }

  /**
   * Get cursor for handle position
   */
  private getCursorForHandle(handle: HandlePosition): string {
    const cursors: Record<HandlePosition, string> = {
      'nw': 'nw-resize',
      'n': 'n-resize',
      'ne': 'ne-resize',
      'e': 'e-resize',
      'se': 'se-resize',
      's': 's-resize',
      'sw': 'sw-resize',
      'w': 'w-resize'
    };
    return cursors[handle];
  }

  /**
   * Resize shape based on handle drag
   */
  private resizeShape(shape: IShape, handle: HandlePosition, dx: number, dy: number, startBounds: BoundingBox): void {
    const deserialized = this.annotationTool.deserialize([shape])[0];

    // Calculate new bounds based on handle
    let newX = startBounds.x;
    let newY = startBounds.y;
    let newWidth = startBounds.width;
    let newHeight = startBounds.height;

    switch (handle) {
      case 'nw':
        newX += dx;
        newY += dy;
        newWidth -= dx;
        newHeight -= dy;
        break;
      case 'n':
        newY += dy;
        newHeight -= dy;
        break;
      case 'ne':
        newY += dy;
        newWidth += dx;
        newHeight -= dy;
        break;
      case 'e':
        newWidth += dx;
        break;
      case 'se':
        newWidth += dx;
        newHeight += dy;
        break;
      case 's':
        newHeight += dy;
        break;
      case 'sw':
        newX += dx;
        newWidth -= dx;
        newHeight += dy;
        break;
      case 'w':
        newX += dx;
        newWidth -= dx;
        break;
    }

    // Ensure minimum size
    if (newWidth < 10) { newWidth = 10; newX = startBounds.x + startBounds.width - 10; }
    if (newHeight < 10) { newHeight = 10; newY = startBounds.y + startBounds.height - 10; }

    // Apply resize based on shape type
    switch (deserialized.type) {
      case 'rectangle':
      case 'selection': {
        (shape as any).x = newX / this.annotationTool.canvasWidth;
        (shape as any).y = newY / this.annotationTool.canvasHeight;
        (shape as any).width = newWidth / this.annotationTool.canvasWidth;
        (shape as any).height = newHeight / this.annotationTool.canvasHeight;
        break;
      }
      case 'circle': {
        const radius = Math.min(newWidth, newHeight) / 2;
        (shape as any).cx = (newX + newWidth / 2) / this.annotationTool.canvasWidth;
        (shape as any).cy = (newY + newHeight / 2) / this.annotationTool.canvasHeight;
        (shape as any).radius = radius / Math.min(this.annotationTool.canvasWidth, this.annotationTool.canvasHeight);
        break;
      }
      case 'line':
      case 'arrow': {
        // Scale line endpoints proportionally
        const scaleX = newWidth / startBounds.width;
        const scaleY = newHeight / startBounds.height;
        const origShape = this.annotationTool.deserialize([this.annotationTool.shapes[this.selectedShapeIndex]])[0] as any;
        const relX1 = (origShape.x1 - startBounds.x) * scaleX + newX;
        const relY1 = (origShape.y1 - startBounds.y) * scaleY + newY;
        const relX2 = (origShape.x2 - startBounds.x) * scaleX + newX;
        const relY2 = (origShape.y2 - startBounds.y) * scaleY + newY;
        (shape as any).x1 = relX1 / this.annotationTool.canvasWidth;
        (shape as any).y1 = relY1 / this.annotationTool.canvasHeight;
        (shape as any).x2 = relX2 / this.annotationTool.canvasWidth;
        (shape as any).y2 = relY2 / this.annotationTool.canvasHeight;
        break;
      }
      case 'image': {
        (shape as any).x = newX / this.annotationTool.canvasWidth;
        (shape as any).y = newY / this.annotationTool.canvasHeight;
        (shape as any).width = newWidth / this.annotationTool.canvasWidth;
        (shape as any).height = newHeight / this.annotationTool.canvasHeight;
        break;
      }
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

    // Check if clicking on a resize handle first
    const handle = this.getHandleAtPosition(x, y);
    if (handle && this.selectedShapeIndex >= 0) {
      this.activeHandle = handle;
      this.startX = x;
      this.startY = y;
      this.isDrawing = true;
      const selectedShape = this.getSelectedShape();
      if (selectedShape) {
        this.resizeStartBounds = this.getShapeBounds(selectedShape);
        // Save for undo
        this.annotationTool.undoStack.push([...this.annotationTool.shapes]);
      }
      this.annotationTool.canvas.style.cursor = this.getCursorForHandle(handle);
      return;
    }

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
      this.annotationTool.redrawFullCanvas();
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
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    // Handle resize dragging
    if (this.isDrawing && this.activeHandle && this.resizeStartBounds) {
      const dx = x - this.startX;
      const dy = y - this.startY;

      const shape = this.annotationTool.shapes[this.selectedShapeIndex];
      if (shape) {
        this.resizeShape(shape, this.activeHandle, dx, dy, this.resizeStartBounds);
        this.annotationTool.redrawFullCanvas();
      }
      return;
    }

    // Update cursor when hovering over handles
    if (!this.isDrawing && this.selectedShapeIndex >= 0) {
      const handle = this.getHandleAtPosition(x, y);
      if (handle) {
        this.annotationTool.canvas.style.cursor = this.getCursorForHandle(handle);
        return;
      }
    }

    if (!this.isDrawing || !this.shape) {
      if (!this.isDrawing) {
        this.annotationTool.canvas.style.cursor = 'default';
      }
      return;
    }

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
    // Handle resize completion
    if (this.activeHandle) {
      this.activeHandle = null;
      this.resizeStartBounds = null;
      this.isDrawing = false;
      this.annotationTool.canvas.style.cursor = 'default';
      this.annotationTool.redrawFullCanvas();
      return;
    }

    if (!this.isDrawing || !this.lastDrawnShape) {
      this.isDrawing = false;
      this.annotationTool.redrawFullCanvas();
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
    this.annotationTool.redrawFullCanvas();
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
    this.activeHandle = null;
    this.resizeStartBounds = null;
    this.annotationTool.canvas.style.cursor = 'default';
  }
  save(shape: IShape) {
    this.annotationTool.replaceShape(shape, this.shapeIndex);
  }
}
