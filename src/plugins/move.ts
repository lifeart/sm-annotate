import type { IShape } from ".";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";

export interface IMove extends IShapeBase {
  type: "move";
}

export class MoveToolPlugin
  extends BasePlugin<IMove>
  implements ToolPlugin<IMove>
{
  name = "move";
  shape: IShape | null = null;
  lastDrawnShape: IShape | null = null;
  shapeRemoved = false;
  normalize(shape: IMove): IMove {
    return {
      ...shape,
    };
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    const lastShape = this.annotationTool.saveCurrentFrame().shapes.pop();
    if (!lastShape) {
      return;
    }
    this.shape = lastShape;
    this.shapeRemoved = false;
    this.lastDrawnShape = null;
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
  }
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing || !this.shape) {
      return;
    }

    if (!this.shapeRemoved) {
      this.annotationTool.removeLastShape();
      this.shapeRemoved = true;
    }

    const { x, y } = this.annotationTool.getRelativeCoords(event);
    const dx = x - this.startX;
    const dy = y - this.startY;

    this.startX = x - dx;
    this.startY = y - dy;

    const knownTypes = ["line", "circle", "rectangle", "text", "arrow", "curve", "eraser"];

    const lastShape = this.annotationTool.deserialize([this.shape])[0];

    const shapeCopy = JSON.parse(JSON.stringify(lastShape)) as typeof lastShape;

    if (shapeCopy.type === "line") {
      shapeCopy.x1 += dx;
      shapeCopy.y1 += dy;
      shapeCopy.x2 += dx;
      shapeCopy.y2 += dy;
    } else if (shapeCopy.type === "circle") {
      shapeCopy.x += dx;
      shapeCopy.y += dy;
    } else if (shapeCopy.type === "rectangle") {
      shapeCopy.x += dx;
      shapeCopy.y += dy;
    } else if (shapeCopy.type === "text") {
      shapeCopy.x += dx;
      shapeCopy.y += dy;
    } else if (shapeCopy.type === "arrow") {
        shapeCopy.x1 += dx;
        shapeCopy.y1 += dy;
        shapeCopy.x2 += dx;
        shapeCopy.y2 += dy;
    } else if (shapeCopy.type === "curve") {
        shapeCopy.points.forEach((point) => {
            point.x += dx;
            point.y += dy;
        });
    } else if (shapeCopy.type === "eraser") {
        shapeCopy.x += dx;
        shapeCopy.y += dy;
    }

    this.lastDrawnShape = shapeCopy;

    if (!knownTypes.includes(shapeCopy.type)) {
      return;
    }

    this.annotationTool.pluginForTool(shapeCopy.type).draw(shapeCopy);
  }
  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing || !this.lastDrawnShape) {
      return;
    }
    if (this.lastDrawnShape) {
      this.save(this.lastDrawnShape as IMove);
    }
    this.isDrawing = false;
    this.shape = null;
    this.shapeRemoved = false;
    this.lastDrawnShape = null;
  }
  draw() {
    throw new Error("Method not implemented.");
  }
  reset() {
    this.isDrawing = false;
    this.shape = null;
    this.lastDrawnShape = null;
    this.shapeRemoved = false;
  }
}
