import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
import { AnnotationTool } from "../core";
export interface IAudioPeaks extends IShapeBase {
    x: number;
    y: number;
}
export declare class AudioPeaksPlugin extends BasePlugin<IAudioPeaks> implements ToolPlugin<IAudioPeaks> {
    name: string;
    constructor(annotationTool: AnnotationTool);
    init(blob: ArrayBuffer): Promise<void>;
    move(shape: IAudioPeaks, dx: number, dy: number): IAudioPeaks;
    normalize(shape: IAudioPeaks, canvasWidth: number, canvasHeight: number): IAudioPeaks;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    props: {
        scale: number;
        peaks: Int8Array[] | Int16Array[] | Int32Array[];
        theme: {
            waveOutlineColor: string;
            waveFillColor: string;
            waveProgressColor: string;
        };
        waveHeight: number;
        bits: number;
    };
    draw(shape: IAudioPeaks): void;
}
