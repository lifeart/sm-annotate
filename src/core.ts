// https://codepen.io/lifeart/pen/xxyxKYr

import { AnnotationToolBase } from "./base";
import { isMultiTouch } from "./events/utils";
import { IShape, ShapeMap, Tool, plugins, PluginInstances } from "./plugins";
import { ToolPlugin } from "./plugins/base";
import { detectFrameRate } from "./utils/detect-framerate";
class FrameSyncBucket {
  promise!: Promise<any>;
  resolve!: (value: any) => void;
  reject!: (reason?: any) => void;
  timeout!: number;
  constructor() {
    this.init();
  }
  release(time: number | undefined = undefined) {
    clearTimeout(this.timeout);
    if (time !== undefined) {
      const now = performance.now();
      const delay = time - now;
      if (delay > 0) {
        this.timeout = setTimeout(() => {
          this.resolve(true);
        }, delay);
      } else {
        this.resolve(true);
      }
    } else {
      this.resolve(true);
    }
  }
  init() {
    clearTimeout(this.timeout);
    if (this.reject) {
      this.reject(true);
    }
    let resolve: (value: any) => void;
    let reject: (reason?: any) => void;
    let isResolved = false;
    let t2!: number;
    const p = new Promise((res, rej) => {
      resolve = (v) => {
        clearTimeout(t2);
        if (isResolved) {
          return;
        }
        isResolved = true;
        res(v);
        this.init();
      }
      reject = () => {
        clearTimeout(this.timeout);
        clearTimeout(t2);
        if (isResolved) {
          return;
        }
        isResolved = true;
        rej(true);
        this.init();
      }
    });
    this.promise = p;
    this.resolve = resolve!;
    this.reject = reject!;
    t2 = setTimeout(() => {
      this.resolve(true);
    }, 32);
  }
}

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
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  isMouseDown = false;
  _currentTool!: Tool | null;
  buttons: HTMLButtonElement[] = [];
  colorPicker!: HTMLInputElement;
  strokeSizePicker!: HTMLInputElement;
  plugins: PluginInstances[] = [];
  frameSyncBucket = new FrameSyncBucket();
  playTimeout!: number & ReturnType<typeof window.setTimeout>;
  annotatedFrameCoordinates: { x: number; y: number; frame: number }[] = [];
  prevFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.activeTimeFrame;
    const newFrame = Math.max(1, activeTimeFrame - 1);
    if (newFrame === this.playbackFrame) {
      this.playbackFrame = this.totalFrames;
    } else {
      this.playbackFrame = newFrame;
    }
  }

  nextFrame() {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=66631
    // may float +-1 frame
    const activeTimeFrame = this.activeTimeFrame;
    const newFrame = Math.min(
      this.totalFrames,
      activeTimeFrame + 1
    );

    if (newFrame === this.totalFrames) {
      this.playbackFrame = 1;
    } else {
      this.playbackFrame = newFrame;
    }
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
    super();
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

  updateActiveTimeFrame() {
    this.activeTimeFrame = this.playbackFrame;
  }

  async show() {
    this.stopAnnotationsAsVideo();
    this.updateActiveTimeFrame();
    this.showCanvas();
    this.showControls();
    await this.redrawFullCanvas();
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
    this.shapes = [];
    this.globalShapes = [];
    this.currentTool = this.isMobile ? null : "curve";
  }

  setVideoStyles() {
    this.videoElement.style.objectFit = "cover";
    this.videoElement.style.objectPosition = "left top";
  }
  
  get frameCallbackSupported() {
    return 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
  }

  ct = 0;
  
  initFrameCounter() {
    if (!this.frameCallbackSupported) {
      setTimeout(() => {
        this.updateActiveTimeFrame();
        this.frameSyncBucket.release();
        this.initFrameCounter();
      } , 1000 / this.fps);
      return;
    }

    let syncPromise = new Promise(async (resolve) => {
    const [metadata1, metadata2]: VideoFrameCallbackMetadata[] = await Promise.all([
        new Promise((r1) => {
          this.withVideo((video) => {
            video.requestVideoFrameCallback((_: number, metadata) => {
              r1(metadata);
            })
          })
        }),
        new Promise((r2) => {
          this.withRefVideo((video) => {
            video.requestVideoFrameCallback((_: number, metadata) => {
              r2(metadata);
            })
          });
          if (!this.referenceVideoElement) {
            r2({ mediaTime: 0 });
          }
        })
      ]);

      if (!this.referenceVideoElement) {
        this.updateActiveTimeFrame();
        this.frameSyncBucket.release(metadata1.expectedDisplayTime);
        return resolve(true);
      }

      const video = this.videoElement;
      const mainVideo = this.referenceVideoElement;

      const fSyncDiff = metadata2.mediaTime - metadata1.mediaTime;
      const frameTime = 1 / this.fps;
      if (metadata1.mediaTime !== metadata2.mediaTime) {
        if (fSyncDiff > 0) {
          this.ct++;
          console.log('frame sync >', fSyncDiff, frameTime, this.ct);
          if (this.ct > 10) {
            video.currentTime = Math.max(metadata1.mediaTime, metadata2.mediaTime);
          } else if (this.ct >= 3) {
            video.currentTime = mainVideo.currentTime - fSyncDiff;
          } else if (this.ct < 3 && this.ct > 0) {
            video.currentTime = mainVideo.currentTime + frameTime;
          } else {
            video.currentTime = mainVideo.currentTime;
          }
        } else {
          this.ct--;
          console.log('frame sync <', fSyncDiff, frameTime, this.ct);
          if (this.ct < -10) {
            video.currentTime = Math.max(metadata2.mediaTime, metadata1.mediaTime);
          } else {
            video.currentTime = mainVideo.currentTime + frameTime + Math.abs(fSyncDiff);
          }
        }
        this.updateActiveTimeFrame();
      } else {
        this.ct = 0;
        this.updateActiveTimeFrame();
        this.frameSyncBucket.release(Math.max(metadata1.expectedDisplayTime, metadata2.expectedDisplayTime));
      }
      resolve(true);
      this.initFrameCounter();

    });

    return syncPromise;
  }

  waitForFrameSync() {
    return this.frameSyncBucket.promise;
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

  async removeLastShape() {
    this.shapes.pop();
    await this.redrawFullCanvas();
  }

  async handleUndo() {
    if (this.undoStack.length > 0) {
      this.shapes = this.undoStack.pop() as IShape[];
      await this.redrawFullCanvas();
    }
  }

  destroy() {
    if (this.isDestroyed) return;

    super.destroy();
    this.stopAnnotationsAsVideo();
    
    this._currentTool = null;
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
  }

  async setCanvasSize() {
    const videoOffset = this.videoElement.getBoundingClientRect();
    this.canvas.width = videoOffset.width * this.pixelRatio;
    this.canvas.height = videoOffset.height * this.pixelRatio;
    this.canvas.style.width = `${videoOffset.width}px`;
    this.canvas.style.height = `${videoOffset.height}px`;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    await this.redrawFullCanvas();
    this.setCanvasSettings();
    this.syncVideoSizes();
  }

  addShape(shape: IShape) {
    const serializedShape = this.serialize([shape])[0];
    this.undoStack.push([...this.shapes]);
    this.shapes.push(serializedShape);
  }

  syncTime(force = false, newTime: null | number = null) {
    const video = this.videoElement as HTMLVideoElement;
    if (!video || video.tagName !== "VIDEO") {
      return;
    }
    if (this.frameCallbackSupported) {
      if (!video.paused) {
        return;
      }
    }
    const currentTime = newTime === null ? video.currentTime : newTime;
    this.withRefVideo((refVideo) => {
      if (refVideo.readyState < 4) {
        return;
      }
      if (!force && !this.globalShapes.length) {
        return;
      }
      const diff = Math.abs(refVideo.currentTime - currentTime);
      if (diff >= this.msPerFrame / 3) {
        refVideo.currentTime = currentTime;
      }
    });
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

  async addReferenceVideoByURL(url: string | URL) {
    const blob = await fetch(url).then((r) => r.blob());

    const blobs = new Blob([blob], { type: "video/mp4" });

    const mediaUrl = window.URL.createObjectURL(blobs);

    if (!this.referenceVideoElement) {
      this.referenceVideoElement = document.createElement("video");
      this.withRefVideo((refVideo) => {
        refVideo.style.zIndex = `-1`;
        refVideo.style.display = "none";
        refVideo.style.objectFit = "cover";
        refVideo.style.objectPosition = "left top";
        refVideo.muted = true;
        refVideo.playsInline = true;
        refVideo.autoplay = false;
        refVideo.controls = false;
        refVideo.loop = true;
        this.videoElement.after(refVideo);
      });
      this.syncVideoSizes();
    }
    this.referenceVideoElement.src = mediaUrl;
    this.showButton("compare");
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

  async handleMouseMove(event: PointerEvent) {
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
        await this.drawShapesOverlay();
      }
    } else {
      await this.redrawFullCanvas();
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

  async handleMouseUp(event: PointerEvent) {
    this.isMouseDown = false;
    this.isProgressBarNavigation = false;

    this.showControls();
    if (isMultiTouch(event)) return;

    if (this.currentTool) {
      this.pluginForTool(this.currentTool).onPointerUp(event);
    }

    await this.redrawFullCanvas();
  }

  focusOnMediaNode() {
    this.videoElement.focus();
  }

  async drawShapesOverlay() {
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
        await this.pluginForTool(shape.type).draw(shape);
      } catch (e) {
        console.error(e);
      }
    }

    for (let shape of this.deserialize(this.shapes)) {
      this.ctx.strokeStyle = shape.strokeStyle;
      this.ctx.fillStyle = shape.fillStyle;
      this.ctx.lineWidth = shape.lineWidth;

      try {
        await this.pluginForTool(shape.type).draw(shape);
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

  async frameToDataUrl() {
    try {
      this.clearCanvas();
      this.addVideoOverlay();
      this.addFrameSquareOverlay();
      await this.drawShapesOverlay();
      const data = this.canvas.toDataURL("image/png");
      await this.redrawFullCanvas();
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async redrawFullCanvas() {
    this.clearCanvas();
    if (!this.hasGlobalOverlays) {
      this.addVideoOverlay();
    }
    await this.drawShapesOverlay();
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
  async playAnnotationsAsVideo() {
    if (!this.isAnnotationsAsVideoActive) {
      return;
    }
      
    this.updateActiveTimeFrame();
    this.syncTime();
    this.clearCanvas();
    await this.drawShapesOverlay();
  
    this.raf(() => {
      this.syncTime();
    });
    this.waitForFrameSync().finally(() => {
      this.playAnnotationsAsVideo();
    });
  }
}
