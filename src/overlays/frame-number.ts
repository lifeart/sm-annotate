import { AnnotationTool } from "../core";

export function addFrameSquareOverlay(
  this: AnnotationTool,
  frame = this.activeTimeFrame
) {
  this.ctx.save();
  this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  // put it on right bottom corner
  const width = 50;
  const height = 30;
  const fontSize = 20;
  this.ctx.fillRect(
    this.canvasWidth - width,
    this.canvasHeight - height,
    width,
    height
  );
  this.ctx.fillStyle = "white";
  this.ctx.font = `${fontSize}px sans-serif`;
  this.ctx.fillText(
    `${frame}`.padStart(3, "0"),
    this.canvasWidth - 40,
    this.canvasHeight - 7
  );
  this.ctx.restore();
}
