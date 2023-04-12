import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
export interface IEraser extends IShapeBase {
    type: "eraser";
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare class EraserToolPlugin extends BasePlugin<IEraser> implements ToolPlugin<IEraser> {
    name: string;
    move(shape: IEraser, dx: number, dy: number): IEraser;
    normalize(shape: IEraser, canvasWidth: number, canvasHeight: number): IEraser;
    draw(shape: IEraser): void;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(event: PointerEvent): void;
    drawEraser(x: number, y: number, width: number, height: number): void;
}
