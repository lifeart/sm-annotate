import type { SmAnnotate } from "..";
import { isEditableTarget, isTargetBelongsToVideo } from "./utils";

export function onDocumentKeydown(event: KeyboardEvent, tool: SmAnnotate) {
  if (!isTargetBelongsToVideo(event, tool)) {
    return;
  }
  // Don't hijack typing or browser/OS shortcuts (e.g. Alt+Left = Back)
  if (
    isEditableTarget(event.target) ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  ) {
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
      video
        .play()
        .then(() => {
          tool.redrawFullCanvas();
        })
        .catch(() => {
          // Autoplay blocked or source not ready
        });
    } else {
      video.pause();
      tool.raf(() => {
        tool.redrawFullCanvas();
      });
    }
  }
}
