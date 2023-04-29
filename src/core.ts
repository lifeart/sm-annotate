// https://codepen.io/lifeart/pen/xxyxKYr

import { IShape, ShapeMap, Tool, plugins, PluginInstances } from "./plugins";
import { ToolPlugin } from "./plugins/base";
import { ButtonEventNames, ClipboardEventNames, EventNames, InputEventNames, KeyboardEventNames, PointerEventNames, VideoEventNames, WindowEventNames } from "./ui/events";
import { detectFrameRate } from "./utils/detect-framerate";

// @todo
// - [ ] video may be resized not only on window resize
// - [ ] reset draw state on tool change
// - [ ] add player controls (buttons) to canvas
// - [ ] support overlay mode (play drawed shapes on top of video)
// - [ ] add button to clear all shapes
// - [ ] add button to clear all shapes for current frame
// - [ ] add button to export current frame as image
// - [ ] add button to export all frames as images

export type FrameAnnotationV1 = {
  frame: number;
  fps: number;
  version: 1;
  shapes: IShape[];
};

const DEFAULT_FPS = 25;


export class AnnotationTool {
  videoElement!: HTMLVideoElement | HTMLImageElement;
  referenceVideoElement!: HTMLVideoElement;
  uiContainer!: HTMLDivElement;
  playerControlsContainer!: HTMLDivElement;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  isMouseDown = false;
  _currentTool!: Tool | null;
  activeTimeFrame = 1;
  buttons: HTMLButtonElement[] = [];
  colorPicker!: HTMLInputElement;
  strokeSizePicker!: HTMLInputElement;
  destructors: (() => void)[] = [];
  plugins: PluginInstances[] = [];
  isDestroyed = false;
  globalShapes: IShape[] = [];
  timeStack = new Map<number, IShape[]>(); // timeFrame -> shapes
  undoTimeStack = new Map<number, IShape[][]>(); // timeFrame -> shapes
  playTimeout!: number & ReturnType<typeof window.setTimeout>;
  annotatedFrameCoordinates: { x: number; y: number; frame: number }[] = [];
  prevFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.activeTimeFrame;
    const newFrame = Math.max(1, activeTimeFrame - 1);
    this.playbackFrame = newFrame;
  }
  nextFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.activeTimeFrame;
    const newFrame = Math.min(
      (this.videoElement as HTMLVideoElement).duration * this.fps,
      activeTimeFrame + 1
    );
    this.playbackFrame = newFrame;
  }

  addGlobalShape(shape: IShape) {
    this.globalShapes.push(shape);
  }

  get selectedColor() {
    return this.colorPicker.value;
  }
  get selectedStrokeSize() {
    return this.strokeSizePicker.valueAsNumber;
  }
  get currentTool() {
    return this._currentTool;
  }
  set currentTool(tool: Tool | null) {
    const prevTool = this._currentTool;
    if (prevTool) {
      this.getButtonForTool(prevTool).classList.remove("active");
      this.pluginForTool(prevTool).onDeactivate();
    }
    this._currentTool = tool;
    this.canvas.style.cursor = tool ? "pointer" : "default";
    if (tool) {
      this.getButtonForTool(tool).classList.add("active");
      this.pluginForTool(tool).onActivate();
    }
  }

  fps = DEFAULT_FPS;

  enableFrameRateDetection() {
    // check if we already have frame rate detector

    if (this.destructors.find((d) => d.name === "frameRateDetector")) return;

    const video = this.videoElement;
    if (video.tagName === "IMG") return;
    const destructor = detectFrameRate(video as HTMLVideoElement, (fps) => {
      this.fps = fps;
    });
    Object.defineProperty(destructor, "name", { value: "frameRateDetector" });
    this.destructors.push(destructor);
  }

  get playbackFrame() {
    if (this.videoElement instanceof HTMLImageElement) return 1;
    const result = Math.round(this.videoElement.currentTime * this.fps);
    return Math.max(1, result);
  }
  set playbackFrame(frame: number) {
    if (this.videoElement instanceof HTMLImageElement) return;
    const newTime = frame / this.fps;
    this.videoElement.currentTime = newTime;
    this.syncTime();
    this.show();
  }
  get canvasWidth() {
    return this.canvas.width / this.pixelRatio;
  }
  get canvasHeight() {
    return this.canvas.height / this.pixelRatio;
  }
  get aspectRatio() {
    return this.canvasWidth / this.canvasHeight;
  }
  get isMobile() {
    return window.innerWidth < 960;
  }
  get progressBarCoordinates() {
    const height = this.isMobile ? 30 : 10;
    const progressBarLeftMargin = 5;
    const frameOverlayOffset = 55;
    const progressBarWidth =
      this.canvasWidth - progressBarLeftMargin - frameOverlayOffset;
    const x = progressBarLeftMargin;
    const y = this.canvasHeight - height;
    const width = progressBarWidth;
    return { x, y, width, height };
  }

  get videoClientRect() {
    return this.videoElement.getBoundingClientRect();
  }
  get shapes() {
    if (!this.timeStack.has(this.activeTimeFrame)) {
      this.timeStack.set(this.activeTimeFrame, []);
    }
    return this.timeStack.get(this.activeTimeFrame) as IShape[];
  }
  set shapes(shapes: IShape[]) {
    this.timeStack.set(this.activeTimeFrame, shapes);
  }

  get undoStack() {
    if (!this.undoTimeStack.has(this.activeTimeFrame)) {
      this.undoTimeStack.set(this.activeTimeFrame, []);
    }
    return this.undoTimeStack.get(this.activeTimeFrame) as IShape[][];
  }
  set undoStack(shapes: IShape[][]) {
    this.undoTimeStack.set(this.activeTimeFrame, shapes);
  }
  get pixelRatio() {
    return window.devicePixelRatio || 1;
  }

  constructor(videoElement: HTMLVideoElement | HTMLImageElement) {
    this.plugins = plugins.map((Plugin) => new Plugin(this));
    this.init(videoElement);
  }

  hide() {
    this.stopAnnotationsAsVideo();
    this.hideControls();
    this.hideCanvas();
  }
  showControls() {
    this.uiContainer.style.display = "block";
  }
  hideControls() {
    this.uiContainer.style.display = "none";
  }
  showCanvas() {
    this.canvas.style.display = "block";
  }
  hideCanvas() {
    this.canvas.style.display = "none";
  }

  show() {
    this.stopAnnotationsAsVideo();
    this.activeTimeFrame = this.playbackFrame;
    this.showCanvas();
    this.showControls();
    this.redrawFullCanvas();
  }

  setCanvasSettings() {
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.fillStyle = this.selectedColor;
    this.ctx.lineWidth = this.selectedStrokeSize;
  }

  pluginForTool<T extends Tool>(tool: T): ToolPlugin<ShapeMap[T]> {
    if (this.isDestroyed) {
      throw new Error("AnnotationTool is destroyed");
    }
    const maybePlugin = this.plugins.find((p) => p.name === tool);
    if (!maybePlugin) {
      throw new Error(`No plugin found for tool ${tool}`);
    }
    return maybePlugin as unknown as ToolPlugin<ShapeMap[T]>;
  }

  getButtonForTool(tool: Tool): HTMLButtonElement {
    return this.buttons.find(
      (button) => button.dataset.tool === tool
    ) as HTMLButtonElement;
  }

  bindContext() {
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.setCanvasSize = this.setCanvasSize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  initProperties() {
    this.isDestroyed = false;
    this.isProgressBarNavigation = false;
    this.currentTool = null;
    this.shapes = [];
    this.globalShapes = [];
  }

  init(videoElement: HTMLVideoElement | HTMLImageElement) {
    this.videoElement = videoElement;
    this.bindContext();
    this.initCanvas();
    this.initUI();
    this.initProperties();
    this.setCanvasSize();
    this.fillCanvas();
    this.setCanvasSettings();
    this.currentTool = this.isMobile ? null : "curve";
  }
  addEvent(
    node: HTMLInputElement,
    event: InputEventNames,
    callback: (e: Event) => void
  ): void;
  addEvent(
    node: typeof document,
    event: ClipboardEventNames,
    callback: (e: ClipboardEvent) => void
  ): void;
  addEvent(
    node: typeof document,
    event: ButtonEventNames,
    callback: (e: PointerEvent) => void
  ): void;
  addEvent(
    node: HTMLVideoElement,
    event: VideoEventNames,
    callback: (e: Event) => void
  ): void;
  addEvent(
    node: HTMLVideoElement,
    event: KeyboardEventNames,
    callback: (e: KeyboardEvent) => void
  ): void;
  addEvent(
    node: HTMLButtonElement,
    event: ButtonEventNames,
    callback: (e: Event) => void
  ): void;
  addEvent(
    node: HTMLCanvasElement,
    event: PointerEventNames,
    callback: (e: PointerEvent) => void
  ): void;
  addEvent(
    node: typeof document,
    event: KeyboardEventNames,
    callback: (e: KeyboardEvent) => void
  ): void;
  addEvent(
    node: typeof window,
    event: WindowEventNames,
    callback: (e: Event) => void
  ): void;
  addEvent(
    node:
      | HTMLInputElement
      | HTMLVideoElement
      | HTMLCanvasElement
      | HTMLButtonElement
      | typeof document
      | typeof window,
    event: EventNames,
    callback:
      | ((e: PointerEvent) => void)
      | ((e: KeyboardEvent) => void)
      | ((e: Event) => void)
      | ((e: ClipboardEvent) => void)
  ) {
    type EventArgs = Parameters<typeof callback>;
    const safeCallback = (e: EventArgs[0]) => {
      if (this.isDestroyed) return;
      callback(e as PointerEvent & KeyboardEvent & Event & ClipboardEvent);
    };

    node.addEventListener(event, safeCallback);
    this.destructors.push(() => {
      node.removeEventListener(event, safeCallback);
    });
  }

  initCanvas() {
    throw new Error("Method not implemented.");
  }

  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      this.handleUndo();
    }
  }

  removeLastShape() {
    this.shapes.pop();
    this.redrawFullCanvas();
  }

  handleUndo() {
    if (this.undoStack.length > 0) {
      this.shapes = this.undoStack.pop() as IShape[];
      this.redrawFullCanvas();
    }
  }

  destroy() {
    if (this.isDestroyed) return;

    this.destructors.forEach((destructor) => destructor());
    this.stopAnnotationsAsVideo();
    this.destructors = [];
    this.globalShapes = [];

    this._currentTool = null;
    this.plugins.forEach((plugin) => plugin.reset());
    this.annotatedFrameCoordinates = [];
    this.setFrameRate(DEFAULT_FPS);
    this.cleanFrameStacks();

    // remove stroke
    const wrapper = this.strokeSizePicker.parentElement;
    wrapper?.parentNode?.removeChild(wrapper);

    // remove color picker
    const colorPickerWrapper = this.colorPicker.parentElement;
    colorPickerWrapper?.parentNode?.removeChild(colorPickerWrapper);

    // remove buttons
    this.buttons.forEach((button) => {
      button.parentNode?.removeChild(button);
    });
    this.buttons = [];

    // remove ui container
    this.uiContainer.parentNode?.removeChild(this.uiContainer);

    // remove canvas
    this.canvas.parentNode?.removeChild(this.canvas);
    this.playerControlsContainer.parentElement?.removeChild(this.playerControlsContainer);

    const keysToDelete: Array<keyof typeof this> = [
      "strokeSizePicker",
      "colorPicker",
      "uiContainer",
      "playerControlsContainer",
      "canvas",
      "ctx",
      "videoElement",
    ];

    keysToDelete.forEach((key) => {
      delete this[key];
    });

    this.activeTimeFrame = 0;
    this.isDestroyed = true;
  }

  setCanvasSize() {
    const videoOffset = this.videoClientRect;
    this.canvas.width = videoOffset.width * this.pixelRatio;
    this.canvas.height = videoOffset.height * this.pixelRatio;
    this.canvas.style.width = `${videoOffset.width}px`;
    this.canvas.style.height = `${videoOffset.height}px`;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    this.redrawFullCanvas();
    this.setCanvasSettings();
    this.syncVideoSizes();
  }

  isMultiTouch(event: PointerEvent) {
    return event.pointerType === "touch" && event.isPrimary === false;
  }

  addShape(shape: IShape) {
    const serializedShape = this.serialize([shape])[0];
    this.undoStack.push([...this.shapes]);
    this.shapes.push(serializedShape);
  }

  syncTime() {
    if (!this.referenceVideoElement) {
      return;
    }
    this.referenceVideoElement.currentTime = this.videoElement.currentTime;
  }

  syncVideoSizes() {
    if (!this.referenceVideoElement) {
      return;
    }
    const video = this.videoElement;

    const videoPosition = video.getBoundingClientRect();
    this.referenceVideoElement.style.position = "fixed";
    this.referenceVideoElement.style.top = `${videoPosition.top}px`;
    this.referenceVideoElement.style.left = `${videoPosition.left}px`;
    // const s = getComputedStyle(video);
    // this.referenceVideoElement.style.width = s.width;
    // this.referenceVideoElement.style.height = s.height;
  }

  async addReferenceVideoByURL(url: string) {
    const blob = await fetch(url).then((r) => r.blob());

    const blobs = new Blob([blob], { type: "video/mp4" });
  
    const mediaUrl = window.URL.createObjectURL(blobs);
  
    if (!this.referenceVideoElement) {
      this.referenceVideoElement = document.createElement("video");
      this.referenceVideoElement.style.zIndex = `-1`;
      this.referenceVideoElement.style.display = "none";
      this.referenceVideoElement.muted = true;
      this.referenceVideoElement.autoplay = false;
      this.referenceVideoElement.loop = true;
      this.videoElement.after(this.referenceVideoElement);
      this.syncVideoSizes();
    }
    this.referenceVideoElement.src = mediaUrl;
  }

  addSingletonShape(shape: IShape) {
    const serializedShape = this.serialize([shape])[0];
    const filteredShapes = this.shapes.filter((s) => s.type !== shape.type);
    this.replaceFrame(this.playbackFrame, [...filteredShapes, serializedShape]);
  }

  serialize(shapes: IShape[] = this.shapes): IShape[] {
    const canvasWidth = this.canvasWidth;
    const canvasHeight = this.canvasHeight;
    return shapes.map((shape) => {
      const pluginForShape = this.pluginForTool(shape.type);
      return pluginForShape.normalize(shape, canvasWidth, canvasHeight);
    });
  }

  deserialize(shapes: IShape[]): IShape[] {
    // we need to scale the shapes to the current canvas size
    const canvasWidth = 1 / this.canvasWidth;
    const canvasHeight = 1 / this.canvasHeight;
    return shapes.map((shape) => {
      const pluginForShape = this.pluginForTool(shape.type);
      return pluginForShape.normalize(shape, canvasWidth, canvasHeight);
    });
  }

  getRelativeCoords(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: this.getEventX(event) - rect.left,
      y: this.getEventY(event) - rect.top,
    };
  }

  handleMouseDown(event: PointerEvent) {
    event.preventDefault();
    this.isMouseDown = true;
    if (this.isMultiTouch(event)) return;

    const genericFrame = this.frameFromProgressBar(event, true);
    if (genericFrame) {
      this.isProgressBarNavigation = true;
      const frame = this.getAnnotationFrame(event);
      if (this.isVideoPaused) {
        if (frame !== null) {
          this.playbackFrame = frame;
        } else {
          this.playbackFrame = genericFrame;
        }
      }
      return;
    }
    if (this.currentTool) {
      this.pluginForTool(this.currentTool).onPointerDown(event);
    }
  }

  get isDrawing() {
    if (!this.currentTool) {
      return false;
    }
    const activePlugin = this.pluginForTool(this.currentTool);
    return activePlugin.isDrawing;
  }

  lastNavigatedFrame = 0;

  isProgressBarNavigation = false;

  get isVideoPaused() {
    if (this.videoElement.tagName === "VIDEO") {
      return (this.videoElement as HTMLVideoElement).paused;
    }
    return true;
  }

  handleMouseMove(event: PointerEvent) {
    event.preventDefault();

    if (this.isMultiTouch(event)) return;

    if (this.isMouseDown) {
      const maybeFrame = this.isProgressBarNavigation
        ? this.frameFromProgressBar(event, false)
        : null;
      if (maybeFrame !== null && !this.isDrawing) {
        if (maybeFrame === this.lastNavigatedFrame) {
          return;
        }
        this.lastNavigatedFrame = maybeFrame;
        if (this.isVideoPaused) {
          this.playbackFrame = maybeFrame;
        }
        return;
      } else {
        this.hideControls();
        this.clearCanvas();
        this.addVideoOverlay();
        this.drawShapesOverlay();
      }
    } else {
      this.redrawFullCanvas();
    }

    if (this.currentTool) {
      this.pluginForTool(this.currentTool).onPointerMove(event);
    }
  }

  getEventX(event: PointerEvent) {
    return event.clientX;
  }
  getEventY(event: PointerEvent) {
    return event.clientY;
  }

  handleMouseUp(event: PointerEvent) {
    this.isMouseDown = false;
    this.isProgressBarNavigation = false;

    this.showControls();
    if (this.isMultiTouch(event)) return;

    if (this.currentTool) {
      this.pluginForTool(this.currentTool).onPointerUp(event);
    }

    this.redrawFullCanvas();
  }

  focusOnMediaNode() {
    this.videoElement.focus();
  }

  drawShapesOverlay() {
    const prevSettings = {
      strokeStyle: this.ctx.strokeStyle,
      fillStyle: this.ctx.fillStyle,
      lineWidth: this.ctx.lineWidth,
    };

    this.deserialize(this.globalShapes).forEach((shape) => {
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;
      this.ctx.lineWidth = shape.lineWidth;
      try {
        this.pluginForTool(shape.type).draw(shape);
      } catch (e) {
        console.error(e);
      }
    });

    this.deserialize(this.shapes).forEach((shape) => {
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;
      this.ctx.lineWidth = shape.lineWidth;

      try {
        this.pluginForTool(shape.type).draw(shape);
      } catch (e) {
        console.error(e);
      }
    });

    this.ctx.strokeStyle = prevSettings.strokeStyle;
    this.ctx.fillStyle = prevSettings.fillStyle;
    this.ctx.lineWidth = prevSettings.lineWidth;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  frameToDataUrl() {
    try {
      this.clearCanvas();
      this.addVideoOverlay();
      this.addFrameSquareOverlay();
      this.drawShapesOverlay();
      const data = this.canvas.toDataURL("image/png");
      this.redrawFullCanvas();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  redrawFullCanvas() {
    this.clearCanvas();
    this.addVideoOverlay();
    this.drawShapesOverlay();
    this.addFrameSquareOverlay();
    this.addProgressBarOverlay();
  }

  replaceFrame(frame: number, shapes: IShape[]) {
    this.timeStack.set(frame, this.parseShapes(this.stringifyShapes(shapes)));
  }

  addShapesToFrame(frame: number, shapes: IShape[]) {
    const existingShapes = this.timeStack.get(frame) || [];
    this.timeStack.set(frame, [
      ...existingShapes,
      ...(this.parseShapes(this.stringifyShapes(shapes)) as IShape[]),
    ]);
  }

  setFrameRate(fps: number) {
    this.destructors.find((d) => d.name === "frameRateDetector")?.();
    this.fps = fps;
  }

  stringifyShapes(shapes: IShape[]) {
    return JSON.stringify(shapes, (key, value) => {
      if (key === "image") {
        return (value as HTMLImageElement).src;
      }
      return value; 
    });
  }
  parseShapes(shapes: string) {
    return JSON.parse(shapes, (key, value) => {
      if (key === "image") {
        const img = new Image();
        img.src = value;
        return img;
      }
      return value;
    });
  }

  filterNonSerializableShapes(shapes: IShape[]) {
    return shapes.filter((shape) => {
      if (shape.type === "image") {
        return false;
      } else {
        return true;
      }
    });
  }

  saveCurrentFrame(): FrameAnnotationV1 {
    return {
      frame: this.playbackFrame,
      version: 1,
      fps: this.fps,
      shapes: this.parseShapes(this.stringifyShapes(this.filterNonSerializableShapes(this.shapes))),
    };
  }

  addFrameSquareOverlay(_ = this.activeTimeFrame) {
    throw new Error("Method not implemented.");
  }

  addVideoOverlay() {
    throw new Error("Method not implemented.");
  }

  cleanFrameStacks() {
    this.timeStack.clear();
    this.undoTimeStack.clear();
  }

  loadAllFrames(frames: FrameAnnotationV1[]) {
    this.cleanFrameStacks();
    frames.forEach((frame) => {
      this.timeStack.set(frame.frame, frame.shapes);
    });
  }

  appendFrames(frames: FrameAnnotationV1[]) {
    frames.forEach((frame) => {
      this.addShapesToFrame(frame.frame, frame.shapes);
    });
  }

  saveAllFrames(): FrameAnnotationV1[] {
    const allFrames = Array.from(this.timeStack.keys());
    const annotatedFrames = allFrames.filter((frame) => {
      return this.timeStack.get(frame)?.length;
    });
    const result: FrameAnnotationV1[] = annotatedFrames.map((frame) => {
      return {
        frame,
        fps: this.fps,
        version: 1,
        shapes: this.filterNonSerializableShapes(this.timeStack.get(frame) ?? []),
      };
    });
    return result;
  }

  getAnnotationFrame(event: PointerEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const offset = this.isMobile ? 10 : 5;
    const frame =
      this.annotatedFrameCoordinates.find((coordinate) => {
        return (
          x >= coordinate.x - offset &&
          x <= coordinate.x + offset &&
          y >= coordinate.y - offset &&
          y <= coordinate.y + offset
        );
      })?.frame ?? null;
    return frame;
  }

  frameFromProgressBar(event: PointerEvent, countY: boolean = true) {
    const node = this.videoElement as HTMLVideoElement;
    if (node.tagName !== "VIDEO") {
      return null;
    }

    const { x, width, height, y } = this.progressBarCoordinates;
    const x1 = event.offsetX;
    const y1 = event.offsetY;

    if (countY) {
      if (x1 >= x && x1 <= x + width && y1 >= y && y1 <= y + height) {
        const frame = Math.ceil(
          ((x1 - x) / width) * (node.duration * this.fps)
        );
        return frame;
      }
      return null;
    } else {
      if (x1 >= x && x1 <= x + width) {
        const frame = Math.ceil(
          ((x1 - x) / width) * (node.duration * this.fps)
        );
        return frame;
      }
      return null;
    }
  }
  addProgressBarOverlay() {
    throw new Error("Method not implemented.");
  }

  initUI() {
    throw new Error("Method not implemented.");
  }

  stopAnnotationsAsVideo() {
    clearTimeout(this.playTimeout);
  }
  hasAnnotationsForFrame(frame: number) {
    if (this.globalShapes.length > 0) {
      return true;
    }
    if (this.timeStack.has(frame)) {
      const shapes = this.timeStack.get(frame);
      return shapes && shapes.length > 0;
    }
    return false;
  }
  playAnnotationsAsVideo() {
    this.stopAnnotationsAsVideo();
    const currentVideFrame = this.playbackFrame;

    if (this.hasAnnotationsForFrame(currentVideFrame)) {
      this.showCanvas();
      this.activeTimeFrame = currentVideFrame;
      this.syncTime();
      this.clearCanvas();
      this.drawShapesOverlay();
    } else {
      this.hideCanvas();
    }
    const nextFrameDelay = 1000 / this.fps;
    this.playTimeout = window.setTimeout(() => {
      this.playAnnotationsAsVideo();
    }, nextFrameDelay) as number & ReturnType<typeof window.setTimeout>;
  }

  fillCanvas() {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Semi-transparent black
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.restore();
  }
}
