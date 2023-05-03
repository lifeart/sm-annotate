import {
  ButtonEventNames,
  ClipboardEventNames,
  EventNames,
  InputEventNames,
  KeyboardEventNames,
  PointerEventNames,
  VideoEventNames,
  WindowEventNames,
} from "./ui/events";

export class AnnotationToolBase<T> {
  destructors: (() => void)[] = [];
  isDestroyed = false;
  activeTimeFrame = 1;

  referenceVideoElement!: HTMLVideoElement | null;
  videoElement!: HTMLVideoElement | HTMLImageElement;

  globalShapes: T[] = [];
  timeStack = new Map<number, T[]>(); // timeFrame -> shapes
  undoTimeStack = new Map<number, T[][]>(); // timeFrame -> shapes

  cleanFrameStacks() {
    this.timeStack.clear();
    this.undoTimeStack.clear();
  }

  destroy() {
    this.destructors.forEach((destructor) => destructor());
    this.destructors = [];
    this.globalShapes = [];
    this.cleanFrameStacks();
  }

  raf(cb: () => void) {
    return requestAnimationFrame(cb);
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

  addProgressBarOverlay() {
    throw new Error("Method not implemented.");
  }

  initUI() {
    throw new Error("Method not implemented.");
  }

  initCanvas() {
    throw new Error("Method not implemented.");
  }

  addFrameSquareOverlay(_ = this.activeTimeFrame) {
    throw new Error("Method not implemented.");
  }

  addVideoOverlay() {
    throw new Error("Method not implemented.");
  }

  withRefVideo(cb: (video: HTMLVideoElement) => void) {
    if (this.isDestroyed) {
      return;
    }
    if (this.referenceVideoElement) {
      cb(this.referenceVideoElement);
    }
  }

  withVideo(cb: (video: HTMLVideoElement) => void) {
    if (this.isDestroyed) {
      return;
    }
    const video = this.videoElement as HTMLVideoElement;
    if (!video || video.tagName !== "VIDEO") {
        return;
    }
    cb(video);
  }
}
