import { IShapeBase, BasePlugin, ToolPlugin } from "./base";

export interface ICompare extends IShapeBase {
  type: "compare";
  x: number;
}

const ACTIVE_OPACITY = 0.7;

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
    this.leftOpacity = 1;
    this.rightOpacity = this.annotationTool.isMobile ? 1 : ACTIVE_OPACITY;
    this.annotationTool.canvas.style.cursor = "col-resize";
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
    this.onPointerMove(event);
  }
  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing) {
      if (this.annotationTool.globalShapes.length > 0) {
        const shape = this.annotationTool.globalShapes[0];
        if (shape.type === "compare") {
          const deserialized = this.annotationTool.deserialize([
            shape,
          ])[0] as ICompare;
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

  drawShape(shape: ICompare) {
    const video1 = this.annotationTool.videoElement as HTMLVideoElement;
    const video2 = this.annotationTool.referenceVideoElement;
    if (!video1 || !video2) {
      return;
    }
    const globalAlpha = this.ctx.globalAlpha;
    const w = this.annotationTool.canvasWidth;
    const h = this.annotationTool.canvasHeight;
    const x = shape.x;

    const isMobile = this.annotationTool.isMobile;

    // const strokeStyle = this.ctx.strokeStyle;

    this.ctx.globalAlpha = this.leftOpacity;
    // const filter = this.ctx.filter;

    const frameNumber =
      this.annotationTool.referenceVideoFrameBuffer?.frameNumberFromTime(
        video1.currentTime
      );
    const referenceVideoFrame =
      this.annotationTool.referenceVideoFrameBuffer?.getFrame(frameNumber || 0);

    const videoFrame = this.annotationTool.videoFrameBuffer?.getFrame(
      frameNumber || 0
    );

    if (isMobile) {
      const normalizedX = x / w;

      const cropWidth = x;
      this.ctx.drawImage(
        videoFrame ?? video1,
        0,
        0,
        normalizedX * video1.videoWidth,
        video1.videoHeight, // Source cropping parameters
        0,
        0,
        cropWidth,
        h // Destination position and size
      );
    } else {
      // console.log("drawing", videoFrame);
      const vw = videoFrame ? videoFrame.width : video1.videoWidth;
      const vh = videoFrame ? videoFrame.height : video1.videoHeight;
      this.ctx.drawImage(videoFrame ?? video1, 0, 0, vw, vh, 0, 0, w, h);
    }

    // this.ctx.filter = "contrast(140%) blur(1px)";

    const cropX = x; // The X coordinate of the vertical crop line
    const cropWidth1 = w - cropX;
    const normalizedCrop = (cropWidth1 / w) * video1.videoWidth;
    this.ctx.globalAlpha = this.rightOpacity;

    let topCrop = 0;
    let topOffset = 0;
    const heightDiff = video2.videoHeight - video1.videoHeight;
    const widthDiff = video2.videoWidth - video1.videoWidth;

    let xDiff = 0;
    if (widthDiff > 10) {
      xDiff = widthDiff / 2;
    } else if (widthDiff < -10) {
      xDiff = widthDiff / 2;
    } else {
      if (xDiff < 0) {
        console.log(xDiff);
      }
    }

    if (heightDiff === 0) {
      topCrop = 0;
    } else if (heightDiff > 0) {
      topCrop = heightDiff / 2;
      if (topCrop <= 10) {
        topCrop = 0;
      }
    } else {
      topOffset = Math.abs(heightDiff / 2);
      const mainVideoPixelToCanvasRatio = video1.videoHeight / h;
      topOffset = topOffset / mainVideoPixelToCanvasRatio;
      if (topOffset <= 10) {
        topOffset = 0;
      }
    }
    if (referenceVideoFrame) {
      this.ctx.drawImage(
        referenceVideoFrame,
        (cropX / w) * video1.videoWidth,
        topCrop,
        normalizedCrop,
        video1.videoHeight, // Source cropping parameters
        cropX,
        topOffset,
        cropWidth1,
        h // Destination position and size
      );
    } else {
      console.log("no video data", frameNumber);
    }

    // this.ctx.filter = filter;
    this.ctx.globalAlpha = globalAlpha;
  }

  draw(shape: ICompare) {
    const video1 = this.annotationTool.videoElement as HTMLVideoElement;
    const video2 = this.annotationTool.referenceVideoElement;
    if (!video1 || !video2) {
      return;
    }
    this.drawShape(shape);
  }
}
