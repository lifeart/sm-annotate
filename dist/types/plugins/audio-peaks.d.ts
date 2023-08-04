import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
import { AnnotationTool } from "../core";
export interface IAudioPeaks extends IShapeBase {
    x: number;
    y: number;
}
export declare class AudioPeaksPlugin extends BasePlugin<IAudioPeaks> implements ToolPlugin<IAudioPeaks> {
    name: string;
    canvas: HTMLCanvasElement;
    drawCtx: CanvasRenderingContext2D;
    constructor(annotationTool: AnnotationTool);
    init(blob: ArrayBuffer): Promise<void>;
    initCanvas(): void;
    move(shape: IAudioPeaks, dx: number, dy: number): IAudioPeaks;
    normalize(shape: IAudioPeaks, canvasWidth: number, canvasHeight: number): IAudioPeaks;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    props: {
        peaks: Int8Array | Int16Array | Int32Array;
        theme: {
            waveOutlineColor: string;
            waveFillColor: string;
            waveProgressColor: string;
        };
        waveHeight: number;
        bits: number;
    };
    draw(shape: IAudioPeaks): void;
    get pixelRatio(): number;
    get progressBarCoordinates(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    drawOnCanvas(): void;
}
