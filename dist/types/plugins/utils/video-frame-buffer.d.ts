import { AudioFingerprint } from "./audio-fingerprint";
export declare class VideoFrameBuffer {
    isDestroyed: boolean;
    autoHide: boolean;
    isMobile: boolean;
    transformCanvas: HTMLCanvasElement;
    transformCanvasCtx: CanvasRenderingContext2D;
    private audioExtractor;
    private audioInitPromise;
    constructor(video: HTMLVideoElement, fps: number, autoHide?: boolean);
    createTransformCanvas(): void;
    /**
     * Initialize audio fingerprinting for frame sync.
     * Call this after the video is ready.
     */
    initAudioSync(): Promise<void>;
    /**
     * Check if audio sync is available.
     */
    hasAudioSync(): boolean;
    start(): void;
    destroy(): void;
    tick(_: number, metadata: VideoFrameCallbackMetadata): boolean;
    addRequestFrameCallback(): void;
    createCanvas(): void;
    seenFrames: number;
    isCanvasSizeSet: boolean;
    setCanvasSize(): void;
    fps: number;
    frames: Map<number, ImageBitmap>;
    audioFingerprints: Map<number, AudioFingerprint>;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    get width(): number;
    get height(): number;
    hasFrame(frame: number): boolean;
    getFrame(frame: number): ImageBitmap | null;
    /**
     * Find the best matching frame number using audio fingerprint comparison.
     * Searches within a ±3 frame window around the reference frame.
     *
     * @param signature - Audio fingerprint from the main video frame
     * @param refFrameNumber - Reference frame number to search around
     * @returns Best matching frame number based on audio similarity
     */
    getFrameNumberBySignature(signature: AudioFingerprint | null, refFrameNumber: number): number;
    setFrame(frame: number, data: ImageBitmap): void;
    /**
     * Store audio fingerprint for a frame.
     */
    setAudioFingerprint(frame: number, data: AudioFingerprint): void;
    /**
     * Get audio fingerprint for a frame.
     * Falls back to extracting from audio extractor if not cached.
     */
    getAudioFingerprint(frame: number): AudioFingerprint | null;
    get totalFrames(): number;
    frameNumberFromTime(time: number): number;
}
