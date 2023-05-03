import type { AnnotationTool } from "../core";

export function addVideoOverlay(this: AnnotationTool) {
  const node = this.videoElement as HTMLVideoElement;

  if (node.tagName !== "VIDEO") {
    return;
  }

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
    0,
    0,
    this.canvasWidth,
    this.canvasHeight
  );
}
