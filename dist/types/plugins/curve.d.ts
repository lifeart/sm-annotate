import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
export type IPoint = {
    x: number;
    y: number;
};
export interface ICurve extends IShapeBase {
    type: "curve";
    points: IPoint[];
}
export declare class CurveToolPlugin extends BasePlugin<ICurve> implements ToolPlugin<ICurve> {
    name: string;
    curvePoints: IPoint[];
    normalize(shape: ICurve, canvasWidth: number, canvasHeight: number): ICurve;
    draw(shape: ICurve): void;
    reset(): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawCurve(shape: Pick<ICurve, "points">): void;
}
