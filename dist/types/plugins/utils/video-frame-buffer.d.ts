declare class HistogramFrame extends Array<number> {
    id: number;
    constructor();
}
export declare class VideoFrameBuffer {
    isDestroyed: boolean;
    autoHide: boolean;
    transformCanvas: HTMLCanvasElement;
    transformCanvasCtx: CanvasRenderingContext2D;
    constructor(video: HTMLVideoElement, fps: number, autoHide?: boolean);
    createTransformCanvas(): void;
    normalizeImage(image: ImageBitmap): ImageData;
    toHistogram(image: ImageBitmap): HistogramFrame;
    imageHistogram(image: ImageData): HistogramFrame;
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
    histograms: Map<number, HistogramFrame>;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    get width(): number;
    get height(): number;
    hasFrame(frame: number): boolean;
    getFrame(frame: number): ImageBitmap | null;
    getFrameNumberBySignature(signature: HistogramFrame | null, refFrameNumber: number): number;
    setFrame(frame: number, data: ImageBitmap): void;
    setHistogram(frame: number, data: HistogramFrame): void;
    getHistogram(frame: number): HistogramFrame | null;
    get totalFrames(): number;
    frameNumberFromTime(time: number): number;
}
export {};
