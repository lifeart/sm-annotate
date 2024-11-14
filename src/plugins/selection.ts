import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export interface ISelection extends IShapeBase {
  type: "selection";
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SelectionToolPlugin
  extends BasePlugin<ISelection>
  implements ToolPlugin<ISelection>
{
  name = "selection" as keyof ShapeMap;
  selectedArea: ImageData | null = null;

  move(shape: ISelection, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }

  normalize(
    shape: ISelection,
    canvasWidth: number,
    canvasHeight: number
  ): ISelection {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
      width: shape.width / canvasWidth,
      height: shape.height / canvasHeight,
    };
  }

  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    this.startX = x;
    this.startY = y;
    this.isDrawing = true;
    this.selectedArea = null;
  }

  onPointerMove(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    // Clear previous drawing and redraw video frame
    this.annotationTool.clearCanvas();
    this.annotationTool.addVideoOverlay();

    // Draw selection rectangle
    this.drawSelectionRect(
      this.startX,
      this.startY,
      x - this.startX,
      y - this.startY
    );
  }

  onPointerUp(event: PointerEvent) {
    if (!this.isDrawing) {
      return;
    }
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    // Calculate dimensions accounting for direction
    const startX = Math.min(x, this.startX);
    const startY = Math.min(y, this.startY);
    const width = Math.abs(x - this.startX);
    const height = Math.abs(y - this.startY);

    // Prevent zero-size selections
    if (width < 1 || height < 1) {
      this.isDrawing = false;
      this.annotationTool.redrawFullCanvas();
      return;
    }

    // Capture the selected area
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d")!;

    const video = this.annotationTool.videoElement;
    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    // Calculate video and canvas proportions
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const canvasAspectRatio = this.annotationTool.canvasWidth / this.annotationTool.canvasHeight;
    
    let scaledVideoWidth = this.annotationTool.canvasWidth;
    let scaledVideoHeight = this.annotationTool.canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (videoAspectRatio > canvasAspectRatio) {
      // Video is wider than canvas
      scaledVideoHeight = this.annotationTool.canvasWidth / videoAspectRatio;
      offsetY = (this.annotationTool.canvasHeight - scaledVideoHeight) / 2;
    } else {
      // Video is taller than canvas
      scaledVideoWidth = this.annotationTool.canvasHeight * videoAspectRatio;
      offsetX = (this.annotationTool.canvasWidth - scaledVideoWidth) / 2;
    }

    // Calculate scale factors based on actual video dimensions
    const scaleX = video.videoWidth / scaledVideoWidth;
    const scaleY = video.videoHeight / scaledVideoHeight;

    // Adjust coordinates to account for letterboxing offset and scale
    const scaledStartX = (startX - offsetX) * scaleX;
    const scaledStartY = (startY - offsetY) * scaleY;
    const scaledWidth = width * scaleX;
    const scaledHeight = height * scaleY;

    tempCanvas.width = Math.max(1, scaledWidth);
    tempCanvas.height = Math.max(1, scaledHeight);

    try {
      tempCtx.drawImage(
        this.annotationTool.videoElement,
        scaledStartX,
        scaledStartY,
        scaledWidth,
        scaledHeight,
        0,
        0,
        scaledWidth,
        scaledHeight
      );

      const imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      this.selectedArea = imageData;

      // Create an image from the selection
      const canvas = document.createElement("canvas");
      canvas.width = scaledWidth + 4;
      canvas.height = scaledHeight + 4;
      canvas.style.width = `${width + 4}px`;
      canvas.style.height = `${height + 4}px`;
      const ctx = canvas.getContext("2d")!;

      // Draw black border
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, scaledWidth + 2, scaledHeight + 2);

      // Draw red border
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, scaledWidth, scaledHeight);

      // Put the image data in the center (offset by 2px for borders)
      ctx.putImageData(imageData, 2, 2);

      // Create and save as image shape
      const img = new Image();
      img.onload = () => {
        this.annotationTool.pluginForTool("image").save({
          type: "image",
          x: startX - 2, // Adjust position to account for border
          y: startY - 2,
          width: width + 4, // Adjust size to account for border
          height: height + 4,
          image: img,
          strokeStyle: "transparent",
          fillStyle: "transparent",
          lineWidth: 0,
        });

        // Reset drawing state
        this.isDrawing = false;
        this.selectedArea = null;

        // Redraw canvas
        this.annotationTool.redrawFullCanvas();
      };
      img.src = canvas.toDataURL();
      this.annotationTool.currentTool = "move";
    } catch (error) {
      console.error("Error capturing selection:", error);
      this.isDrawing = false;
      this.annotationTool.redrawFullCanvas();
      return;
    }
  }

  drawSelectionRect(x: number, y: number, width: number, height: number) {
    // Calculate actual dimensions
    const startX = Math.min(x, x + width);
    const startY = Math.min(y, y + height);
    const rectWidth = Math.abs(width);
    const rectHeight = Math.abs(height);

    // Draw semi-transparent overlay
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(
      0,
      0,
      this.annotationTool.canvasWidth,
      this.annotationTool.canvasHeight
    );

    // Clear selection area
    this.ctx.clearRect(startX, startY, rectWidth, rectHeight);

    // Draw selection border
    this.ctx.beginPath();
    const oldStrokeStyle = this.ctx.strokeStyle;
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(startX, startY, rectWidth, rectHeight);
    this.ctx.setLineDash([]);
    this.ctx.strokeStyle = oldStrokeStyle;
  }

  draw(shape: ISelection) {
    this.drawSelectionRect(shape.x, shape.y, shape.width, shape.height);
  }

  reset() {
    super.reset();
    this.selectedArea = null;
  }
}
