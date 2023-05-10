const SIGNATURE_SCALE = 64;
let fId = 0;
class HistogramFrame extends Array<number> {
  id: number;
  constructor() {
    super(...arguments);
    this.id = fId++;
  }
}

function sobelOperator(imgData: ImageData) {
  let width = imgData.width;
  let height = imgData.height;
  let grayscale = new Array(width * height);
  let edges = new HistogramFrame();

  // convert to grayscale
  let ii = 0;
  for (let i = 0; i < imgData.data.length; i += 4) {
    let gray =
      (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
    grayscale[ii] = gray;
    ii++;
  }

  // apply sobel operator
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let i = y * width + x;
      let gx =
        -grayscale[i - width - 1] +
        grayscale[i - width + 1] -
        2 * grayscale[i - 1] +
        2 * grayscale[i + 1] -
        grayscale[i + width - 1] +
        grayscale[i + width + 1];
      let gy =
        grayscale[i - width - 1] +
        2 * grayscale[i - width] +
        grayscale[i - width + 1] -
        grayscale[i + width - 1] -
        2 * grayscale[i + width] -
        grayscale[i + width + 1];
      let magnitude = Math.sqrt(gx * gx + gy * gy);
      edges.push(magnitude);
    }
  }

  return edges;
}

const simCache = new Map<string, number>();
const cacheKeyForArrays = (arr1: HistogramFrame, arr2: HistogramFrame) => {
  return Math.max(arr1.id, arr2.id) + "-" + Math.min(arr1.id, arr2.id);
}
function calculateSimilarity(edges1: HistogramFrame, edges2: HistogramFrame) {
  const key = cacheKeyForArrays(edges1, edges2);
  if (simCache.has(key)) {
    return simCache.get(key)!;
  }
  let score = 0;
  for (let i = 0; i < edges1.length; i++) {
    score += (edges1[i] - edges2[i]) * (edges1[i] - edges2[i]);
  }
  let result = 1 / (1 + Math.sqrt(score));
  simCache.set(key, result);
  return result;
}

export class VideoFrameBuffer {
  isDestroyed = false;
  autoHide = true;
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
      console.log("looks like frame is not yet rendered");
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
          this.setHistogram(frameNumber, this.toHistogram(imageBitmap));
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
  getFrameNumberBySignature(signature: HistogramFrame | null, refFrameNumber: number) {
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
