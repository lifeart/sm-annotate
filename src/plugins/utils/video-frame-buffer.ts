import {
  AudioFingerprint,
  AudioFingerprintExtractor,
  calculateAudioSimilarity,
} from "./audio-fingerprint";

const SIGNATURE_SCALE = 64;

export class VideoFrameBuffer {
  isDestroyed = false;
  autoHide = true;
  isMobile = false;
  transformCanvas!: HTMLCanvasElement;
  transformCanvasCtx!: CanvasRenderingContext2D;
  private audioExtractor: AudioFingerprintExtractor | null = null;
  private audioInitPromise: Promise<void> | null = null;

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

  /**
   * Initialize audio fingerprinting for frame sync.
   * Call this after the video is ready.
   */
  async initAudioSync(): Promise<void> {
    if (this.audioExtractor) {
      return this.audioInitPromise ?? Promise.resolve();
    }

    this.audioExtractor = new AudioFingerprintExtractor(this.video, this.fps);
    this.audioInitPromise = this.audioExtractor.init();
    return this.audioInitPromise;
  }

  /**
   * Check if audio sync is available.
   */
  hasAudioSync(): boolean {
    return this.audioExtractor?.hasAudio() ?? false;
  }

  start() {
    this.addRequestFrameCallback();
    // Start audio extraction in the background
    if (!this.isMobile) {
      this.initAudioSync().catch(() => {
        // Audio extraction failed - this is okay, sync will be disabled
      });
    }
  }

  destroy() {
    this.isDestroyed = true;
    this.frames.forEach((frame) => frame.close());
    this.frames.clear();
    this.audioFingerprints.clear();
    if (this.audioExtractor) {
      this.audioExtractor.destroy();
      this.audioExtractor = null;
    }
    this.audioInitPromise = null;
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
          // Extract audio fingerprint for this frame (non-mobile only)
          if (!this.isMobile && this.audioExtractor?.hasAudio()) {
            const fp = this.audioExtractor.getFingerprint(frameNumber);
            if (fp) {
              this.setAudioFingerprint(frameNumber, fp);
            }
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
  audioFingerprints: Map<number, AudioFingerprint> = new Map();
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

  /**
   * Find the best matching frame number using audio fingerprint comparison.
   * Searches within a ±3 frame window around the reference frame.
   *
   * @param signature - Audio fingerprint from the main video frame
   * @param refFrameNumber - Reference frame number to search around
   * @returns Best matching frame number based on audio similarity
   */
  getFrameNumberBySignature(
    signature: AudioFingerprint | null,
    refFrameNumber: number
  ): number {
    if (!signature) {
      return refFrameNumber;
    }

    let bestSimilarityScore = 0;
    let bestFrameNumber = refFrameNumber;

    const frameNumbers = [
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
      const fingerprint = this.getAudioFingerprint(frameNumber);
      if (fingerprint) {
        const result = calculateAudioSimilarity(signature, fingerprint);
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

  /**
   * Store audio fingerprint for a frame.
   */
  setAudioFingerprint(frame: number, data: AudioFingerprint) {
    this.audioFingerprints.set(frame, data);
  }

  /**
   * Get audio fingerprint for a frame.
   * Falls back to extracting from audio extractor if not cached.
   */
  getAudioFingerprint(frame: number): AudioFingerprint | null {
    if (this.audioFingerprints.has(frame)) {
      return this.audioFingerprints.get(frame)!;
    }

    // Try to extract from audio extractor
    if (this.audioExtractor?.hasAudio()) {
      const fp = this.audioExtractor.getFingerprint(frame);
      if (fp) {
        this.audioFingerprints.set(frame, fp);
        return fp;
      }
    }

    return null;
  }

  get totalFrames() {
    return Math.round(this.video.duration * this.fps);
  }

  frameNumberFromTime(time: number) {
    return Math.max(1, Math.round(time * this.fps));
  }
}
