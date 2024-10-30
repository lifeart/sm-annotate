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
    move(shape: ICurve, dx: number, dy: number): ICurve;
    normalize(shape: ICurve, canvasWidth: number, canvasHeight: number): ICurve;
    draw(shape: ICurve): void;
    reset(): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawCurve(shape: Pick<ICurve, "points" | "lineWidth">): void;
}
