import { AnnotationTool } from "../core";

export function addVideoOverlay(this: AnnotationTool) {
    this.ctx.drawImage(
      this.videoElement,
      0,
      0,
      this.canvasWidth,
      this.canvasHeight,
      0,0,this.canvasWidth,this.canvasHeight
    );
  }