import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
import { AnnotationTool } from "../core";
import type { PeakData } from "webaudio-peaks";
export interface IAudioPeaks extends IShapeBase {
    x: number;
    y: number;
}
export declare class AudioPeaksPlugin extends BasePlugin<IAudioPeaks> implements ToolPlugin<IAudioPeaks> {
    name: string;
    canvas: HTMLCanvasElement;
    drawCtx: CanvasRenderingContext2D;
    constructor(annotationTool: AnnotationTool);
    onVideoBlobSet(blob: Blob): Promise<void>;
    on(event: string, arg: unknown): void;
    extractPeaks(decodedData: AudioBuffer): Promise<PeakData>;
    setProps(peaks: PeakData): void;
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
    reset(): void;
    draw(_: IAudioPeaks): void;
    get pixelRatio(): number;
    get progressBarCoordinates(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    clearLocalCanvas(): void;
    drawOnCanvas(): void;
}
