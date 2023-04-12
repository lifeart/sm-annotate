import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
export interface ICircle extends IShapeBase {
    type: "circle";
    x: number;
    y: number;
    radius: number;
}
export declare class CircleToolPlugin extends BasePlugin<ICircle> implements ToolPlugin<ICircle> {
    name: string;
    move(shape: ICircle, dx: number, dy: number): ICircle;
    normalize(shape: ICircle, canvasWidth: number, canvasHeight: number): ICircle;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawCircle(x: number, y: number, radius: number): void;
    draw(shape: ICircle): void;
}
