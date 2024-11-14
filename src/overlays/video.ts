import type { AnnotationTool } from "../core";

export function addVideoOverlay(this: AnnotationTool) {
  const node = this.videoElement as HTMLVideoElement;

  if (node.tagName !== "VIDEO") {
    return;
  }

  // Get video element's bounding rectangle
  const videoRect = node.getBoundingClientRect();
  const canvasRect = this.canvas.getBoundingClientRect();

  // Calculate offset relative to canvas
  const offsetX = videoRect.left - canvasRect.left;
  const offsetY = videoRect.top - canvasRect.top;

  const frameNumber = this.videoFrameBuffer?.frameNumberFromTime(
    node.currentTime
  );

  const videoFrame = this.videoFrameBuffer?.getFrame(frameNumber || 0) ?? node;
  const vw = videoFrame ? videoFrame.width : node.videoWidth;
  const vh = videoFrame ? videoFrame.height : node.videoHeight;

  this.ctx.drawImage(
    videoFrame,
    0,
    0,
    vw,
    vh,
    offsetX,
    offsetY,
    this.canvasWidth,
    this.canvasHeight
  );
}
