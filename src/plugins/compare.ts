import type { ShapeMap } from ".";
import { IShapeBase, BasePlugin, ToolPlugin } from "./base";

export interface ICompare extends IShapeBase {
  type: "compare";
  x: number;
  disabled: boolean;
}

export class CompareToolPlugin
  extends BasePlugin<ICompare>
  implements ToolPlugin<ICompare>
{
  name = "compare" as keyof ShapeMap;
  comparisonLine = 0;
  leftOpacity = 1;
  isDrawing = false;
  get rightOpacity() {
    return this.annotationTool.overlayOpacity;
  }
  move(shape: ICompare, dx: number, dy: number) {
    shape.x += dx;
    return shape;
  }
  onActivate(): void {
    this.comparisonLine = this.annotationTool.canvasWidth / 2;
    this.leftOpacity = 1;
    this.annotationTool.canvas.style.cursor = "col-resize";
  }
  onDeactivate(): void {
    this.annotationTool.canvas.style.cursor = "default";
    this.comparisonLine = 0;
    this.leftOpacity = 1;
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
    this.disablePreviousCompare();
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
      disabled: false,
      x: this.comparisonLine,
    });
    this.isDrawing = false;
  }

  removePreviousCompare() {
    this.annotationTool.globalShapes = this.annotationTool.globalShapes.filter(
      (s) => s.type !== "compare"
    );
  }

  disablePreviousCompare() {
    this.annotationTool.globalShapes = this.annotationTool.globalShapes.map(
      (s) => {
        if (s.type === "compare") {
          return {
            ...s,
            disabled: true,
          };
        }
        return s;
      }
    );
  }

  save(shape: ICompare) {
    this.removePreviousCompare();
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

    const heightDiff = video2.videoHeight - video1.videoHeight;
    const widthDiff = video2.videoWidth - video1.videoWidth;

    const isMobile = this.annotationTool.isMobile;

    // const strokeStyle = this.ctx.strokeStyle;

    this.ctx.globalAlpha = this.leftOpacity;
    // const filter = this.ctx.filter;

    const frameNumber =
      this.annotationTool.referenceVideoFrameBuffer?.frameNumberFromTime(
        video1.currentTime
      ) ?? 1;

    let referenceVideoFrameNumber = frameNumber;

    const CUSTOM_FSYNC =
      widthDiff > video1.videoWidth && heightDiff > video1.videoHeight && !this.annotationTool.isMobile;

    if (CUSTOM_FSYNC) {
      const bestFrame =
        this.annotationTool.referenceVideoFrameBuffer?.getFrameNumberBySignature(
          this.annotationTool.videoFrameBuffer?.getHistogram(frameNumber) ??
            null,
          frameNumber
        ) ?? frameNumber;

      const fDiff = Math.abs(frameNumber - bestFrame);

      if (fDiff >= 1 && fDiff <= 3) {
        referenceVideoFrameNumber = bestFrame;
      }
    }

    const referenceVideoFrame =
      this.annotationTool.referenceVideoFrameBuffer?.getFrame(
        referenceVideoFrameNumber
      );

    const videoFrame =
      this.annotationTool.videoFrameBuffer?.getFrame(frameNumber);

    if (isMobile) {
      this.ctx.imageSmoothingQuality = "low";
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

    this.ctx.globalAlpha = this.rightOpacity;

    let topCrop = 0;
    let topOffset = 0;

    const ar1 = video1.videoWidth / video1.videoHeight;
    const ar2 = video2.videoWidth / video2.videoHeight;
    const arDiff = Math.abs(ar1 - ar2);
    const isAspectRatioDifferent = arDiff > 0.1;
    const acceptablePixelDiff = 10;
    const isHeightDifferent = Math.abs(heightDiff) > acceptablePixelDiff;
    // 0.05 is the threshold for aspect ratio difference

    let sourceWidth = video1.videoWidth;
    let sourceHeight = video1.videoHeight;

    // put small reference video in X center;
    let xOffset = 0;
    if (widthDiff < -acceptablePixelDiff) {
      if (isAspectRatioDifferent) {
        const mainVideoPixelToCanvasRatio = video1.videoWidth / w;
        xOffset = Math.abs(widthDiff / 2);
        xOffset = xOffset / mainVideoPixelToCanvasRatio;
        if (xOffset <= acceptablePixelDiff) {
          xOffset = 0;
        }
      } else {
        sourceWidth = video2.videoWidth;
      }
    } else if (widthDiff > acceptablePixelDiff) {
      sourceWidth = video2.videoWidth;
    }

    if (heightDiff === 0) {
      topCrop = 0;
    } else if (heightDiff > 0) {
      if (!isAspectRatioDifferent) {
        sourceHeight = isHeightDifferent
          ? video2.videoHeight
          : video1.videoHeight;
      } else {
        topCrop = heightDiff / 2;
        if (topCrop <= acceptablePixelDiff) {
          topCrop = 0;
        }
      }
    } else {
      if (!isAspectRatioDifferent) {
        sourceHeight = isHeightDifferent
          ? video2.videoHeight
          : video1.videoHeight;
      } else {
        topOffset = Math.abs(heightDiff / 2);
        const mainVideoPixelToCanvasRatio = video1.videoHeight / h;
        topOffset = topOffset / mainVideoPixelToCanvasRatio;
        if (topOffset <= acceptablePixelDiff) {
          topOffset = 0;
        }
      }
    }

    const cropX = x - xOffset; // The X coordinate of the vertical crop line
    const cropWidth1 = w - cropX;
    const normalizedCrop = (cropWidth1 / w) * sourceWidth;

    // Skip drawing reference video if opacity is 0 (off)
    if (referenceVideoFrame && this.rightOpacity > 0) {
      if (isMobile) {
        this.ctx.imageSmoothingQuality = "low";
      }
      this.ctx.drawImage(
        referenceVideoFrame,
        (cropX / w) * sourceWidth,
        topCrop,
        normalizedCrop,
        sourceHeight, // Source cropping parameters
        cropX + xOffset,
        topOffset,
        cropWidth1,
        h // Destination position and size
      );
    }

    // this.ctx.filter = filter;
    this.ctx.globalAlpha = globalAlpha;
  }

  draw(shape: ICompare) {
    if (shape.disabled) {
      return;
    }
    const video1 = this.annotationTool.videoElement as HTMLVideoElement;
    const video2 = this.annotationTool.referenceVideoElement;
    if (!video1 || !video2) {
      return;
    }
    this.drawShape(shape);
  }
}
