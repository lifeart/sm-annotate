import {
  HistogramFrame,
  calculateSimilarity,
  sobelOperator,
} from "./sobel-operator";

const SIGNATURE_SCALE = 64;
export class VideoFrameBuffer {
  isDestroyed = false;
  autoHide = true;
  isMobile = false;
  transformCanvas!: HTMLCanvasElement;
  transformCanvasCtx!: CanvasRenderingContext2D;
  constructor(video: HTMLVideoElement, fps: number, autoHide = true) {
    this.video = video;
    this.fps = fps;
    this.autoHide = autoHide;
    this.createCanvas();
    this.createTransformCanvas();
  }
  createTransformCanvas() {
    this.transformCanvas = document.createElement("canvas");
    this.transformCanvasCtx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    }) as CanvasRenderingContext2D;
    this.transformCanvas.width = SIGNATURE_SCALE;
    this.transformCanvas.height = SIGNATURE_SCALE;
  }
  normalizeImage(image: ImageBitmap): ImageData {
    this.transformCanvasCtx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      SIGNATURE_SCALE,
      SIGNATURE_SCALE
    );
    return this.transformCanvasCtx.getImageData(
      0,
      0,
      SIGNATURE_SCALE,
      SIGNATURE_SCALE
    );
  }
  toHistogram(image: ImageBitmap) {
    return this.imageHistogram(this.normalizeImage(image));
  }
  imageHistogram(image: ImageData): HistogramFrame {
    let grayscaleHistogram = sobelOperator(image);
    return grayscaleHistogram;
  }
  start() {
    this.addRequestFrameCallback();
  }
  destroy() {
    this.isDestroyed = true;
    this.frames.forEach((frame) => frame.close());
    this.frames.clear();
  }
  tick(_: number, metadata: VideoFrameCallbackMetadata): boolean {
    this.setCanvasSize();
    const delta = metadata.expectedDisplayTime - performance.now();
    if (delta > 10) {
      // Frame rendering delayed - expected display time not yet reached
    }
    if (this.isDestroyed) {
      return false;
    }
    if (this.seenFrames >= this.totalFrames) {
      // if we've seen all the frames, pause the video and hide it
      if (this.autoHide) {
        try {
          if (!this.video.paused) {
            this.video.pause();
          }
          this.video.style.display = "none";
        } catch (e) {
          // EOL
        }
      }
      return false;
    }
    if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
      return true;
    }
    const video = this.video;
    const frameNumber = this.frameNumberFromTime(metadata.mediaTime);
    const expectedFrame = Math.max(
      1,
      metadata.presentedFrames > this.totalFrames
        ? metadata.presentedFrames % this.totalFrames
        : metadata.presentedFrames
    );
    if (!expectedFrame) {
      throw new Error("expectedFrame is 0");
    }

    if (!this.hasFrame(frameNumber)) {
      this.ctx.drawImage(
        video,
        0,
        0,
        this.width,
        this.height,
        0,
        0,
        this.width,
        this.height
      );
      const imageData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      createImageBitmap(imageData, 0, 0, this.width, this.height).then(
        async (imageBitmap) => {
          this.setFrame(frameNumber, imageBitmap);
          if (!this.isMobile) {
            this.setHistogram(frameNumber, this.toHistogram(imageBitmap));
          }
        }
      );
    } else {
      this.seenFrames++;
    }
    return true;
  }
  addRequestFrameCallback() {
    if (this.isDestroyed) {
      return;
    }
    this.video.requestVideoFrameCallback((_: number, metadata) => {
      const repeat = this.tick(_, metadata);
      if (repeat) {
        this.addRequestFrameCallback();
      }
    });
  }
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    }) as CanvasRenderingContext2D;
  }
  seenFrames = 0;
  isCanvasSizeSet = false;
  setCanvasSize() {
    if (this.isCanvasSizeSet) {
      return;
    }
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.isCanvasSizeSet = true;
  }
  fps: number;
  frames: Map<number, ImageBitmap> = new Map();
  histograms: Map<number, HistogramFrame> = new Map();
  video!: HTMLVideoElement;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  get width() {
    return this.video.videoWidth;
  }
  get height() {
    return this.video.videoHeight;
  }
  hasFrame(frame: number) {
    return this.frames.has(frame);
  }
  getFrame(frame: number) {
    if (this.frames.has(frame)) {
      return this.frames.get(frame)!;
    } else {
      return null;
    }
  }
  getFrameNumberBySignature(
    signature: HistogramFrame | null,
    refFrameNumber: number
  ) {
    if (!signature) {
      return refFrameNumber;
    }
    let bestSimilarityScore = 0;
    let bestFrameNumber = refFrameNumber;
    let frameNumbers = [
      refFrameNumber - 3,
      refFrameNumber - 2,
      refFrameNumber - 1,
      refFrameNumber,
      refFrameNumber + 1,
      refFrameNumber + 2,
      refFrameNumber + 3,
    ].filter(
      (frameNumber) => frameNumber > 0 && frameNumber <= this.totalFrames
    );
    frameNumbers.forEach((frameNumber) => {
      const histogram = this.getHistogram(frameNumber);
      if (histogram) {
        const result = calculateSimilarity(signature, histogram);
        if (result > bestSimilarityScore) {
          bestSimilarityScore = result;
          bestFrameNumber = frameNumber;
        }
      }
    });
    return bestFrameNumber;
  }
  setFrame(frame: number, data: ImageBitmap) {
    this.frames.set(frame, data);
  }
  setHistogram(frame: number, data: HistogramFrame) {
    this.histograms.set(frame, data);
  }
  getHistogram(frame: number) {
    return this.histograms.get(frame) ?? null;
  }
  get totalFrames() {
    return Math.round(this.video.duration * this.fps);
  }
  frameNumberFromTime(time: number) {
    return Math.max(1, Math.round(time * this.fps));
  }
}
