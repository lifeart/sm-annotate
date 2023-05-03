import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
export interface ICompare extends IShapeBase {
    type: "compare";
    x: number;
}
export declare class CompareToolPlugin extends BasePlugin<ICompare> implements ToolPlugin<ICompare> {
    name: string;
    comparisonLine: number;
    leftOpacity: number;
    rightOpacity: number;
    isDrawing: boolean;
    move(shape: ICompare, dx: number, dy: number): ICompare;
    onActivate(): void;
    onDeactivate(): void;
    normalize(shape: ICompare, canvasWidth: number): ICompare;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(): void;
    save(shape: ICompare): void;
    drawDelimiter(shape: ICompare): void;
    drawShape(shape: ICompare): void;
    draw(shape: ICompare): void;
}
