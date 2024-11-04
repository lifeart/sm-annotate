import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";
export type IPoint = {
    x: number;
    y: number;
};
export interface ICurve extends IShapeBase {
    type: "curve";
    points: IPoint[];
}
export declare class CurveToolPlugin extends BasePlugin<ICurve> implements ToolPlugin<ICurve> {
    name: keyof ShapeMap;
    curvePoints: IPoint[];
    zoomScale: number;
    zoomRadius: number;
    zoomCtx: CanvasRenderingContext2D | null;
    zoomCanvas: HTMLCanvasElement | null;
    move(shape: ICurve, dx: number, dy: number): ICurve;
    colorMap: {
        r: string;
        g: string;
        b: string;
        y: string;
    };
    onKeyPress: (e: KeyboardEvent) => void;
    onActivate(): void;
    onDeactivate(): void;
    normalize(shape: ICurve, canvasWidth: number, canvasHeight: number): ICurve;
    draw(shape: ICurve): void;
    reset(): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawCurve(shape: Pick<ICurve, "points" | "lineWidth">): void;
    initZoomCanvas(): void;
    drawZoomCircle(x: number, y: number, isEnabled?: boolean): void;
}
