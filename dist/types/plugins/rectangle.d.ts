import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";
export interface IRectangle extends IShapeBase {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class RectangleToolPlugin extends BasePlugin<IRectangle> implements ToolPlugin<IRectangle> {
    name: keyof ShapeMap;
    move(shape: IRectangle, dx: number, dy: number): IRectangle;
    normalize(shape: IRectangle, canvasWidth: number, canvasHeight: number): IRectangle;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawRectangle(x: number, y: number, width: number, height: number): void;
    draw(shape: IRectangle): void;
    isPointerAtShape(shape: IRectangle, x: number, y: number): boolean;
}
