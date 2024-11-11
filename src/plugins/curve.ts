import { Point, douglasPeucker } from "./utils/douglas-peucker";
import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export type IPoint = {
  x: number;
  y: number;
};

export interface ICurve extends IShapeBase {
  type: "curve";
  points: IPoint[];
}

export class CurveToolPlugin
  extends BasePlugin<ICurve>
  implements ToolPlugin<ICurve>
{
  name = "curve" as keyof ShapeMap;
  curvePoints: IPoint[] = [];
  zoomScale = 2; // Controls the magnification level
  zoomRadius = 100; // Radius of the zoom circle
  zoomCtx: CanvasRenderingContext2D | null = null; // Context for the zoom canvas
  zoomCanvas: HTMLCanvasElement | null = null; // Zoom canvas element
  move(shape: ICurve, dx: number, dy: number) {
    shape.points = shape.points.map((point) => ({
      x: point.x + dx,
      y: point.y + dy,
    }));
    return shape;
  }
  colorMap = {
    r: "#d31a3b",
    g: "#15d33b",
    b: "#0085CA",
    y: "#F3CE32",
  };
  onKeyPress = (e: KeyboardEvent) => {
    const key = e.key;
    if (key === null || key === " " || e.isComposing) {
      return;
    }
    const maybeNumeric = Number(key);
    if (isNaN(maybeNumeric) || !maybeNumeric) {
      if (key in this.colorMap) {
        // @ts-expect-error
        this.annotationTool.colorPicker.value = this.colorMap[key];
        this.annotationTool.setCanvasSettings();
      }
      return;
    }
    this.annotationTool.strokeSizePicker.value = key;
    this.annotationTool.setCanvasSettings();
  };
  onActivate() {
    this.initZoomCanvas();
    document.addEventListener("keypress", this.onKeyPress);
  }
  onDeactivate(): void {
    this.zoomCtx = null;
    this.zoomCanvas = null;
    document.removeEventListener("keypress", this.onKeyPress);
  }

  normalize(shape: ICurve, canvasWidth: number, canvasHeight: number): ICurve {
    return {
      ...shape,
      points: shape.points.map((point) => ({
        x: point.x / canvasWidth,
        y: point.y / canvasHeight,
      })),
    };
  }
  draw(shape: ICurve) {
    this.drawCurve(shape);
  }
  reset(): void {
    super.reset();
    this.curvePoints = [];
  }
  onPointerDown(event: PointerEvent) {
    if (this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.curvePoints = [];
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
    this.curvePoints.push({ x, y });
  }
  onPointerMove(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    if (!this.isDrawing) {
      this.drawZoomCircle(x, y, event.shiftKey); // Call the zoom functionality
      return;
    }

    this.curvePoints.push({ x, y });
    this.drawCurve({
      points: this.curvePoints,
      lineWidth: this.ctx.lineWidth,
    });
    this.drawZoomCircle(x, y, event.shiftKey); // Call the zoom functionality
  }

  onPointerUp(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    this.drawZoomCircle(x, y, event.shiftKey);
    if (!this.isDrawing) {
      return;
    }

    this.curvePoints.push({ x, y });

    const curvePointsAsPoints = this.curvePoints.map(
      (pt) => new Point(pt.x, pt.y)
    );

    const epsilon = 0.5; // Adjust the epsilon value to control the level of simplification
    const optimizedPoints = douglasPeucker(curvePointsAsPoints, epsilon);
    const optimizedCurvePoints = optimizedPoints.map((pt) => ({
      x: pt.x,
      y: pt.y,
    }));

    const shape: ICurve = {
      type: "curve",
      points: optimizedCurvePoints,
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    };
    this.save(shape);
    this.curvePoints = [];
    this.isDrawing = false;
  }

  drawCurve(shape: Pick<ICurve, "points" | "lineWidth">) {
    if (
      shape.points.length === 2 &&
      shape.points[0].x === shape.points[1].x &&
      shape.points[0].y === shape.points[1].y
    ) {
      const radius = shape.lineWidth / 4;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;
      this.ctx.beginPath();
      this.ctx.arc(
        shape.points[0].x,
        shape.points[0].y,
        radius,
        startAngle,
        endAngle
      );
      this.ctx.stroke();
    } else {
      this.ctx.beginPath();
      this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

      for (let i = 0; i < shape.points.length - 1; i++) {
        const controlPoint = shape.points[i];
        const endPoint = shape.points[i + 1];
        this.ctx.quadraticCurveTo(
          controlPoint.x,
          controlPoint.y,
          endPoint.x,
          endPoint.y
        );
      }
      this.ctx.stroke();
    }
  }

  initZoomCanvas() {
    const zoomCanvas = document.createElement("canvas");
    const zoomResolutionMultiplier = 2; // Factor to increase resolution for sharpness

    zoomCanvas.width = this.zoomRadius * 2 * zoomResolutionMultiplier; // diameter
    zoomCanvas.height = this.zoomRadius * 2 * zoomResolutionMultiplier; // diameter
    const zoomCtx = zoomCanvas.getContext("2d");
    if (!zoomCtx) return;
    zoomCtx.imageSmoothingQuality = "high"; // Improve sharpness
    zoomCtx.imageSmoothingEnabled = true; // Improve sharpness
    this.zoomCtx = zoomCtx;
    this.zoomCanvas = zoomCanvas;
    // zoomCtx.scale(this.zoomScale, this.zoomScale); // Increase resolution for sharpness

    // zoomCtx.scale(this.zoomScale, this.zoomScale);
  }

  // Function to draw the zoomed circle centered on the current event coordinates without any visible offset
  drawZoomCircle(x: number, y: number, isEnabled = false) {
    if (!isEnabled) {
      return;
    }
    if (!this.isDrawing) {
      this.annotationTool.clearCanvas();
      this.annotationTool.addVideoOverlay();
      this.annotationTool.drawShapesOverlay();
    }

    const zoomCtx = this.zoomCtx;
    if (!zoomCtx) return;

    const pixelRatio = this.annotationTool.pixelRatio;

    // Calculate the source area to capture
    const sourceSize = (this.zoomRadius * 2) / this.zoomScale;
    const sourceX = x - sourceSize / 2;
    const sourceY = y - sourceSize / 2;

    // Clear the zoom canvas first
    zoomCtx.clearRect(0, 0, this.zoomCanvas!.width, this.zoomCanvas!.height);

    // Draw the zoomed area
    zoomCtx.drawImage(
      this.ctx.canvas,
      sourceX * pixelRatio, // Source X, adjusted for pixel ratio
      sourceY * pixelRatio, // Source Y, adjusted for pixel ratio
      sourceSize * pixelRatio, // Source width, adjusted for pixel ratio
      sourceSize * pixelRatio, // Source height, adjusted for pixel ratio
      0, // Destination X
      0, // Destination Y
      this.zoomRadius * 2, // Destination width
      this.zoomRadius * 2 // Destination height
    );

    // Draw the zoomed circle on the main canvas
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.zoomRadius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.clip();

    this.ctx.drawImage(
      this.zoomCanvas!,
      x - this.zoomRadius,
      y - this.zoomRadius
    );

    this.ctx.restore();
  }
}
