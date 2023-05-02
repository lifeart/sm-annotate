import type { AnnotationTool } from "../core";

export function addVideoOverlay(this: AnnotationTool) {
  const node = this.videoElement as HTMLVideoElement;

  if (node.tagName !== "VIDEO") {
    return;
  }

  this.ctx.drawImage(
    node,
    0,
    0,
    node.videoWidth,
    node.videoHeight,
    0,
    0,
    this.canvasWidth,
    this.canvasHeight
  );
}
