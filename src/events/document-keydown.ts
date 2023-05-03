import type { SmAnnotate } from "..";
import { isTargetBelongsToVideo } from "./utils";

export function onDocumentKeydown(event: KeyboardEvent, tool: SmAnnotate) {
  if (!isTargetBelongsToVideo(event, tool)) {
    return;
  }

  const video = tool.videoElement as HTMLVideoElement;

  if (video.tagName !== "VIDEO") {
    return;
  }

  // space key to play/pause
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.key === "ArrowLeft") {
      tool.prevFrame();
    } else if (event.key === "ArrowRight") {
      tool.nextFrame();
    }
  } else if (event.code === "Space") {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (video.paused) {
      video.play().then(() => {
        tool.redrawFullCanvas();
      });
    } else {
      video.pause();
      tool.raf(() => {
        tool.redrawFullCanvas();
      });
    }
  }
}
