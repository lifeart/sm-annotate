export declare class VideoFrameBuffer {
    isDestroyed: boolean;
    constructor(video: HTMLVideoElement, fps: number);
    destroy(): void;
    addRequestFrameCallback(): void;
    createCanvas(): void;
    setCanvasSize(): void;
    fps: number;
    frames: Map<number, ImageBitmap>;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    get width(): number;
    get height(): number;
    hasFrame(frame: number): boolean;
    getFrame(frame: number): ImageBitmap | null;
    setFrame(frame: number, data: ImageBitmap): void;
    frameNumberFromTime(time: number): number;
}