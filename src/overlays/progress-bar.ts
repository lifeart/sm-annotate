import type { AnnotationTool } from "../core";
import { colorMap } from "../plugins/utils/color-map";

export function addProgressBarOverlay(this: AnnotationTool) {
  const node = this.videoElement as HTMLVideoElement;
  if (node.tagName !== "VIDEO") {
    return;
  }

  this.annotatedFrameCoordinates = [];

  const allFrames = Array.from(this.timeStack.keys());
  const annotatedFrames = allFrames.filter((frame) => {
    return this.timeStack.get(frame)?.length;
  });
  const totalFrames = this.totalFrames;

  const { x, width, height, y } = this.progressBarCoordinates;

  const coordinatesOnProgressBar = annotatedFrames.map((frame) => {
    return Math.round((frame / totalFrames) * width);
  });

  // draw coordinate filled blue bubbles in the bottom of canvas

  this.ctx.save();

  // draw the progress bar
  this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  this.ctx.fillRect(x, y, width, height);

  this.ctx.fillStyle = colorMap.y;

  const recSize = this.isMobile ? 16 : 8;

  coordinatesOnProgressBar.forEach((coordinate, index) => {
    this.ctx.beginPath();
    const rx = x + coordinate;
    const ry = this.canvasHeight - (height/2);
    // draw square
    this.ctx.fillRect(rx - recSize / 2, ry - recSize / 2, recSize, recSize);
    // add to annotatedFrameCoordinates
    this.annotatedFrameCoordinates.push({
      x: rx,
      y: ry,
      frame: annotatedFrames[index],
    });
  });

  // draw current frame indicator
  // Use lastNavigatedFrame during progress bar drag for smoother visual feedback
  // (video.currentTime updates async, so playbackFrame may lag behind user input)
  const currentFrame = this.isProgressBarNavigation && this.lastNavigatedFrame > 0
    ? this.lastNavigatedFrame
    : this.playbackFrame;
  const currentFrameCoordinate =
    Math.round((currentFrame / totalFrames) * width) + x;

  this.ctx.fillStyle = "white";
  this.ctx.beginPath();
  const ax = currentFrameCoordinate;
  const ay = this.canvasHeight - (height / 2);
  this.ctx.beginPath();
  this.ctx.fillRect(ax - recSize / 2, ay - recSize / 2, recSize, recSize);
  this.ctx.fill();
  this.ctx.restore();
}
