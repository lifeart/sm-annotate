import { IShapeBase, BasePlugin, ToolPlugin } from "./base";

export interface ICompare extends IShapeBase {
  type: "compare";
  x: number;
}

export class CompareToolPlugin
  extends BasePlugin<ICompare>
  implements ToolPlugin<ICompare>
{
  name = "compare";
  comparisonLine = 0;
  leftOpacity = 1;
  rightOpacity = 1;
  isDrawing = false;
  move(shape: ICompare, dx: number, dy: number) {
    shape.x += dx;
    return shape;
  }
  onActivate(): void {
    this.comparisonLine = this.annotationTool.canvasWidth / 2;
    this.leftOpacity = 0.7;
    this.rightOpacity = 0.7;
    this.annotationTool.canvas.style.cursor = "col-resize";
    this.annotationTool.syncTime(true);
  }
  onDeactivate(): void {
    this.annotationTool.canvas.style.cursor = "default";
    this.comparisonLine = 0;
    this.leftOpacity = 1;
    this.rightOpacity = 1;
    this.isDrawing = false;
  }
  normalize(shape: ICompare, canvasWidth: number): ICompare {
    return {
      ...shape,
      x: shape.x / canvasWidth,
    };
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
    this.annotationTool.syncTime(true);
    this.onPointerMove(event);
  }
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing) {
        if (this.annotationTool.globalShapes.length > 0) {
            const shape = this.annotationTool.globalShapes[0];
            if (shape.type === "compare") {
                const deserialized = this.annotationTool.deserialize([shape])[0] as ICompare;
                this.draw(deserialized);
                this.annotationTool.addFrameSquareOverlay();
            }
        }
      return;
    }
    const { x } = this.annotationTool.getRelativeCoords(event);

    this.comparisonLine = x;

    const item = {
      type: "compare",
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
      x: x,
    } as ICompare;

    this.draw(item);
    this.drawDelimiter(item);
  }
  onPointerUp() {
    if (!this.isDrawing) {
      return;
    }

    this.save({
      type: "compare",
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
      x: this.comparisonLine,
    });
    this.isDrawing = false;
  }

  save(shape: ICompare) {
    this.annotationTool.globalShapes = this.annotationTool.globalShapes.filter(
      (s) => s.type !== "compare"
    );
    const serialized = this.annotationTool.serialize([shape])[0] as ICompare;
    if (serialized.x < 0.05 || serialized.x > 0.95) {
      return;
    }
    this.annotationTool.addGlobalShape(serialized);
  }

  drawDelimiter(shape: ICompare) {
    this.ctx.beginPath();
    this.ctx.moveTo(shape.x, 0);
    this.ctx.lineTo(shape.x, this.annotationTool.canvasWidth);
    this.ctx.stroke();
  }

  async draw(shape: ICompare) {
    const video1 = this.annotationTool.videoElement as HTMLVideoElement;
    const video2 = this.annotationTool.referenceVideoElement;
    if (!video1 || !video2) {
      return;
    }
    const bothPaused = video1.paused && video2.paused;
    this.annotationTool.syncTime();

    if (!bothPaused) {
      await this.annotationTool.waitForFrameSync();
    }

    const globalAlpha = this.ctx.globalAlpha;
    const w = this.annotationTool.canvasWidth;
    const h = this.annotationTool.canvasHeight;
    const x = shape.x;

    // const strokeStyle = this.ctx.strokeStyle;

    this.ctx.globalAlpha = this.leftOpacity;
    // const filter = this.ctx.filter;

    const normalizedX = x / w;

    const cropWidth = x;

    // this.ctx.filter = "grayscale(80%) brightness(120%)";

    this.ctx.drawImage(
      video1,
      0,
      0,
      normalizedX * video1.videoWidth,
      video1.videoHeight, // Source cropping parameters
      0,
      0,
      cropWidth,
      h // Destination position and size
    );

    // this.ctx.filter = "contrast(140%) blur(1px)";

    const cropX = x; // The X coordinate of the vertical crop line
   
    const cropWidth1 = (w - cropX);
    const normalizedCrop = (cropWidth1 / w) * video1.videoWidth;
    this.ctx.globalAlpha = this.rightOpacity;

    this.ctx.drawImage(
      video2,
      (cropX / w) * video1.videoWidth,
      0,
      normalizedCrop,
      video1.videoHeight, // Source cropping parameters
      cropX,
      0,
      cropWidth1,
      h // Destination position and size
    );

    // this.ctx.filter = filter;
    this.ctx.globalAlpha = globalAlpha;
  }
}
