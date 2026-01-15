import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export interface FFmpegProgress {
  loaded: number;
  total: number;
  phase: "loading" | "extracting" | "processing";
}

export interface VideoInfo {
  fps: number;
  duration: number;
  width: number;
  height: number;
  totalFrames: number;
}

export type ProgressCallback = (progress: FFmpegProgress) => void;

/**
 * FFmpeg-based frame extractor for precise frame-accurate video playback.
 * Uses WASM FFmpeg to extract frames, eliminating ±1 frame drift issues
 * common with HTML5 video's requestVideoFrameCallback.
 */
export class FFmpegFrameExtractor {
  private ffmpeg: FFmpeg | null = null;
  private loadPromise: Promise<void> | null = null;
  private frames: Map<number, ImageBitmap> = new Map();
  private videoInfo: VideoInfo | null = null;
  private isDestroyed = false;
  private extractionAbortController: AbortController | null = null;

  /**
   * Load FFmpeg WASM asynchronously.
   * Call this before any other operations.
   */
  async load(onProgress?: ProgressCallback): Promise<void> {
    if (this.ffmpeg) {
      return;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._load(onProgress);
    return this.loadPromise;
  }

  private async _load(onProgress?: ProgressCallback): Promise<void> {
    // Check for SharedArrayBuffer support (required for FFmpeg multi-threading)
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== "undefined";
    console.log(`SharedArrayBuffer available: ${hasSharedArrayBuffer}`);

    if (!hasSharedArrayBuffer) {
      console.warn(
        "SharedArrayBuffer not available. FFmpeg may not work correctly.\n" +
        "To enable, add these headers to your server:\n" +
        "  Cross-Origin-Embedder-Policy: require-corp\n" +
        "  Cross-Origin-Opener-Policy: same-origin"
      );
    }

    this.ffmpeg = new FFmpeg();

    this.ffmpeg.on("log", ({ message }) => {
      // Log all FFmpeg output for debugging
      console.log("FFmpeg:", message);
      // Parse FFmpeg output for progress and metadata
      this.parseFFmpegLog(message);
    });

    this.ffmpeg.on("progress", ({ progress }) => {
      console.log("FFmpeg progress:", progress);
      onProgress?.({
        loaded: progress,
        total: 1,
        phase: "extracting",
      });
    });

    onProgress?.({
      loaded: 0,
      total: 1,
      phase: "loading",
    });

    const coreBaseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm";
    const ffmpegBaseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.15/dist/esm";

    // Fetch worker.js and rewrite relative imports to absolute URLs
    // This is needed because blob URLs can't do relative imports
    const workerResponse = await fetch(`${ffmpegBaseURL}/worker.js`);
    let workerCode = await workerResponse.text();

    // Rewrite relative imports to absolute URLs
    workerCode = workerCode.replace(
      /from\s*["']\.\/([^"']+)["']/g,
      `from "${ffmpegBaseURL}/$1"`
    );
    workerCode = workerCode.replace(
      /import\s*["']\.\/([^"']+)["']/g,
      `import "${ffmpegBaseURL}/$1"`
    );

    const workerBlob = new Blob([workerCode], { type: "text/javascript" });
    const classWorkerURL = URL.createObjectURL(workerBlob);

    onProgress?.({
      loaded: 0.25,
      total: 1,
      phase: "loading",
    });

    const coreURL = await toBlobURL(
      `${coreBaseURL}/ffmpeg-core.js`,
      "text/javascript"
    );

    onProgress?.({
      loaded: 0.5,
      total: 1,
      phase: "loading",
    });

    const wasmURL = await toBlobURL(
      `${coreBaseURL}/ffmpeg-core.wasm`,
      "application/wasm"
    );

    onProgress?.({
      loaded: 0.75,
      total: 1,
      phase: "loading",
    });

    await this.ffmpeg.load({
      coreURL,
      wasmURL,
      classWorkerURL,
    });

    onProgress?.({
      loaded: 1,
      total: 1,
      phase: "loading",
    });
  }

  /**
   * Check if FFmpeg is loaded and ready.
   */
  isLoaded(): boolean {
    return this.ffmpeg !== null;
  }

  private parseFFmpegLog(message: string): void {
    // Debug: log all FFmpeg output
    // console.log("FFmpeg log:", message);

    // Parse FPS from input stream info
    // Examples:
    //   "Stream #0:0: Video: h264, 1920x1080, 24 fps"
    //   "30 fps, 30 tbr"
    //   "29.97 fps"
    //   "25 tbr" (when fps not shown, tbr is usually the frame rate)
    const fpsMatch = message.match(/(\d+(?:\.\d+)?)\s*fps/);
    if (fpsMatch && this.videoInfo) {
      const fps = parseFloat(fpsMatch[1]);
      if (fps > 0 && fps < 1000) {
        this.videoInfo.fps = fps;
      }
    }

    // Fallback: try to get tbr (time base rate) if fps not found
    // tbr is often the actual frame rate for constant frame rate videos
    if (this.videoInfo && this.videoInfo.fps === 25) {
      const tbrMatch = message.match(/(\d+(?:\.\d+)?)\s*tbr/);
      if (tbrMatch) {
        const tbr = parseFloat(tbrMatch[1]);
        if (tbr > 0 && tbr < 1000) {
          this.videoInfo.fps = tbr;
        }
      }
    }

    // Parse duration
    // Example: "Duration: 00:01:30.50"
    const durationMatch = message.match(
      /Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d+)/
    );
    if (durationMatch && this.videoInfo) {
      const hours = parseInt(durationMatch[1], 10);
      const minutes = parseInt(durationMatch[2], 10);
      const seconds = parseInt(durationMatch[3], 10);
      const centiseconds = parseInt(durationMatch[4], 10);
      this.videoInfo.duration =
        hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
    }

    // Parse video dimensions
    // Example: "1920x1080" or "Stream #0:0: Video: h264, yuv420p, 1920x1080"
    const dimensionMatch = message.match(/(\d{2,5})x(\d{2,5})/);
    if (dimensionMatch && this.videoInfo) {
      const width = parseInt(dimensionMatch[1], 10);
      const height = parseInt(dimensionMatch[2], 10);
      if (width > 0 && height > 0) {
        this.videoInfo.width = width;
        this.videoInfo.height = height;
      }
    }
  }

  /**
   * Probe video file to get metadata (FPS, duration, dimensions).
   * This is similar to running ffprobe.
   */
  async probe(videoSource: Blob | string): Promise<VideoInfo> {
    await this.load();
    if (!this.ffmpeg) {
      throw new Error("FFmpeg not loaded");
    }

    // Initialize video info with defaults
    this.videoInfo = {
      fps: 25,
      duration: 0,
      width: 0,
      height: 0,
      totalFrames: 0,
    };

    // Determine file extension from blob type or URL
    let extension = "mp4";
    if (typeof videoSource !== "string" && videoSource.type) {
      const typeMap: Record<string, string> = {
        "video/mp4": "mp4",
        "video/webm": "webm",
        "video/quicktime": "mov",
        "video/x-msvideo": "avi",
        "video/x-matroska": "mkv",
        "video/ogg": "ogv",
      };
      extension = typeMap[videoSource.type] || "mp4";
    }

    const inputFileName = `input_probe.${extension}`;

    // Fetch and write input file
    const fileData =
      typeof videoSource === "string"
        ? await fetchFile(videoSource)
        : await fetchFile(videoSource);

    await this.ffmpeg.writeFile(inputFileName, fileData);

    // Run ffmpeg with just -i to get video info
    // This will "fail" with "no output file specified" but outputs metadata first
    try {
      await this.ffmpeg.exec(["-i", inputFileName]);
    } catch {
      // Expected to fail, we just want the log output with metadata
    }

    // Clean up
    try {
      await this.ffmpeg.deleteFile(inputFileName);
    } catch {
      // Ignore cleanup errors
    }

    // Calculate total frames
    if (this.videoInfo.duration > 0 && this.videoInfo.fps > 0) {
      this.videoInfo.totalFrames = Math.round(
        this.videoInfo.duration * this.videoInfo.fps
      );
    }

    console.log("Probed video info:", this.videoInfo);

    return this.videoInfo;
  }

  /**
   * Extract all frames from video as ImageBitmap objects.
   * Uses chunked extraction to avoid WASM memory limits.
   *
   * @param videoSource - Video file as Blob or URL
   * @param options - Extraction options
   */
  async extractFrames(
    videoSource: Blob | string,
    options: {
      fps?: number;
      startFrame?: number;
      endFrame?: number;
      scale?: number;
      format?: "png" | "jpg";
      onProgress?: ProgressCallback;
    } = {}
  ): Promise<Map<number, ImageBitmap>> {
    await this.load(options.onProgress);
    if (!this.ffmpeg) {
      throw new Error("FFmpeg not loaded");
    }

    if (this.isDestroyed) {
      throw new Error("Extractor has been destroyed");
    }

    this.extractionAbortController = new AbortController();

    // Clear any previously extracted frames
    this.clearFrames();

    // First probe to get video info if we don't have it
    if (!this.videoInfo) {
      await this.probe(videoSource);
    }

    const fps = options.fps ?? this.videoInfo?.fps ?? 25;
    const format = options.format ?? "png";
    const totalFrames = options.endFrame ?? this.videoInfo?.totalFrames ?? 0;
    const startFrame = options.startFrame ?? 1;

    // Determine file extension from blob type
    let extension = "mp4";
    if (typeof videoSource !== "string" && videoSource.type) {
      const typeMap: Record<string, string> = {
        "video/mp4": "mp4",
        "video/webm": "webm",
        "video/quicktime": "mov",
        "video/x-msvideo": "avi",
        "video/x-matroska": "mkv",
        "video/ogg": "ogv",
      };
      extension = typeMap[videoSource.type] || "mp4";
    }

    const inputFileName = `input.${extension}`;

    options.onProgress?.({
      loaded: 0,
      total: totalFrames,
      phase: "extracting",
    });

    // Fetch and write input file
    const fileData =
      typeof videoSource === "string"
        ? await fetchFile(videoSource)
        : await fetchFile(videoSource);

    // Check file size - WASM has limited memory (~512MB typically)
    const fileSizeMB = fileData.byteLength / (1024 * 1024);
    console.log(`Video file size: ${fileSizeMB.toFixed(2)} MB`);

    if (fileSizeMB > 100) {
      throw new Error(
        `Video file too large (${fileSizeMB.toFixed(0)}MB). FFmpeg WASM has memory limits. Please use a smaller video file (<100MB).`
      );
    }

    await this.ffmpeg.writeFile(inputFileName, fileData);

    // Verify file was written
    try {
      const writtenFile = await this.ffmpeg.readFile(inputFileName);
      const size = writtenFile instanceof Uint8Array ? writtenFile.byteLength : writtenFile.length;
      console.log(`Input file written: ${size} bytes`);
    } catch (e) {
      console.error("Failed to verify input file:", e);
    }

    // Helper to run FFmpeg with timeout
    const execWithTimeout = async (args: string[], timeoutMs: number = 30000): Promise<void> => {
      console.log("FFmpeg command:", args.join(" "));
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`FFmpeg timeout after ${timeoutMs}ms`)), timeoutMs);
      });
      await Promise.race([
        this.ffmpeg!.exec(args),
        timeoutPromise
      ]);
    };

    // Try simple single-frame extraction first to test if FFmpeg works
    // H264 decoding in WASM is slow, so use generous timeout
    console.log("Testing FFmpeg with single frame extraction (this may take a while for h264)...");
    const testFormat = format === "png" ? "png" : "jpg";
    try {
      const testArgs = [
        "-y",
        "-nostdin",
        "-i", inputFileName,
        "-frames:v", "1",
      ];
      if (testFormat === "jpg") {
        testArgs.push("-q:v", "8");
      }
      testArgs.push(`test_frame.${testFormat}`);

      await execWithTimeout(testArgs, 60000);  // 60 second timeout for single frame
      const testFrame = await this.ffmpeg.readFile(`test_frame.${testFormat}`);
      const testSize = testFrame instanceof Uint8Array ? testFrame.byteLength : testFrame.length;
      console.log(`Test frame extracted: ${testSize} bytes`);
      await this.ffmpeg.deleteFile(`test_frame.${testFormat}`);
    } catch (e) {
      console.error("Single frame test failed:", e);
      // Clean up and throw
      try { await this.ffmpeg.deleteFile(inputFileName); } catch {}
      throw new Error(`FFmpeg cannot process this video (h264 decoding may be too slow in WASM). Error: ${e}`);
    }

    // Extract all frames
    // Use longer timeout since h264 decoding is slow in WASM
    const estimatedTime = Math.max(300000, totalFrames * 2000);  // ~2 sec per frame minimum 5 min
    console.log(`Extracting ${totalFrames} frames as ${format.toUpperCase()} at fps=${fps} (estimated timeout: ${(estimatedTime/1000).toFixed(0)}s)...`);
    const ffmpegArgs = [
      "-y",
      "-nostdin",
      "-i", inputFileName,
      "-vf", `fps=${fps}`,
    ];
    if (format === "jpg") {
      ffmpegArgs.push("-q:v", "8");
    }
    ffmpegArgs.push(`frame_%06d.${format}`);

    try {
      await execWithTimeout(ffmpegArgs, estimatedTime);
    } catch (e) {
      console.error("Frame extraction failed:", e);
      try { await this.ffmpeg.deleteFile(inputFileName); } catch {}
      throw new Error(`Failed to extract frames: ${e}`);
    }

    // Read extracted frames
    let frameIndex = 1;
    while (!this.isDestroyed) {
      const frameFileName = `frame_${String(frameIndex).padStart(6, "0")}.${format}`;

      try {
        const frameData = await this.ffmpeg.readFile(frameFileName);

        if (frameData instanceof Uint8Array) {
          const blob = new Blob([frameData], {
            type: format === "png" ? "image/png" : "image/jpeg",
          });
          const imageBitmap = await createImageBitmap(blob);
          this.frames.set(frameIndex, imageBitmap);

          await this.ffmpeg.deleteFile(frameFileName);

          options.onProgress?.({
            loaded: frameIndex,
            total: totalFrames || frameIndex,
            phase: "processing",
          });
        }

        frameIndex++;
      } catch {
        // No more frames
        break;
      }
    }

    console.log(`Extraction complete: ${this.frames.size} frames`);

    // Clean up input file
    try {
      await this.ffmpeg.deleteFile(inputFileName);
    } catch {
      // File might already be deleted
    }

    this.extractionAbortController = null;

    return this.frames;
  }

  /**
   * Extract frames in chunks for memory efficiency.
   * Useful for long videos where loading all frames at once is not feasible.
   *
   * @param videoSource - Video file as Blob or URL
   * @param chunkSize - Number of frames per chunk
   * @param onChunk - Callback when a chunk is ready
   */
  async extractFramesInChunks(
    videoSource: Blob | string,
    chunkSize: number,
    onChunk: (
      frames: Map<number, ImageBitmap>,
      startFrame: number,
      endFrame: number
    ) => void,
    options: {
      fps?: number;
      onProgress?: ProgressCallback;
    } = {}
  ): Promise<void> {
    // First probe to get total frames
    const info = await this.probe(videoSource);
    const totalFrames = info.totalFrames;
    const fps = options.fps ?? info.fps;

    for (let start = 1; start <= totalFrames; start += chunkSize) {
      if (this.isDestroyed) break;

      const end = Math.min(start + chunkSize - 1, totalFrames);

      // Clear previous frames to free memory
      this.clearFrames();

      await this.extractFrames(videoSource, {
        fps,
        startFrame: start,
        endFrame: end,
        onProgress: options.onProgress,
      });

      onChunk(this.frames, start, end);
    }
  }

  /**
   * Get a specific frame by number.
   */
  getFrame(frameNumber: number): ImageBitmap | null {
    return this.frames.get(frameNumber) ?? null;
  }

  /**
   * Check if a frame is available.
   */
  hasFrame(frameNumber: number): boolean {
    return this.frames.has(frameNumber);
  }

  /**
   * Get all available frames.
   */
  getAllFrames(): Map<number, ImageBitmap> {
    return this.frames;
  }

  /**
   * Get video information (available after probe or extractFrames).
   */
  getVideoInfo(): VideoInfo | null {
    return this.videoInfo;
  }

  /**
   * Get total number of extracted frames.
   */
  get frameCount(): number {
    return this.frames.size;
  }

  /**
   * Clear all extracted frames from memory.
   */
  clearFrames(): void {
    this.frames.forEach((frame) => frame.close());
    this.frames.clear();
  }

  /**
   * Abort any ongoing extraction.
   */
  abort(): void {
    this.extractionAbortController?.abort();
  }

  /**
   * Clean up all resources.
   */
  destroy(): void {
    this.isDestroyed = true;
    this.abort();
    this.clearFrames();
    this.ffmpeg?.terminate();
    this.ffmpeg = null;
    this.loadPromise = null;
    this.videoInfo = null;
  }
}

// Singleton instance for convenience
let sharedInstance: FFmpegFrameExtractor | null = null;

/**
 * Get a shared FFmpegFrameExtractor instance.
 * Useful when you want to reuse the loaded FFmpeg across multiple operations.
 */
export function getSharedFFmpegExtractor(): FFmpegFrameExtractor {
  if (!sharedInstance) {
    sharedInstance = new FFmpegFrameExtractor();
  }
  return sharedInstance;
}

/**
 * Destroy the shared instance.
 */
export function destroySharedFFmpegExtractor(): void {
  sharedInstance?.destroy();
  sharedInstance = null;
}
