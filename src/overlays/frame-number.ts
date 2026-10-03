import type { AnnotationTool } from "../core";

export function addFrameSquareOverlay(
  this: AnnotationTool,
  frame = this.activeTimeFrame
) {
  this.ctx.save();
  this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  // put it on right bottom corner, wide enough for 4+ digit frame numbers
  const fontSize = 20;
  const label = `${frame}`.padStart(3, "0");
  this.ctx.font = `${fontSize}px sans-serif`;
  const width = Math.max(50, Math.ceil(this.ctx.measureText(label).width) + 20);
  const height = 30;
  this.ctx.fillRect(
    this.canvasWidth - width,
    this.canvasHeight - height,
    width,
    height
  );
  this.ctx.fillStyle = "white";
  this.ctx.fillText(
    label,
    this.canvasWidth - width + 10,
    this.canvasHeight - 7
  );
  this.ctx.restore();
}
