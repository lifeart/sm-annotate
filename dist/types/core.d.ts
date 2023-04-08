import { IShape, ShapeMap, Tool, PluginInstances } from "./plugins";
import { ToolPlugin } from "./plugins/base";
type FrameAnnotationV1 = {
    frame: number;
    fps: number;
    version: 1;
    shapes: IShape[];
};
type PointerEventNames = "pointerdown" | "pointermove" | "pointerup" | "pointercancel" | "pointerover";
type KeyboardEventNames = "keydown";
type ButtonEventNames = "click";
type InputEventNames = "input" | "change";
type ClipboardEventNames = "copy" | "paste" | "cut";
type VideoEventNames = "timeupdate" | "play" | "pause" | "ended" | "seek" | "stalled" | "waiting" | "error";
type WindowEventNames = "resize";
export declare class AnnotationTool {
    videoElement: HTMLVideoElement | HTMLImageElement;
    uiContainer: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    isMouseDown: boolean;
    _currentTool: Tool | null;
    activeTimeFrame: number;
    buttons: HTMLButtonElement[];
    colorPicker: HTMLInputElement;
    strokeSizePicker: HTMLInputElement;
    destructors: (() => void)[];
    plugins: PluginInstances[];
    isDestroyed: boolean;
    timeStack: Map<number, IShape[]>;
    undoTimeStack: Map<number, IShape[][]>;
    playTimeout: number & ReturnType<typeof window.setTimeout>;
    annotatedFrameCoordinates: {
        x: number;
        y: number;
        frame: number;
    }[];
    prevFrame(): void;
    nextFrame(): void;
    get selectedColor(): string;
    get selectedStrokeSize(): number;
    get currentTool(): Tool | null;
    set currentTool(tool: Tool | null);
    fps: number;
    enableFrameRateDetection(): void;
    get playbackFrame(): number;
    set playbackFrame(frame: number);
    get canvasWidth(): number;
    get canvasHeight(): number;
    get progressBarCoordinates(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    get videoClientRect(): DOMRect;
    get shapes(): IShape[];
    set shapes(shapes: IShape[]);
    get undoStack(): IShape[][];
    set undoStack(shapes: IShape[][]);
    get pixelRatio(): number;
    constructor(videoElement: HTMLVideoElement | HTMLImageElement);
    hide(): void;
    showControls(): void;
    hideControls(): void;
    showCanvas(): void;
    hideCanvas(): void;
    show(): void;
    setCanvasSettings(): void;
    pluginForTool<T extends Tool>(tool: T): ToolPlugin<ShapeMap[T]>;
    getButtonForTool(tool: Tool): HTMLButtonElement;
    bindContext(): void;
    initProperties(): void;
    init(videoElement: HTMLVideoElement | HTMLImageElement): void;
    addEvent(node: HTMLInputElement, event: InputEventNames, callback: (e: Event) => void): void;
    addEvent(node: typeof document, event: ClipboardEventNames, callback: (e: ClipboardEvent) => void): void;
    addEvent(node: HTMLVideoElement, event: VideoEventNames, callback: (e: Event) => void): void;
    addEvent(node: HTMLVideoElement, event: KeyboardEventNames, callback: (e: KeyboardEvent) => void): void;
    addEvent(node: HTMLButtonElement, event: ButtonEventNames, callback: (e: Event) => void): void;
    addEvent(node: HTMLCanvasElement, event: PointerEventNames, callback: (e: PointerEvent) => void): void;
    addEvent(node: typeof document, event: KeyboardEventNames, callback: (e: KeyboardEvent) => void): void;
    addEvent(node: typeof window, event: WindowEventNames, callback: (e: Event) => void): void;
    initCanvas(): void;
    onKeyDown(event: KeyboardEvent): void;
    handleUndo(): void;
    destroy(): void;
    setCanvasSize(): void;
    isMultiTouch(event: PointerEvent): boolean;
    addShape(shape: IShape): void;
    serialize(shapes?: IShape[]): IShape[];
    deserialize(shapes: IShape[]): IShape[];
    getRelativeCoords(event: PointerEvent): {
        x: number;
        y: number;
    };
    handleMouseDown(event: PointerEvent): void;
    get isDrawing(): boolean;
    handleMouseMove(event: PointerEvent): void;
    getEventX(event: PointerEvent): number;
    getEventY(event: PointerEvent): number;
    handleMouseUp(event: PointerEvent): void;
    focusOnMediaNode(): void;
    drawShapesOverlay(): void;
    clearCanvas(): void;
    imageForCapture(): HTMLImageElement | null;
    redrawFullCanvas(): void;
    replaceFrame(frame: number, shapes: IShape[]): void;
    addShapesToFrame(frame: number, shapes: IShape[]): void;
    setFrameRate(fps: number): void;
    saveCurrentFrame(): FrameAnnotationV1;
    addFrameSquareOverlay(_?: number): void;
    addVideoOverlay(): void;
    cleanFrameStacks(): void;
    loadAllFrames(frames: FrameAnnotationV1[]): void;
    saveAllFrames(): FrameAnnotationV1[];
    getAnnotationFrame(event: PointerEvent): number | null;
    frameFromProgressBar(event: PointerEvent): number | null;
    addProgressBarOverlay(): void;
    initUI(): void;
    stopAnnotationsAsVideo(): void;
    hasAnnotationsForFrame(frame: number): boolean | undefined;
    playAnnotationsAsVideo(): void;
    fillCanvas(): void;
}
export {};
