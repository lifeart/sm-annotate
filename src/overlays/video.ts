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

  // Always use activeTimeFrame to ensure video frame and shapes stay in sync
  // activeTimeFrame is set via updateActiveTimeFrame() which is called before drawing
  const frameNumber = this.activeTimeFrame;

  // Priority: FFmpeg frames > VideoFrameBuffer > video element
  // FFmpeg frames provide precise frame-accurate rendering
  let videoFrame: ImageBitmap | HTMLVideoElement | null = null;
  let vw: number;
  let vh: number;

  // Try FFmpeg extracted frames first (most accurate)
  const ffmpegFrame = this.ffmpegFrameExtractor?.getFrame(frameNumber || 1);
  if (ffmpegFrame) {
    videoFrame = ffmpegFrame;
    vw = ffmpegFrame.width;
    vh = ffmpegFrame.height;
  } else {
    // Fall back to VideoFrameBuffer or video element
    const bufferFrame = this.videoFrameBuffer?.getFrame(frameNumber || 0);
    if (bufferFrame) {
      videoFrame = bufferFrame;
      vw = bufferFrame.width;
      vh = bufferFrame.height;
    } else {
      videoFrame = node;
      vw = node.videoWidth;
      vh = node.videoHeight;
    }
  }

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
