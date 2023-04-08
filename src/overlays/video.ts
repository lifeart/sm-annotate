import { AnnotationTool } from "../core";

export function addVideoOverlay(this: AnnotationTool) {
    this.ctx.drawImage(
      this.videoElement,
      0,
      0,
      this.canvas.width / this.pixelRatio,
      this.canvas.height / this.pixelRatio
    );
  }