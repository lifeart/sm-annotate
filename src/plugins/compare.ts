import type { ShapeMap } from ".";
import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
import { computeDifferenceImage, fitRect } from "./utils/image-difference";

type FrameSource = ImageBitmap;

// Max width of the offscreen buffer the difference is computed on
const DIFF_MAX_WIDTH = 1280;
const DIFF_MAX_WIDTH_MOBILE = 640;

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
  // Share of pixels that differed in the last rendered difference frame (0-1)
  differentPixelRatio = 0;
  private diffCanvas: HTMLCanvasElement | null = null;
  private diffCtx: CanvasRenderingContext2D | null = null;
  private diffImage: ImageData | null = null;
  // Set once pixel readback fails (tainted canvas) so it isn't retried per frame
  private diffReadbackBlocked = false;
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
    this.diffReadbackBlocked = false;
    this.annotationTool.canvas.style.cursor = "col-resize";
  }
  onDeactivate(): void {
    this.annotationTool.canvas.style.cursor = "default";
    this.comparisonLine = 0;
    this.leftOpacity = 1;
    this.isDrawing = false;
  }
  normalize(shape: ICompare, canvasWidth: number, _canvasHeight: number): ICompare {
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
    if (this.annotationTool.compareMode === "wipe") {
      this.drawDelimiter(item);
    }
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
    this.ctx.lineTo(shape.x, this.annotationTool.canvasHeight);
    this.ctx.stroke();
  }

  drawShape(shape: ICompare) {
    const video1 = this.annotationTool.videoElement as HTMLVideoElement;
    const video2 = this.annotationTool.referenceVideoElement;
    if (!video1 || !video2) {
      return;
    }
    const globalAlpha = this.ctx.globalAlpha;
    const { videoFrame, referenceVideoFrame } = this.getFrames(video1, video2);

    switch (this.annotationTool.compareMode) {
      case "overlay":
        this.drawOverlay(video1, video2, videoFrame, referenceVideoFrame);
        break;
      case "difference":
        this.drawDifference(video1, video2, videoFrame, referenceVideoFrame);
        break;
      default:
        this.drawWipe(shape, video1, video2, videoFrame, referenceVideoFrame);
    }

    this.ctx.globalAlpha = globalAlpha;
  }

  /**
   * Resolve the main and reference frames shown for the current time.
   */
  getFrames(video1: HTMLVideoElement, video2: HTMLVideoElement) {
    const heightDiff = video2.videoHeight - video1.videoHeight;
    const widthDiff = video2.videoWidth - video1.videoWidth;

    // Each buffer maps time to frames with its own fps
    const frameNumber =
      this.annotationTool.videoFrameBuffer?.frameNumberFromTime(
        video1.currentTime
      ) ?? 1;

    let referenceVideoFrameNumber =
      this.annotationTool.referenceVideoFrameBuffer?.frameNumberFromTime(
        video1.currentTime
      ) ?? frameNumber;

    // Use audio-based sync when reference video is significantly larger
    const AUDIO_SYNC_ENABLED =
      widthDiff > video1.videoWidth && heightDiff > video1.videoHeight && !this.annotationTool.isMobile;

    if (AUDIO_SYNC_ENABLED) {
      const bestFrame =
        this.annotationTool.referenceVideoFrameBuffer?.getFrameNumberBySignature(
          this.annotationTool.videoFrameBuffer?.getAudioFingerprint(frameNumber) ??
            null,
          referenceVideoFrameNumber
        ) ?? referenceVideoFrameNumber;

      const fDiff = Math.abs(referenceVideoFrameNumber - bestFrame);

      if (fDiff >= 1 && fDiff <= 3) {
        referenceVideoFrameNumber = bestFrame;
      }
    }

    const referenceVideoFrame =
      this.annotationTool.referenceVideoFrameBuffer?.getFrame(
        referenceVideoFrameNumber
      ) ?? null;

    const videoFrame =
      this.annotationTool.videoFrameBuffer?.getFrame(frameNumber) ?? null;

    return { videoFrame, referenceVideoFrame };
  }

  /**
   * Draw the main video frame over the whole canvas.
   */
  drawMainFrame(video1: HTMLVideoElement, videoFrame: FrameSource | null) {
    const w = this.annotationTool.canvasWidth;
    const h = this.annotationTool.canvasHeight;
    const vw = videoFrame ? videoFrame.width : video1.videoWidth;
    const vh = videoFrame ? videoFrame.height : video1.videoHeight;
    this.ctx.globalAlpha = this.leftOpacity;
    this.ctx.drawImage(videoFrame ?? video1, 0, 0, vw, vh, 0, 0, w, h);
  }

  /**
   * Where the reference frame lands on the canvas: aspect-correct and centered.
   */
  referenceRect(video2: HTMLVideoElement, referenceVideoFrame: FrameSource) {
    return fitRect(
      video2.videoWidth || referenceVideoFrame.width,
      video2.videoHeight || referenceVideoFrame.height,
      this.annotationTool.canvasWidth,
      this.annotationTool.canvasHeight
    );
  }

  /**
   * Overlay mode: reference video layered over the full main frame at the
   * overlay opacity.
   */
  drawOverlay(
    video1: HTMLVideoElement,
    video2: HTMLVideoElement,
    videoFrame: FrameSource | null,
    referenceVideoFrame: FrameSource | null
  ) {
    this.drawMainFrame(video1, videoFrame);
    if (!referenceVideoFrame || this.rightOpacity <= 0) {
      return;
    }
    const rect = this.referenceRect(video2, referenceVideoFrame);
    this.ctx.globalAlpha = this.rightOpacity;
    this.ctx.drawImage(
      referenceVideoFrame,
      0,
      0,
      referenceVideoFrame.width,
      referenceVideoFrame.height,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
  }

  /**
   * Difference mode: grayscale where both videos match, red where the main
   * video is brighter, blue where the reference is brighter. The result is
   * layered over the main frame at the overlay opacity.
   */
  drawDifference(
    video1: HTMLVideoElement,
    video2: HTMLVideoElement,
    videoFrame: FrameSource | null,
    referenceVideoFrame: FrameSource | null
  ) {
    this.drawMainFrame(video1, videoFrame);
    if (!referenceVideoFrame || this.rightOpacity <= 0) {
      return;
    }
    const w = this.annotationTool.canvasWidth;
    const h = this.annotationTool.canvasHeight;
    const rect = this.referenceRect(video2, referenceVideoFrame);

    const diffCanvas = this.renderDifference(
      videoFrame ?? video1,
      videoFrame ? videoFrame.width : video1.videoWidth,
      videoFrame ? videoFrame.height : video1.videoHeight,
      referenceVideoFrame,
      rect,
      w,
      h
    );

    this.ctx.globalAlpha = this.rightOpacity;
    if (diffCanvas) {
      this.ctx.drawImage(
        diffCanvas,
        0,
        0,
        diffCanvas.width,
        diffCanvas.height,
        0,
        0,
        w,
        h
      );
      return;
    }
    // Pixels can't be read (e.g. cross-origin video without CORS):
    // fall back to the GPU difference blend, which needs no readback.
    const composite = this.ctx.globalCompositeOperation;
    this.ctx.globalCompositeOperation = "difference";
    this.ctx.drawImage(
      referenceVideoFrame,
      0,
      0,
      referenceVideoFrame.width,
      referenceVideoFrame.height,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
    this.ctx.globalCompositeOperation = composite;
  }

  /**
   * Render the colored difference into an offscreen canvas, downscaled to at
   * most DIFF_MAX_WIDTH pixels wide to keep per-frame cost bounded.
   * Returns null when pixel data can't be read.
   */
  renderDifference(
    mainSource: CanvasImageSource,
    mainWidth: number,
    mainHeight: number,
    referenceSource: FrameSource,
    rect: { x: number; y: number; width: number; height: number },
    w: number,
    h: number
  ): HTMLCanvasElement | null {
    const maxWidth = this.annotationTool.isMobile
      ? DIFF_MAX_WIDTH_MOBILE
      : DIFF_MAX_WIDTH;
    const scale = Math.min(1, maxWidth / w);
    const dw = Math.max(1, Math.round(w * scale));
    const dh = Math.max(1, Math.round(h * scale));

    if (!this.diffCanvas) {
      this.diffCanvas = document.createElement("canvas");
      this.diffCtx = this.diffCanvas.getContext("2d", {
        willReadFrequently: true,
      });
    }
    const canvas = this.diffCanvas;
    const ctx = this.diffCtx;
    if (!ctx || this.diffReadbackBlocked) {
      return null;
    }
    if (canvas.width !== dw || canvas.height !== dh) {
      canvas.width = dw;
      canvas.height = dh;
      this.diffImage = null;
    }

    try {
      ctx.globalAlpha = 1;
      ctx.drawImage(mainSource, 0, 0, mainWidth, mainHeight, 0, 0, dw, dh);
      const main = ctx.getImageData(0, 0, dw, dh);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, dw, dh);
      ctx.drawImage(
        referenceSource,
        0,
        0,
        referenceSource.width,
        referenceSource.height,
        rect.x * scale,
        rect.y * scale,
        rect.width * scale,
        rect.height * scale
      );
      const reference = ctx.getImageData(0, 0, dw, dh);

      if (!this.diffImage) {
        this.diffImage = ctx.createImageData(dw, dh);
      }
      this.differentPixelRatio =
        computeDifferenceImage(
          main.data,
          reference.data,
          this.diffImage.data,
          this.annotationTool.differenceThreshold
        ) /
        (dw * dh);
      ctx.putImageData(this.diffImage, 0, 0);
      return canvas;
    } catch (e) {
      // SecurityError on a tainted canvas
      this.diffReadbackBlocked = true;
      return null;
    }
  }

  drawWipe(
    shape: ICompare,
    video1: HTMLVideoElement,
    video2: HTMLVideoElement,
    videoFrame: FrameSource | null,
    referenceVideoFrame: FrameSource | null
  ) {
    const w = this.annotationTool.canvasWidth;
    const h = this.annotationTool.canvasHeight;
    const x = shape.x;

    const heightDiff = video2.videoHeight - video1.videoHeight;
    const widthDiff = video2.videoWidth - video1.videoWidth;

    const isMobile = this.annotationTool.isMobile;

    this.ctx.globalAlpha = this.leftOpacity;

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
