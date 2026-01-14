// https://codepen.io/lifeart/pen/xxyxKYr

import { AnnotationToolBase } from "./base";
import { isMultiTouch } from "./events/utils";
import { IShape, ShapeMap, Tool, plugins, PluginInstances } from "./plugins";
import { ToolPlugin } from "./plugins/base";
import { detectFrameRate } from "./utils/detect-framerate";
import { VideoFrameBuffer } from "./plugins/utils/video-frame-buffer";
import { Theme, injectThemeStyles } from "./ui/theme";
import { SmAnnotateConfig, LayoutMode, mergeConfig } from "./config";
import { LayoutManager } from "./ui/layout";
import { CollapseController } from "./ui/collapse-controller";
import { GestureHandler, GestureState } from "./gestures/gesture-handler";

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
  // Track blob URLs for cleanup to prevent memory leaks
  private videoBlobUrl: string | null = null;
  private referenceVideoBlobUrl: string | null = null;
  private frameCounterTimeoutId: ReturnType<typeof setTimeout> | null = null;
  // Enforced total frames count (overrides calculated value from video duration)
  private _enforcedTotalFrames: number | null = null;
  // Track cursor hover state for showing progress bar during playback
  isCursorOverCanvas = false;
  // Overlay opacity for compare mode (0 = off, 0.25, 0.5, 0.7, 1)
  overlayOpacity: number = 0.7;
  // Theme for UI elements
  private _theme: Theme = 'dark';
  // Listeners for theme changes
  private themeChangeListeners: ((theme: Theme) => void)[] = [];
  // Configuration for the annotation tool
  config: SmAnnotateConfig;
  // Layout manager for switching between layouts
  private layoutManager: LayoutManager | null = null;
  // Collapse controller for toolbar visibility
  private collapseController: CollapseController | null = null;
  // Gesture handler for pinch-to-zoom and pan
  private gestureHandler: GestureHandler | null = null;
  // Current gesture transform state
  private gestureState: GestureState = { scale: 1, panX: 0, panY: 0 };
  prevFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.playbackFrame;
    const newFrame = activeTimeFrame - 1;
    if (newFrame < 1) {
      this.playbackFrame = this.totalFrames;
    } else {
      this.playbackFrame = newFrame;
    }
  }

  nextFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.playbackFrame;
    const newFrame = activeTimeFrame + 1;
    if (newFrame > this.totalFrames) {
      this.playbackFrame = 1;
    } else {
      this.playbackFrame = newFrame;
    }
  }

  /**
   * Get sorted list of frames that have annotations
   */
  getAnnotatedFrames(): number[] {
    const frames: number[] = [];
    this.timeStack.forEach((shapes, frame) => {
      if (shapes && shapes.length > 0) {
        frames.push(frame);
      }
    });
    return frames.sort((a, b) => a - b);
  }

  /**
   * Jump to the previous annotated frame
   */
  prevAnnotatedFrame() {
    const annotatedFrames = this.getAnnotatedFrames();
    if (annotatedFrames.length === 0) return;

    const currentFrame = this.playbackFrame;
    // Find the last frame that is less than current
    for (let i = annotatedFrames.length - 1; i >= 0; i--) {
      if (annotatedFrames[i] < currentFrame) {
        this.playbackFrame = annotatedFrames[i];
        return;
      }
    }
    // Wrap around to the last annotated frame
    this.playbackFrame = annotatedFrames[annotatedFrames.length - 1];
  }

  /**
   * Jump to the next annotated frame
   */
  nextAnnotatedFrame() {
    const annotatedFrames = this.getAnnotatedFrames();
    if (annotatedFrames.length === 0) return;

    const currentFrame = this.playbackFrame;
    // Find the first frame that is greater than current
    for (const frame of annotatedFrames) {
      if (frame > currentFrame) {
        this.playbackFrame = frame;
        return;
      }
    }
    // Wrap around to the first annotated frame
    this.playbackFrame = annotatedFrames[0];
  }

  get theme(): Theme {
    return this._theme;
  }

  setTheme(theme: Theme) {
    this._theme = theme;
    injectThemeStyles(theme);
    this.themeChangeListeners.forEach(listener => listener(theme));
  }

  onThemeChange(listener: (theme: Theme) => void) {
    this.themeChangeListeners.push(listener);
    return () => {
      const index = this.themeChangeListeners.indexOf(listener);
      if (index !== -1) {
        this.themeChangeListeners.splice(index, 1);
      }
    };
  }

  // ==================== LAYOUT API ====================

  /**
   * Set the layout mode for the annotation tool
   */
  setLayout(mode: LayoutMode): void {
    if (!this.layoutManager) {
      this.layoutManager = new LayoutManager(this);
    }
    this.layoutManager.setLayout(mode, {
      sidebarPosition: this.config.toolbar.sidebarPosition,
    });
  }

  /**
   * Get the current layout mode
   */
  getLayout(): LayoutMode {
    return this.layoutManager?.getCurrentLayout() ?? this.config.layout;
  }

  // ==================== COLLAPSE API ====================

  /**
   * Collapse the toolbar
   */
  collapseToolbar(): void {
    this.collapseController?.collapse();
  }

  /**
   * Expand the toolbar
   */
  expandToolbar(): void {
    this.collapseController?.expand();
  }

  /**
   * Toggle toolbar collapse state
   */
  toggleToolbar(): void {
    this.collapseController?.toggle();
  }

  /**
   * Check if toolbar is collapsed
   */
  isToolbarCollapsed(): boolean {
    return this.collapseController?.collapsed ?? false;
  }

  // ==================== GESTURE API ====================

  /**
   * Enable or disable gesture support
   */
  setGesturesEnabled(enabled: boolean): void {
    if (enabled && !this.gestureHandler) {
      this.gestureHandler = new GestureHandler(this.canvas, (state) => {
        this.applyGestureTransform(state);
      });
      this.gestureHandler.init();
    } else if (!enabled && this.gestureHandler) {
      this.gestureHandler.destroy();
      this.gestureHandler = null;
      this.resetZoom();
    }
  }

  /**
   * Check if gestures are enabled
   */
  isGesturesEnabled(): boolean {
    return this.gestureHandler !== null;
  }

  /**
   * Reset zoom and pan to default
   */
  resetZoom(): void {
    this.gestureState = { scale: 1, panX: 0, panY: 0 };
    this.gestureHandler?.reset();
    this.redrawFullCanvas();
  }

  /**
   * Get current zoom scale
   */
  getZoomScale(): number {
    return this.gestureState.scale;
  }

  /**
   * Apply gesture transform to canvas
   */
  private applyGestureTransform(state: GestureState): void {
    this.gestureState = state;
    this.redrawFullCanvas();
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
    if (this.canvasHeight === 0) {
      return 0;
    }
    return this.canvasWidth / this.canvasHeight;
  }
  get isMobile() {
    const breakpoint = this.config?.mobile?.breakpoint ?? 960;
    return window.innerWidth < breakpoint;
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

  constructor(
    videoElement: HTMLVideoElement | HTMLImageElement,
    config?: Partial<SmAnnotateConfig>
  ) {
    super();
    this.config = mergeConfig(config);
    this._theme = this.config.theme;
    this.plugins = plugins.map((Plugin) => new Plugin(this));
    this.init(videoElement);
  }


  async setVideoBlob(blob: Blob, fps = this.fps) {
    // Revoke previous blob URL to prevent memory leak
    if (this.videoBlobUrl) {
      URL.revokeObjectURL(this.videoBlobUrl);
    }
    const url = URL.createObjectURL(blob);
    this.videoBlobUrl = url;
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
    this.uiContainer.style.display = "";
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
    // Initialize theme
    injectThemeStyles(this._theme);

    // Initialize layout manager and set configured layout
    this.layoutManager = new LayoutManager(this);
    this.layoutManager.setLayout(this.config.layout, {
      sidebarPosition: this.config.toolbar.sidebarPosition,
    });

    // Initialize collapse controller on mobile if enabled
    if (this.isMobile && this.config.mobile.collapsibleToolbars) {
      this.collapseController = new CollapseController(
        this.uiContainer,
        this.config.mobile.autoCollapse
      );
      this.collapseController.init();
    }

    // Initialize gesture handler if enabled on mobile
    if (this.isMobile && this.config.mobile.gesturesEnabled) {
      this.gestureHandler = new GestureHandler(this.canvas, (state) => {
        this.applyGestureTransform(state);
      });
      this.gestureHandler.init();
    }
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
      this.frameCounterTimeoutId = setTimeout(() => {
        if (this.isDestroyed) return;
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

    // Clear frame counter timeout to prevent memory leak
    if (this.frameCounterTimeoutId) {
      clearTimeout(this.frameCounterTimeoutId);
      this.frameCounterTimeoutId = null;
    }

    // Revoke blob URLs to prevent memory leak
    if (this.videoBlobUrl) {
      URL.revokeObjectURL(this.videoBlobUrl);
      this.videoBlobUrl = null;
    }
    if (this.referenceVideoBlobUrl) {
      URL.revokeObjectURL(this.referenceVideoBlobUrl);
      this.referenceVideoBlobUrl = null;
    }

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

    // Cleanup layout, collapse, and gesture handlers
    this.layoutManager?.destroy();
    this.layoutManager = null;
    this.collapseController?.destroy();
    this.collapseController = null;
    this.gestureHandler?.destroy();
    this.gestureHandler = null;
    this.gestureState = { scale: 1, panX: 0, panY: 0 };
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

    // Update canvas dimensions
    this.isCanvasInitialized = video.videoWidth > 0 && video.videoHeight > 0;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Match canvas position to video - account for container padding and video margins
    this.canvas.style.position = 'absolute';
    // Use video's offsetTop to correctly position canvas over video
    const videoTop = video.offsetTop;
    const videoLeft = video.offsetLeft;
    this.canvas.style.top = `${videoTop}px`;
    this.canvas.style.left = `${videoLeft}px`;

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

  replaceShape(shape: IShape, index: number) {
    const serializedShape = this.serialize([shape])[0];
    this.undoStack.push([...this.shapes]);
    this.shapes[index] = serializedShape;
  }
  addShape(shape: IShape) {
    const serializedShape = this.serialize([shape])[0];
    this.undoStack.push([...this.shapes]);
    this.shapes.push(serializedShape);
  }

  get msPerFrame() {
    return 1000 / this.fps;
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

    // Revoke previous reference video blob URL to prevent memory leak
    if (this.referenceVideoBlobUrl) {
      URL.revokeObjectURL(this.referenceVideoBlobUrl);
    }
    const mediaUrl = window.URL.createObjectURL(blobs);
    this.referenceVideoBlobUrl = mediaUrl;

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

    // Skip single-touch events when two-finger gesture is active
    if (this.gestureHandler?.hasTwoFingers()) return;

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

    // Auto-collapse toolbar when drawing starts on mobile
    if (this.currentTool && this.collapseController?.autoCollapseEnabled) {
      this.collapseController.collapse();
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

    // Auto-expand toolbar when drawing ends on mobile
    if (this.collapseController?.autoCollapseEnabled) {
      this.collapseController.expand();
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
      globalAlpha: this.ctx.globalAlpha,
    };

    // Apply gesture transform (zoom/pan) if active
    const hasTransform = this.gestureState.scale !== 1 ||
                         this.gestureState.panX !== 0 ||
                         this.gestureState.panY !== 0;
    if (hasTransform) {
      this.ctx.save();
      this.ctx.translate(this.gestureState.panX, this.gestureState.panY);
      // Scale from center of canvas
      const cx = this.canvasWidth / 2;
      const cy = this.canvasHeight / 2;
      this.ctx.translate(cx, cy);
      this.ctx.scale(this.gestureState.scale, this.gestureState.scale);
      this.ctx.translate(-cx, -cy);
    }

    for (let shape of this.deserialize(this.globalShapes)) {
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;
      this.ctx.lineWidth = shape.lineWidth;
      this.ctx.globalAlpha = shape.opacity ?? 1;
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
      this.ctx.globalAlpha = shape.opacity ?? 1;

      try {
        this.pluginForTool(shape.type).draw(shape);
      } catch (e) {
        console.error(e);
      }
    }

    // Restore transform if applied
    if (hasTransform) {
      this.ctx.restore();
    }

    this.ctx.strokeStyle = prevSettings.strokeStyle;
    this.ctx.fillStyle = prevSettings.fillStyle;
    this.ctx.lineWidth = prevSettings.lineWidth;
    this.ctx.globalAlpha = prevSettings.globalAlpha;
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
    this.drawSelectionHandles();
    this.addFrameSquareOverlay();
    this.addProgressBarOverlay();
  }

  drawSelectionHandles() {
    // Only draw handles when move tool is active
    if (this.currentTool !== 'move') return;

    try {
      const movePlugin = this.pluginForTool('move') as import('./plugins/move').MoveToolPlugin;
      movePlugin.drawResizeHandles();
    } catch {
      // Move plugin not available
    }
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
    // Tolerance should be larger than the marker size (8px desktop, 16px mobile)
    // to make clicking easier. Using 12px desktop, 20px mobile.
    const tolerance = this.isMobile ? 20 : 12;
    const frame =
      this.annotatedFrameCoordinates.find((coordinate) => {
        return (
          x >= coordinate.x - tolerance &&
          x <= coordinate.x + tolerance &&
          y >= coordinate.y - tolerance &&
          y <= coordinate.y + tolerance
        );
      })?.frame ?? null;
    return frame;
  }

  get totalFrames() {
    // Use enforced value if set
    if (this._enforcedTotalFrames !== null) {
      return this._enforcedTotalFrames;
    }
    const node = this.videoElement as HTMLVideoElement;
    if (node.tagName !== "VIDEO") {
      return 1;
    }
    return Math.round(node.duration * this.fps);
  }

  /**
   * Set a fixed total frames count, overriding the calculated value from video duration.
   * Pass null to clear the enforcement and use the calculated value.
   */
  setTotalFrames(frames: number | null) {
    this._enforcedTotalFrames = frames !== null ? Math.max(1, Math.round(frames)) : null;
  }

  /**
   * Get the enforced total frames value, or null if using calculated value.
   */
  getEnforcedTotalFrames(): number | null {
    return this._enforcedTotalFrames;
  }

  frameFromProgressBar(event: PointerEvent, countY: boolean = true) {
    const node = this.videoElement as HTMLVideoElement;
    if (node.tagName !== "VIDEO") {
      return null;
    }

    const { x, width, height, y } = this.progressBarCoordinates;
    const x1 = event.offsetX;
    const y1 = event.offsetY;

    const calculateFrame = () => {
      // Use Math.round for consistency with other frame calculations
      // Ensure frame is within valid 1-indexed range
      const rawFrame = Math.round(((x1 - x) / width) * this.totalFrames);
      return Math.max(1, Math.min(rawFrame, this.totalFrames));
    };

    if (countY) {
      if (x1 >= x && x1 <= x + width && y1 >= y && y1 <= y + height) {
        return calculateFrame();
      }
      return null;
    } else {
      if (x1 >= x && x1 <= x + width) {
        return calculateFrame();
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
    // Show frame overlay and progress bar only when cursor is over canvas (or on mobile)
    if (this.isCursorOverCanvas || this.isMobile) {
      this.addFrameSquareOverlay();
      this.addProgressBarOverlay();
    }
  }
}
