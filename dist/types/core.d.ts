import { AnnotationToolBase } from "./base";
import { IShape, ShapeMap, Tool, PluginInstances } from "./plugins";
import { ToolPlugin } from "./plugins/base";
import { VideoFrameBuffer } from "./plugins/utils/video-frame-buffer";
import { Theme } from "./ui/theme";
import { SmAnnotateConfig, LayoutMode } from "./config";
export type FrameAnnotationV1 = {
    frame: number;
    fps: number;
    version: 1;
    shapes: IShape[];
};
export declare class AnnotationTool extends AnnotationToolBase<IShape> {
    uiContainer: HTMLDivElement;
    playerControlsContainer: HTMLDivElement;
    referenceVideoFrameBuffer: VideoFrameBuffer | null;
    videoFrameBuffer: VideoFrameBuffer | null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    isMouseDown: boolean;
    _currentTool: Tool | null;
    buttons: HTMLButtonElement[];
    colorPicker: HTMLInputElement;
    strokeSizePicker: HTMLInputElement;
    plugins: PluginInstances[];
    playTimeout: number & ReturnType<typeof window.setTimeout>;
    annotatedFrameCoordinates: {
        x: number;
        y: number;
        frame: number;
    }[];
    private videoBlobUrl;
    private referenceVideoBlobUrl;
    private frameCounterTimeoutId;
    private _enforcedTotalFrames;
    isCursorOverCanvas: boolean;
    overlayOpacity: number;
    private _theme;
    private themeChangeListeners;
    config: SmAnnotateConfig;
    private layoutManager;
    private collapseController;
    private gestureHandler;
    private gestureState;
    prevFrame(): void;
    nextFrame(): void;
    /**
     * Get sorted list of frames that have annotations
     */
    getAnnotatedFrames(): number[];
    /**
     * Jump to the previous annotated frame
     */
    prevAnnotatedFrame(): void;
    /**
     * Jump to the next annotated frame
     */
    nextAnnotatedFrame(): void;
    get theme(): Theme;
    setTheme(theme: Theme): void;
    onThemeChange(listener: (theme: Theme) => void): () => void;
    /**
     * Set the layout mode for the annotation tool
     */
    setLayout(mode: LayoutMode): void;
    /**
     * Get the current layout mode
     */
    getLayout(): LayoutMode;
    /**
     * Collapse the toolbar
     */
    collapseToolbar(): void;
    /**
     * Expand the toolbar
     */
    expandToolbar(): void;
    /**
     * Toggle toolbar collapse state
     */
    toggleToolbar(): void;
    /**
     * Check if toolbar is collapsed
     */
    isToolbarCollapsed(): boolean;
    /**
     * Enable or disable gesture support
     */
    setGesturesEnabled(enabled: boolean): void;
    /**
     * Check if gestures are enabled
     */
    isGesturesEnabled(): boolean;
    /**
     * Reset zoom and pan to default
     */
    resetZoom(): void;
    /**
     * Get current zoom scale
     */
    getZoomScale(): number;
    /**
     * Apply gesture transform to canvas
     */
    private applyGestureTransform;
    removeGlobalShape(shapeType: IShape['type']): void;
    addGlobalShape(shape: IShape): void;
    get selectedColor(): string;
    get selectedStrokeSize(): number;
    get currentTool(): Tool | null;
    set currentTool(tool: Tool | null);
    fps: number;
    enableFrameRateDetection(): void;
    timeToFrame(time: number): number;
    get playbackFrame(): number;
    set playbackFrame(frame: number);
    plannedFn: (() => void) | null;
    rvf(fn: () => void): void;
    get canvasWidth(): number;
    get canvasHeight(): number;
    get aspectRatio(): number;
    get isMobile(): boolean;
    get progressBarCoordinates(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    get shapes(): IShape[];
    set shapes(shapes: IShape[]);
    get undoStack(): IShape[][];
    set undoStack(shapes: IShape[][]);
    get pixelRatio(): number;
    constructor(videoElement: HTMLVideoElement | HTMLImageElement, config?: Partial<SmAnnotateConfig>);
    setVideoBlob(blob: Blob, fps?: number): Promise<void>;
    setVideoUrl(url: string, fps?: number): Promise<void>;
    enableVideoFrameBuffer(): void;
    hide(): void;
    showControls(): void;
    hideControls(): void;
    showCanvas(): void;
    hideCanvas(): void;
    updateActiveTimeFrame(mediaTime?: number | undefined): void;
    show(): void;
    setCanvasSettings(): void;
    pluginForTool<T extends keyof ShapeMap>(tool: T): ToolPlugin<ShapeMap[T]>;
    getButtonForTool(tool: Tool): HTMLButtonElement;
    bindContext(): void;
    initProperties(): void;
    setVideoStyles(): void;
    get frameCallbackSupported(): boolean;
    ct: number;
    initFrameCounter(): void;
    init(videoElement: HTMLVideoElement | HTMLImageElement): void;
    onKeyDown(event: KeyboardEvent): void;
    handleUndo(): void;
    destroy(): void;
    isCanvasInitialized: boolean;
    enforcedCanvasSize: {
        width: number;
        height: number;
    } | null;
    _setCanvasSize(): boolean;
    setCanvasSize(): void;
    replaceShape(shape: IShape, index: number): void;
    addShape(shape: IShape): void;
    get msPerFrame(): number;
    syncVideoSizes(): void;
    addReferenceVideoByURL(url: string, fps?: number, type?: string): Promise<void>;
    hideButton(tool: Tool): void;
    showButton(tool: Tool): void;
    addSingletonShape(shape: IShape): void;
    serialize(shapes?: IShape[]): IShape[];
    deserialize(shapes: IShape[]): IShape[];
    getRelativeCoords(event: PointerEvent): {
        x: number;
        y: number;
    };
    handleMouseDown(event: PointerEvent): void;
    get isDrawing(): boolean;
    lastNavigatedFrame: number;
    isProgressBarNavigation: boolean;
    get isVideoPaused(): boolean;
    get hasGlobalOverlays(): boolean;
    handleMouseMove(event: PointerEvent): void;
    getEventX(event: PointerEvent): number;
    getEventY(event: PointerEvent): number;
    handleMouseUp(event: PointerEvent): void;
    focusOnMediaNode(): void;
    drawShapesOverlay(): void;
    clearCanvas(): void;
    frameToDataUrl(): string | null;
    redrawFullCanvas(): void;
    drawSelectionHandles(): void;
    replaceFrame(frame: number, shapes: IShape[]): void;
    addShapesToFrame(frame: number, shapes: IShape[]): void;
    setFrameRate(fps: number): void;
    stringifyShapes(shapes: IShape[]): string;
    parseShapes(shapes: string): any;
    filterNonSerializableShapes(shapes: IShape[]): IShape[];
    saveCurrentFrame(): FrameAnnotationV1;
    loadAllFrames(frames: FrameAnnotationV1[]): void;
    appendFrames(frames: FrameAnnotationV1[]): void;
    saveAllFrames(): FrameAnnotationV1[];
    getAnnotationFrame(event: PointerEvent): number | null;
    get totalFrames(): number;
    /**
     * Set a fixed total frames count, overriding the calculated value from video duration.
     * Pass null to clear the enforcement and use the calculated value.
     */
    setTotalFrames(frames: number | null): void;
    /**
     * Get the enforced total frames value, or null if using calculated value.
     */
    getEnforcedTotalFrames(): number | null;
    frameFromProgressBar(event: PointerEvent, countY?: boolean): number | null;
    hasAnnotationsForFrame(frame: number): boolean | undefined;
    isAnnotationsAsVideoActive: boolean;
    stopAnnotationsAsVideo(): void;
    startAnnotationsAsVideo(): void;
    playAnnotationsAsVideo(): void;
}
