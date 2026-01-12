import type { ShapeMap } from ".";
import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
export interface ICompare extends IShapeBase {
    type: "compare";
    x: number;
    disabled: boolean;
}
export declare class CompareToolPlugin extends BasePlugin<ICompare> implements ToolPlugin<ICompare> {
    name: keyof ShapeMap;
    comparisonLine: number;
    leftOpacity: number;
    isDrawing: boolean;
    get rightOpacity(): number;
    move(shape: ICompare, dx: number, dy: number): ICompare;
    onActivate(): void;
    onDeactivate(): void;
    normalize(shape: ICompare, canvasWidth: number): ICompare;
    onPointerDown(event: PointerEvent): void;
    onPointerMove(event: PointerEvent): void;
    onPointerUp(): void;
    removePreviousCompare(): void;
    disablePreviousCompare(): void;
    save(shape: ICompare): void;
    drawDelimiter(shape: ICompare): void;
    drawShape(shape: ICompare): void;
    draw(shape: ICompare): void;
}
