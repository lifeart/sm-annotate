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
    this.addEvent(window, "resize", this.setCanvasSize);
    this.addEvent(document, "keydown", this.onKeyDown);
}