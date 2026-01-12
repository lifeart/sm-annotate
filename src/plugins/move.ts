import type { IShape, ShapeMap } from ".";
import { IAudioPeaks } from "./audio-peaks";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { IImage } from "./image";
import type { IRectangle } from "./rectangle";
import type { ICircle } from "./circle";
import type { ILine } from "./line";
import type { IArrow } from "./arrow";
import type { ICurve } from "./curve";
import type { IText } from "./text";
import type { ISelection } from "./selection";

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
  private resizeOriginalShape: IShape | null = null;

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
      case 'rectangle': {
        const s = shape as IRectangle;
        return {
          x: Math.min(s.x, s.x + s.width),
          y: Math.min(s.y, s.y + s.height),
          width: Math.abs(s.width),
          height: Math.abs(s.height)
        };
      }
      case 'image': {
        const s = shape as IImage;
        return {
          x: Math.min(s.x, s.x + s.width),
          y: Math.min(s.y, s.y + s.height),
          width: Math.abs(s.width),
          height: Math.abs(s.height)
        };
      }
      case 'selection': {
        const s = shape as ISelection;
        return {
          x: Math.min(s.x, s.x + s.width),
          y: Math.min(s.y, s.y + s.height),
          width: Math.abs(s.width),
          height: Math.abs(s.height)
        };
      }
      case 'circle': {
        const c = shape as ICircle;
        return {
          x: c.x - c.radius,
          y: c.y - c.radius,
          width: c.radius * 2,
          height: c.radius * 2
        };
      }
      case 'line': {
        const l = shape as ILine;
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
      case 'arrow': {
        const a = shape as IArrow;
        const minX = Math.min(a.x1, a.x2);
        const minY = Math.min(a.y1, a.y2);
        const maxX = Math.max(a.x1, a.x2);
        const maxY = Math.max(a.y1, a.y2);
        return {
          x: minX,
          y: minY,
          width: maxX - minX || 10,
          height: maxY - minY || 10
        };
      }
      case 'curve': {
        const c = shape as ICurve;
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
        const t = shape as IText;
        const lineWidth = rawShape.lineWidth ?? 1;
        const fontSize = 16 + lineWidth * 0.5;
        const estimatedWidth = t.text.length * fontSize * 0.6;
        return {
          x: t.x,
          y: t.y - fontSize,
          width: estimatedWidth || 50,
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
   * @param keepAspectRatio - When true (shift key), maintains original aspect ratio
   */
  private resizeShape(shape: IShape, handle: HandlePosition, dx: number, dy: number, startBounds: BoundingBox, keepAspectRatio = false): void {
    if (!this.resizeOriginalShape) return;

    const deserialized = this.annotationTool.deserialize([this.resizeOriginalShape])[0];

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

    // Keep aspect ratio if shift is pressed
    if (keepAspectRatio && startBounds.width > 0 && startBounds.height > 0) {
      const aspectRatio = startBounds.width / startBounds.height;

      // Determine which dimension to constrain based on handle
      if (handle === 'n' || handle === 's') {
        // Vertical handles: adjust width to match height
        const constrainedWidth = newHeight * aspectRatio;
        const widthDiff = constrainedWidth - newWidth;
        newWidth = constrainedWidth;
        // Center horizontally
        newX -= widthDiff / 2;
      } else if (handle === 'e' || handle === 'w') {
        // Horizontal handles: adjust height to match width
        const constrainedHeight = newWidth / aspectRatio;
        const heightDiff = constrainedHeight - newHeight;
        newHeight = constrainedHeight;
        // Center vertically
        newY -= heightDiff / 2;
      } else {
        // Corner handles: use the larger scale factor
        const scaleFromWidth = newWidth / startBounds.width;
        const scaleFromHeight = newHeight / startBounds.height;
        const uniformScale = Math.max(Math.abs(scaleFromWidth), Math.abs(scaleFromHeight));
        const signX = scaleFromWidth >= 0 ? 1 : -1;
        const signY = scaleFromHeight >= 0 ? 1 : -1;

        const constrainedWidth = startBounds.width * uniformScale * signX;
        const constrainedHeight = startBounds.height * uniformScale * signY;

        // Adjust position based on handle corner
        if (handle === 'nw') {
          newX = startBounds.x + startBounds.width - constrainedWidth;
          newY = startBounds.y + startBounds.height - constrainedHeight;
        } else if (handle === 'ne') {
          newY = startBounds.y + startBounds.height - constrainedHeight;
        } else if (handle === 'sw') {
          newX = startBounds.x + startBounds.width - constrainedWidth;
        }
        // 'se' keeps origin at top-left, no adjustment needed

        newWidth = constrainedWidth;
        newHeight = constrainedHeight;
      }
    }

    // Ensure minimum size
    const minSize = 10;
    if (newWidth < minSize) {
      if (handle.includes('w')) {
        newX = startBounds.x + startBounds.width - minSize;
      }
      newWidth = minSize;
    }
    if (newHeight < minSize) {
      if (handle.includes('n')) {
        newY = startBounds.y + startBounds.height - minSize;
      }
      newHeight = minSize;
    }

    // Calculate scale factors
    const scaleX = startBounds.width > 0 ? newWidth / startBounds.width : 1;
    const scaleY = startBounds.height > 0 ? newHeight / startBounds.height : 1;

    // Apply resize based on shape type
    switch (deserialized.type) {
      case 'rectangle': {
        const rectShape = shape as IRectangle;
        rectShape.x = newX / this.annotationTool.canvasWidth;
        rectShape.y = newY / this.annotationTool.canvasHeight;
        rectShape.width = newWidth / this.annotationTool.canvasWidth;
        rectShape.height = newHeight / this.annotationTool.canvasHeight;
        break;
      }
      case 'selection': {
        const selShape = shape as ISelection;
        selShape.x = newX / this.annotationTool.canvasWidth;
        selShape.y = newY / this.annotationTool.canvasHeight;
        selShape.width = newWidth / this.annotationTool.canvasWidth;
        selShape.height = newHeight / this.annotationTool.canvasHeight;
        break;
      }
      case 'circle': {
        const circleShape = shape as ICircle;
        const radius = Math.min(newWidth, newHeight) / 2;
        const centerX = newX + newWidth / 2;
        const centerY = newY + newHeight / 2;
        circleShape.x = centerX / this.annotationTool.canvasWidth;
        circleShape.y = centerY / this.annotationTool.canvasHeight;
        circleShape.radius = radius / this.annotationTool.canvasWidth;
        break;
      }
      case 'line': {
        const lineShape = shape as ILine;
        const origLine = deserialized as ILine;
        const relX1 = (origLine.x1 - startBounds.x) * scaleX + newX;
        const relY1 = (origLine.y1 - startBounds.y) * scaleY + newY;
        const relX2 = (origLine.x2 - startBounds.x) * scaleX + newX;
        const relY2 = (origLine.y2 - startBounds.y) * scaleY + newY;
        lineShape.x1 = relX1 / this.annotationTool.canvasWidth;
        lineShape.y1 = relY1 / this.annotationTool.canvasHeight;
        lineShape.x2 = relX2 / this.annotationTool.canvasWidth;
        lineShape.y2 = relY2 / this.annotationTool.canvasHeight;
        break;
      }
      case 'arrow': {
        const arrowShape = shape as IArrow;
        const origArrow = deserialized as IArrow;
        const relX1 = (origArrow.x1 - startBounds.x) * scaleX + newX;
        const relY1 = (origArrow.y1 - startBounds.y) * scaleY + newY;
        const relX2 = (origArrow.x2 - startBounds.x) * scaleX + newX;
        const relY2 = (origArrow.y2 - startBounds.y) * scaleY + newY;
        arrowShape.x1 = relX1 / this.annotationTool.canvasWidth;
        arrowShape.y1 = relY1 / this.annotationTool.canvasHeight;
        arrowShape.x2 = relX2 / this.annotationTool.canvasWidth;
        arrowShape.y2 = relY2 / this.annotationTool.canvasHeight;
        break;
      }
      case 'curve': {
        const curveShape = shape as ICurve;
        const origCurve = deserialized as ICurve;
        curveShape.points = origCurve.points.map(p => ({
          x: ((p.x - startBounds.x) * scaleX + newX) / this.annotationTool.canvasWidth,
          y: ((p.y - startBounds.y) * scaleY + newY) / this.annotationTool.canvasHeight
        }));
        break;
      }
      case 'text': {
        const textShape = shape as IText;
        const origText = deserialized as IText;
        const origLineWidth = this.resizeOriginalShape.lineWidth ?? 1;
        const origFontSize = 16 + origLineWidth * 0.5;
        // Position text at new bounds, scaling the offset
        const relX = (origText.x - startBounds.x) * scaleX + newX;
        const relY = (origText.y - startBounds.y) * scaleY + newY;
        textShape.x = relX / this.annotationTool.canvasWidth;
        textShape.y = relY / this.annotationTool.canvasHeight;
        // Scale lineWidth to affect font size
        const avgScale = (scaleX + scaleY) / 2;
        const newFontSize = origFontSize * avgScale;
        // lineWidth controls font size: fontSize = 16 + lineWidth * 0.5
        // So: lineWidth = (fontSize - 16) / 0.5 = (fontSize - 16) * 2
        textShape.lineWidth = Math.max(1, (newFontSize - 16) * 2);
        break;
      }
      case 'image': {
        const imgShape = shape as IImage;
        imgShape.x = newX / this.annotationTool.canvasWidth;
        imgShape.y = newY / this.annotationTool.canvasHeight;
        imgShape.width = newWidth / this.annotationTool.canvasWidth;
        imgShape.height = newHeight / this.annotationTool.canvasHeight;
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
        // Store deep copy of original shape for resize calculations
        this.resizeOriginalShape = JSON.parse(JSON.stringify(selectedShape));
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
        this.resizeShape(shape, this.activeHandle, dx, dy, this.resizeStartBounds, event.shiftKey);
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
      this.resizeOriginalShape = null;
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
    this.resizeOriginalShape = null;
    this.annotationTool.canvas.style.cursor = 'default';
  }
  save(shape: IShape) {
    this.annotationTool.replaceShape(shape, this.shapeIndex);
  }
}
