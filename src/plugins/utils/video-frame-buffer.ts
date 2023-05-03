export class VideoFrameBuffer {
  isDestroyed = false;
  constructor(video: HTMLVideoElement, fps: number) {
    this.video = video;
    this.fps = fps;
    this.createCanvas();
    this.addRequestFrameCallback();
  }
  destroy() {
    this.isDestroyed = true;
    this.frames.forEach((frame) => frame.close());
    this.frames.clear();
  }
  addRequestFrameCallback() {
    if (this.isDestroyed) {
      return;
    }
    this.video.requestVideoFrameCallback((_: number, metadata) => {
      if (this.isDestroyed) {
        return;
      }
      if (this.video.videoWidth === 0 || this.video.videoHeight === 0) {
        this.addRequestFrameCallback();
        return;
      }
      const video = this.video;
      const frameNumber = this.frameNumberFromTime(metadata.mediaTime);
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
          }
        );
      }
      this.addRequestFrameCallback();
    });
  }
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });
  }
  setCanvasSize() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
  }
  fps: number;
  frames: Map<number, ImageBitmap> = new Map();
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
  setFrame(frame: number, data: ImageBitmap) {
    this.frames.set(frame, data);
  }
  frameNumberFromTime(time: number) {
    return Math.max(1, Math.round(time * this.fps));
  }
}
