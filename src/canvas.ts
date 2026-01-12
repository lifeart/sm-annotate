import { AnnotationTool } from "./core";

export function initCanvas(this: AnnotationTool) {
    this.canvas = document.createElement("canvas");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.ctx = this.canvas.getContext("2d")!;
    this.videoElement.parentNode?.insertBefore(
      this.canvas,
      this.videoElement.nextSibling
    );

    this.canvas.style.position = "absolute";
    this.canvas.style.backgroundColor = 'transparent';
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "1";

    this.addEvent(this.canvas, "pointerdown", this.handleMouseDown);
    this.addEvent(this.canvas, "pointermove", this.handleMouseMove);
    this.addEvent(this.canvas, "pointerup", this.handleMouseUp);
    this.addEvent(this.canvas, "pointercancel", this.handleMouseUp);
    // Track cursor hover state for showing progress bar during video playback
    this.addEvent(this.canvas, "pointerenter", () => {
      this.isCursorOverCanvas = true;
    });
    this.addEvent(this.canvas, "pointerleave", () => {
      this.isCursorOverCanvas = false;
    });
    // better mobile workflow - use addEvent for proper cleanup on destroy
    this.addEvent(this.canvas, "touchmove", (e: TouchEvent) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
    });
    this.addEvent(window, "resize", this.setCanvasSize);
    this.addEvent(document, "keydown", this.onKeyDown);
}