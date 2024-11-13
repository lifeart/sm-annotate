// https://codepen.io/lifeart/pen/xxyxKYr

import { AnnotationToolBase } from "./base";
import { isMultiTouch } from "./events/utils";
import { IShape, ShapeMap, Tool, plugins, PluginInstances } from "./plugins";
import { ToolPlugin } from "./plugins/base";
import { detectFrameRate } from "./utils/detect-framerate";
import { VideoFrameBuffer } from "./plugins/utils/video-frame-buffer";
import { playerControlsDefaultStyle, playerControlsFullScreenStyle, uiContainerDefaultStyle, uiContainerFullScreenStyle } from "./ui";

const pixelRatio = window.devicePixelRatio || 1;

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
export class AnnotationTool extends AnnotationToolBase<IShape> {
  uiContainer!: HTMLDivElement;
  playerControlsContainer!: HTMLDivElement;
  referenceVideoFrameBuffer: VideoFrameBuffer | null = null;
  videoFrameBuffer: VideoFrameBuffer | null = null;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  isMouseDown = false;
  _currentTool!: Tool | null;
  buttons: HTMLButtonElement[] = [];
  colorPicker!: HTMLInputElement;
  strokeSizePicker!: HTMLInputElement;
  plugins: PluginInstances[] = [];
  playTimeout!: number & ReturnType<typeof window.setTimeout>;
  annotatedFrameCoordinates: { x: number; y: number; frame: number }[] = [];
  prevFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.playbackFrame;
    const newFrame = Math.max(1, activeTimeFrame - 1);
    if (newFrame === this.playbackFrame) {
      this.playbackFrame = this.totalFrames - 1;
    } else {
      this.playbackFrame = newFrame;
    }
  }

  nextFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.playbackFrame;
    const newFrame = Math.min(this.totalFrames, activeTimeFrame + 1);
    if (newFrame === this.totalFrames) {
      this.playbackFrame = 1;
    } else {
      this.playbackFrame = newFrame;
    }
  }
  removeGlobalShape(shapeType: IShape['type']) {
    this.globalShapes = this.globalShapes.filter((s) => s.type !== shapeType);
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

  timeToFrame(time: number) {
    return Math.max(1, Math.round(time * this.fps));
  }

  get playbackFrame() {
    if (this.videoElement instanceof HTMLImageElement) return 1;
    return this.timeToFrame(this.videoElement.currentTime);
  }
  set playbackFrame(frame: number) {
    if (this.videoElement instanceof HTMLImageElement) return;
    const newTime = frame / this.fps;
    this.videoElement.currentTime = newTime;
    this.rvf(() => {
      this.show();
    });
  }
  plannedFn: (() => void) | null = null;
  rvf(fn: () => void) {
    this.plannedFn = fn;
  }
  get canvasWidth() {
    return this.enforcedCanvasSize?.width ?? 0;
  }
  get canvasHeight() {
    return this.enforcedCanvasSize?.height ?? 0;
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
    return pixelRatio;
  }

  constructor(videoElement: HTMLVideoElement | HTMLImageElement) {
    super();
    this.plugins = plugins.map((Plugin) => new Plugin(this));
    this.init(videoElement);
  }


  async setVideoBlob(blob: Blob, fps = this.fps) {
    const url = URL.createObjectURL(blob);
    await this.setVideoUrl(url, fps);
    this.plugins.forEach((p) => {
      p.on('videoBlobSet', blob);
    });
  }

  async setVideoUrl(url: string, fps = this.fps) {
    if (this.videoElement instanceof HTMLImageElement) return;
    const video = this.videoElement as HTMLVideoElement;
    video.src = url.toString();
    await this.videoElement.load();
    this.setFrameRate(fps);
    if (this.videoFrameBuffer) {
      this.videoFrameBuffer.destroy();
      this.videoFrameBuffer = new VideoFrameBuffer(video, fps, false);
      this.videoFrameBuffer.isMobile = this.isMobile;
    }
    this.setCanvasSize();
  }

  enableVideoFrameBuffer() {
    if (this.videoElement instanceof HTMLImageElement) return;
    this.videoFrameBuffer = new VideoFrameBuffer(
      this.videoElement,
      this.fps,
      false
    );
    this.videoFrameBuffer.isMobile = this.isMobile;
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

  updateActiveTimeFrame(mediaTime: number | undefined = undefined) {
    this.activeTimeFrame = mediaTime
      ? this.timeToFrame(mediaTime)
      : this.playbackFrame;
  }

  show() {
    this.stopAnnotationsAsVideo();
    this.updateActiveTimeFrame();
    this.showCanvas();
    this.showControls();
    this.redrawFullCanvas();
  }

  setCanvasSettings() {
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.fillStyle = this.selectedColor;
    this.ctx.lineWidth = this.selectedStrokeSize;
  }

  pluginForTool<T extends keyof ShapeMap>(tool: T): ToolPlugin<ShapeMap[T]> {
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
    this.shapes = [];
    this.globalShapes = [];
    this.currentTool = this.isMobile ? null : "curve";
  }

  setVideoStyles() {
    this.videoElement.style.objectFit = "cover";
    this.videoElement.style.objectPosition = "left top";
  }

  get frameCallbackSupported() {
    return "requestVideoFrameCallback" in HTMLVideoElement.prototype;
  }

  ct = 0;

  initFrameCounter() {
    if (!this.frameCallbackSupported) {
      setTimeout(() => {
        this.plannedFn?.();
        this.plannedFn = null;
        this.initFrameCounter();
        this.updateActiveTimeFrame();
        this.playAnnotationsAsVideo();
      }, 1000 / this.fps);
      return;
    }

    this.withVideo((video) => {
      video.requestVideoFrameCallback((_: number, metadata) => {
        if (!this.isCanvasInitialized) {
          this._setCanvasSize();
        }
        this.videoFrameBuffer?.tick(_, metadata);
        this.plannedFn?.();
        this.plannedFn = null;
        this.raf(() => {
          this.initFrameCounter();
          this.updateActiveTimeFrame(metadata.mediaTime);
          this.playAnnotationsAsVideo();
        });
      });
    });
  }

  init(videoElement: HTMLVideoElement | HTMLImageElement) {
    this.videoElement = videoElement;
    this.setVideoStyles();
    this.initFrameCounter();
    this.bindContext();
    this.initCanvas();
    this.initUI();
    this.initProperties();
    this.setCanvasSize();
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
    super.destroy();
    this.stopAnnotationsAsVideo();

    this.currentTool = null;
    this.plugins.forEach((plugin) => plugin.reset());
    this.annotatedFrameCoordinates = [];
    this.setFrameRate(DEFAULT_FPS);

    // remove stroke
    const wrapper = this.strokeSizePicker.parentElement;
    wrapper?.parentNode?.removeChild(wrapper);

    // remove reference video
    if (this.referenceVideoElement) {
      const referenceVideoWrapper = this.referenceVideoElement.parentElement;
      referenceVideoWrapper?.parentNode?.removeChild(referenceVideoWrapper);
      this.referenceVideoElement = null;
    }

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
    this.playerControlsContainer.parentElement?.removeChild(
      this.playerControlsContainer
    );

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
    this.referenceVideoFrameBuffer?.destroy();
    this.referenceVideoFrameBuffer = null;
    this.videoFrameBuffer?.destroy();
    this.videoFrameBuffer = null;
  }

  isCanvasInitialized = false;
  enforcedCanvasSize: { width: number; height: number } | null = null;

  _setCanvasSize() {
    const style = getComputedStyle(this.videoElement);
    const rawWidth = parseInt(style.width, 10);
    const video = this.videoElement as HTMLVideoElement;
    const trueAspectRatio = video.videoWidth / video.videoHeight;

    if (isNaN(rawWidth) || !video.videoWidth || !video.videoHeight) {
        this.isCanvasInitialized = false;
        this.setCanvasSettings();
        return false;
    }

    // Get the container dimensions
    const container = video.parentElement;
    const isFullscreen = !!document.fullscreenElement;
    let width = Math.min(rawWidth, video.videoWidth);
    let height = Math.floor(width / trueAspectRatio);

    if (isFullscreen && container) {
        // Calculate dimensions maintaining aspect ratio in fullscreen
        const CONTROLS_HEIGHT = 50;
        const TOOLS_HEIGHT = 40;
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight - (CONTROLS_HEIGHT + TOOLS_HEIGHT);
        const containerRatio = containerWidth / containerHeight;

        if (containerRatio > trueAspectRatio) {
            // Container is wider than video
            height = containerHeight;
            width = height * trueAspectRatio;
        } else {
            // Container is taller than video
            width = containerWidth;
            height = width / trueAspectRatio;
        }

        // Ensure video is centered and sized correctly
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.marginTop = `${TOOLS_HEIGHT}px`;
        video.style.marginBottom = `${CONTROLS_HEIGHT}px`;
    } else {
        // Normal mode sizing
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
        video.style.marginTop = '';
        video.style.marginBottom = '';
    }

    if (isFullscreen) { 
      this.playerControlsContainer.style.cssText = playerControlsFullScreenStyle;
      this.uiContainer.style.cssText = uiContainerFullScreenStyle;
    } else {
      this.playerControlsContainer.style.cssText = playerControlsDefaultStyle;
      this.uiContainer.style.cssText = uiContainerDefaultStyle;
    }

    // Update canvas dimensions
    this.isCanvasInitialized = video.videoWidth > 0 && video.videoHeight > 0;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    // Match canvas position to video
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = video.style.marginTop || '0';
    this.canvas.style.left = '0';

    // Store enforced size for other calculations
    this.enforcedCanvasSize = { width, height };
    
    // Set up the canvas context
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    this.setCanvasSettings();

    return true;
  }
  setCanvasSize() {
    if (this._setCanvasSize()) {
      this.syncVideoSizes();
      this.redrawFullCanvas();
    }
  }

  addShape(shape: IShape) {
    const serializedShape = this.serialize([shape])[0];
    this.undoStack.push([...this.shapes]);
    this.shapes.push(serializedShape);
  }

  get msPerFrame() {
    return this.fps / 1000;
  }

  syncVideoSizes() {
    this.withRefVideo((refVideo) => {
      const video = this.videoElement;
      const videoPosition = video.getBoundingClientRect();
      refVideo.style.position = "fixed";
      refVideo.style.top = `${videoPosition.top}px`;
      refVideo.style.left = `${videoPosition.left}px`;
    });
  }

  async addReferenceVideoByURL(url: string, fps = this.fps, type = "video/mp4") {
    const blob = await fetch(url).then((r) => r.blob());

    const blobs = new Blob([blob], { type });

    const mediaUrl = window.URL.createObjectURL(blobs);

    if (!this.referenceVideoElement) {
      this.referenceVideoElement = document.createElement("video");
      this.withRefVideo((refVideo) => {
        if (this.isMobile) {
          // for mobile safari we need to have this video visible to be able to play it with normal fps
          refVideo.style.zIndex = "2";
          refVideo.style.display = "block";
          refVideo.style.top = "0";
          refVideo.style.left = "0";
          refVideo.style.opacity = "0.25";
          refVideo.style.width = "20px";
          refVideo.style.height = "15px";
        } else {
          refVideo.style.zIndex = "-1";
          refVideo.style.display = "none";
          refVideo.style.width = "100px";
          refVideo.style.height = "70px";
        }

        refVideo.style.objectFit = "cover";
        refVideo.style.objectPosition = "left top";
        refVideo.muted = true;
        refVideo.volume = 0;
        refVideo.playsInline = true;
        refVideo.autoplay = false;
        refVideo.controls = false;
        refVideo.loop = true;
        this.videoElement.after(refVideo);
        this.referenceVideoFrameBuffer = new VideoFrameBuffer(refVideo, fps);
        this.referenceVideoFrameBuffer.isMobile = this.isMobile;
        this.referenceVideoFrameBuffer.start();
      });
      this.syncVideoSizes();
    } else {
      this.referenceVideoFrameBuffer?.destroy();
      this.referenceVideoFrameBuffer = new VideoFrameBuffer(
        this.referenceVideoElement,
        fps
      );
      this.referenceVideoFrameBuffer.isMobile = this.isMobile;
      this.referenceVideoFrameBuffer.start();
    }
    this.referenceVideoElement.src = mediaUrl;
    this.referenceVideoElement
      .play()
      .then(() => {
        this.showButton("compare");
      })
      .catch(() => {
        this.hideButton("compare");
      });
  }

  hideButton(tool: Tool) {
    const button = this.getButtonForTool(tool);
    button.style.display = "none";
  }
  showButton(tool: Tool) {
    const button = this.getButtonForTool(tool);
    button.style.display = "";
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
    if (isMultiTouch(event)) return;

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

  get hasGlobalOverlays() {
    return this.globalShapes.length > 0;
  }

  handleMouseMove(event: PointerEvent) {
    event.preventDefault();

    if (isMultiTouch(event)) return;

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
        if (!this.hasGlobalOverlays) {
          this.addVideoOverlay();
        }
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
    if (isMultiTouch(event)) return;

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

    for (let shape of this.deserialize(this.globalShapes)) {
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;
      this.ctx.lineWidth = shape.lineWidth;
      try {
        this.pluginForTool(shape.type).draw(shape);
      } catch (e) {
        console.error(e);
      }
    }

    for (let shape of this.deserialize(this.shapes)) {
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;
      this.ctx.lineWidth = shape.lineWidth;

      try {
        this.pluginForTool(shape.type).draw(shape);
      } catch (e) {
        console.error(e);
      }
    }

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
    if (!this.hasGlobalOverlays) {
      this.clearCanvas();
      this.addVideoOverlay();
    }
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
      shapes: this.parseShapes(
        this.stringifyShapes(this.filterNonSerializableShapes(this.shapes))
      ),
    };
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
        shapes: this.filterNonSerializableShapes(
          this.timeStack.get(frame) ?? []
        ),
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

  get totalFrames() {
    const node = this.videoElement as HTMLVideoElement;
    if (node.tagName !== "VIDEO") {
      return 1;
    }
    return Math.ceil(node.duration * this.fps);
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
  isAnnotationsAsVideoActive = false;
  stopAnnotationsAsVideo() {
    this.isAnnotationsAsVideoActive = false;
  }
  startAnnotationsAsVideo() {
    this.isAnnotationsAsVideoActive = true;
    this.playAnnotationsAsVideo();
  }
  playAnnotationsAsVideo() {
    if (!this.isAnnotationsAsVideoActive) {
      return;
    }
    if (!this.hasGlobalOverlays) {
      this.clearCanvas();
    }
    if (this.isMobile) {
      if (!this.hasGlobalOverlays) {
        this.addVideoOverlay();
      }
    } else {
      this.addVideoOverlay();
    }
    this.drawShapesOverlay();
    this.addFrameSquareOverlay();
    this.addProgressBarOverlay();
  }
}
