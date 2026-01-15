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
export declare class FFmpegFrameExtractor {
    private ffmpeg;
    private loadPromise;
    private frames;
    private videoInfo;
    private isDestroyed;
    private extractionAbortController;
    /**
     * Load FFmpeg WASM asynchronously.
     * Call this before any other operations.
     */
    load(onProgress?: ProgressCallback): Promise<void>;
    private _load;
    /**
     * Check if FFmpeg is loaded and ready.
     */
    isLoaded(): boolean;
    private parseFFmpegLog;
    /**
     * Probe video file to get metadata (FPS, duration, dimensions).
     * This is similar to running ffprobe.
     */
    probe(videoSource: Blob | string): Promise<VideoInfo>;
    /**
     * Extract all frames from video as ImageBitmap objects.
     * Uses chunked extraction to avoid WASM memory limits.
     *
     * @param videoSource - Video file as Blob or URL
     * @param options - Extraction options
     */
    extractFrames(videoSource: Blob | string, options?: {
        fps?: number;
        startFrame?: number;
        endFrame?: number;
        scale?: number;
        format?: "png" | "jpg";
        onProgress?: ProgressCallback;
    }): Promise<Map<number, ImageBitmap>>;
    /**
     * Extract frames in chunks for memory efficiency.
     * Useful for long videos where loading all frames at once is not feasible.
     *
     * @param videoSource - Video file as Blob or URL
     * @param chunkSize - Number of frames per chunk
     * @param onChunk - Callback when a chunk is ready
     */
    extractFramesInChunks(videoSource: Blob | string, chunkSize: number, onChunk: (frames: Map<number, ImageBitmap>, startFrame: number, endFrame: number) => void, options?: {
        fps?: number;
        onProgress?: ProgressCallback;
    }): Promise<void>;
    /**
     * Get a specific frame by number.
     */
    getFrame(frameNumber: number): ImageBitmap | null;
    /**
     * Check if a frame is available.
     */
    hasFrame(frameNumber: number): boolean;
    /**
     * Get all available frames.
     */
    getAllFrames(): Map<number, ImageBitmap>;
    /**
     * Get video information (available after probe or extractFrames).
     */
    getVideoInfo(): VideoInfo | null;
    /**
     * Get total number of extracted frames.
     */
    get frameCount(): number;
    /**
     * Clear all extracted frames from memory.
     */
    clearFrames(): void;
    /**
     * Abort any ongoing extraction.
     */
    abort(): void;
    /**
     * Clean up all resources.
     */
    destroy(): void;
}
/**
 * Get a shared FFmpegFrameExtractor instance.
 * Useful when you want to reuse the loaded FFmpeg across multiple operations.
 */
export declare function getSharedFFmpegExtractor(): FFmpegFrameExtractor;
/**
 * Destroy the shared instance.
 */
export declare function destroySharedFFmpegExtractor(): void;
