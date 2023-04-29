import { AnnotationTool } from "../core";

export function addVideoOverlay(this: AnnotationTool) {
  const node = this.videoElement;

  if (node.tagName === "VIDEO") {
    this.ctx.drawImage(
      node,
      0,
      0,
      (node as HTMLVideoElement).videoWidth,
      (node as HTMLVideoElement).videoHeight,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight
    );
  }
}
