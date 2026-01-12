import type { SmAnnotate } from "..";
import { isTargetBelongsToVideo } from "./utils";

export function onDocumentPaste(event: ClipboardEvent, tool: SmAnnotate) {
  if (!isTargetBelongsToVideo(event, tool)) {
    return;
  }

  const dataTypes = event.clipboardData?.types ?? [];
  if (dataTypes.includes("application/json")) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  } else if (dataTypes.includes("Files")) {
    const files = event.clipboardData?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const img = new Image();
        const blobUrl = URL.createObjectURL(file);
        img.addEventListener(
          "load",
          () => {
            // Revoke blob URL after image loads to prevent memory leak
            URL.revokeObjectURL(blobUrl);
            const imageRatio = img.naturalWidth / img.naturalHeight;
            const pasteWidth = 0.25;
            const pasteHeight = (pasteWidth / imageRatio) * tool.aspectRatio;
            tool.addShapesToFrame(tool.playbackFrame, [
              {
                type: "image",
                image: img,
                x: 0,
                y: 0,
                width: pasteWidth,
                height: pasteHeight,
                strokeStyle: "red",
                fillStyle: "red",
                lineWidth: 2,
              },
            ]);
            tool.redrawFullCanvas();
            tool.raf(() => {
              tool.show();
            });
            tool.currentTool = "move";
          },
          {
            once: true,
          }
        );
        img.addEventListener(
          "error",
          () => {
            // Revoke blob URL on error to prevent memory leak
            URL.revokeObjectURL(blobUrl);
          },
          {
            once: true,
          }
        );

        img.src = blobUrl;
        tool.redrawFullCanvas();
      }
    }
  } else if (dataTypes.includes("text/plain")) {
    const text = event.clipboardData?.getData("text/plain");
    if (text) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      tool.addShapesToFrame(tool.playbackFrame, [
        {
          type: "text",
          text,
          x: 0.4,
          y: 0.4,
          strokeStyle: tool.ctx.strokeStyle,
          fillStyle: tool.ctx.fillStyle,
          lineWidth: tool.ctx.lineWidth,
        },
      ]);
      tool.show();
      tool.currentTool = "move";
      tool.redrawFullCanvas();
    }
  } else {
    return;
  }
  const json = event.clipboardData?.getData("application/json");
  if (!json) {
    return;
  }
  const data = JSON.parse(json);
  if (!data) {
    return;
  }
  // check data for shapes
  if (!data.shapes) {
    return;
  }
  // check for version

  if (data.version !== 1) {
    return;
  }
  tool.addShapesToFrame(tool.playbackFrame, data.shapes);
  tool.redrawFullCanvas();
}
