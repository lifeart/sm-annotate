import { IRectangle, RectangleToolPlugin } from "./rectangle";
import { CircleToolPlugin, ICircle } from "./circle";
import { CurveToolPlugin, ICurve } from "./curve";
import { ILine, LineToolPlugin } from "./line";
import { ArrowToolPlugin, IArrow } from "./arrow";
import { IText, TextToolPlugin } from "./text";
import { EraserToolPlugin, IEraser } from "./eraser";
import { IMove, MoveToolPlugin } from "./move";

export type IShape =
  | IRectangle
  | ICircle
  | ILine
  | IArrow
  | IText
  | IEraser
  | ICurve
  | IMove;

export type Tool = IShape["type"];

export interface ShapeMap {
  rectangle: IRectangle;
  circle: ICircle;
  line: ILine;
  arrow: IArrow;
  text: IText;
  eraser: IEraser;
  curve: ICurve;
  move: IMove;
}

export type PluginInstances = RectangleToolPlugin | CircleToolPlugin | LineToolPlugin | ArrowToolPlugin | TextToolPlugin | EraserToolPlugin | CurveToolPlugin | MoveToolPlugin;

export const plugins = [
    RectangleToolPlugin,
    CircleToolPlugin,
    LineToolPlugin,
    ArrowToolPlugin,
    TextToolPlugin,
    EraserToolPlugin,
    CurveToolPlugin,
    MoveToolPlugin,
]