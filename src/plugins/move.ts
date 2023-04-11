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
  move(shape: IMove) {
    return shape;
  }
  normalize(shape: IMove): IMove {
    return {
      ...shape,
    };
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    const lastShape = this.annotationTool.shapes.slice(0).pop();
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



    const lastShape = this.annotationTool.deserialize([this.shape])[0];

    const shapeCopy = lastShape.type === 'image' ? lastShape : JSON.parse(JSON.stringify(lastShape)) as typeof lastShape;

    const item = this.annotationTool.pluginForTool(shapeCopy.type).move(shapeCopy, dx, dy);

    this.lastDrawnShape = item;

    this.annotationTool.pluginForTool(shapeCopy.type).draw(item);
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
