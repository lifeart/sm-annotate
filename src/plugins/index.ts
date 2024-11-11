import { IRectangle, RectangleToolPlugin } from "./rectangle";
import { CircleToolPlugin, ICircle } from "./circle";
import { CurveToolPlugin, ICurve } from "./curve";
import { ILine, LineToolPlugin } from "./line";
import { ArrowToolPlugin, IArrow } from "./arrow";
import { IText, TextToolPlugin } from "./text";
import { EraserToolPlugin, IEraser } from "./eraser";
import { IMove, MoveToolPlugin } from "./move";
import { IImage, ImageToolPlugin } from "./image";
import { ICompare, CompareToolPlugin } from "./compare";
import { IAudioPeaks, AudioPeaksPlugin } from "./audio-peaks";
import { SelectionToolPlugin, ISelection } from "./selection";

export type IShape =
  | IRectangle
  | ICircle
  | ILine
  | IArrow
  | IText
  | IEraser
  | ICurve
  | IMove
  | IImage
  | ICompare
  | IAudioPeaks
  | ISelection;

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
  image: IImage;
  compare: ICompare;
  "audio-peaks": IAudioPeaks;
  selection: ISelection;
};

export type PluginInstances = RectangleToolPlugin | CircleToolPlugin | LineToolPlugin | ArrowToolPlugin | TextToolPlugin | EraserToolPlugin | CurveToolPlugin | MoveToolPlugin | ImageToolPlugin | CompareToolPlugin | AudioPeaksPlugin | SelectionToolPlugin;

export const plugins = [
    RectangleToolPlugin,
    CircleToolPlugin,
    LineToolPlugin,
    ArrowToolPlugin,
    TextToolPlugin,
    EraserToolPlugin,
    CurveToolPlugin,
    MoveToolPlugin,
    ImageToolPlugin,
    CompareToolPlugin,
    AudioPeaksPlugin,
    SelectionToolPlugin,
]