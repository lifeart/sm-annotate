import { AnnotationTool } from "../core";

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
  const totalFrames = node.duration * this.fps;

  const { x, width, height, y } = this.progressBarCoordinates;

  const coordinatesOnProgressBar = annotatedFrames.map((frame) => {
    return Math.ceil((frame / totalFrames) * width);
  });

  // draw coordinate filled blue bubbles in the bottom of canvas

  this.ctx.save();

  // draw the progress bar
  this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  this.ctx.fillRect(x, y, width, height);

  this.ctx.fillStyle = "#F3CE32";

  const recSize = 8;

  coordinatesOnProgressBar.forEach((coordinate, index) => {
    this.ctx.beginPath();
    const rx = x + coordinate;
    const ry = this.canvasHeight - 5;
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
  const currentFrame = this.playbackFrame;
  const currentFrameCoordinate =
    Math.ceil((currentFrame / totalFrames) * width) + x;

  this.ctx.fillStyle = "white";
  this.ctx.beginPath();
  const ax = currentFrameCoordinate;
  const ay = this.canvasHeight - 5;
  this.ctx.beginPath();
  this.ctx.fillRect(ax - recSize / 2, ay - recSize / 2, recSize, recSize);
  this.ctx.fill();
  this.ctx.restore();
}
