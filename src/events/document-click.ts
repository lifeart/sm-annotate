import type { SmAnnotate } from "..";
import { isTargetBelongsToVideo } from "./utils";

export function onDocumentClick(event: PointerEvent, tool: SmAnnotate) {
  if (!isTargetBelongsToVideo(event, tool)) {
    return;
  }

  const isTool = tool.uiContainer.contains(event.target as Node);
  const isControl = tool.playerControlsContainer.contains(event.target as Node);
  if (isTool || isControl) {
    return;
  }
  const video = tool.videoElement as HTMLVideoElement;

  if (video.tagName !== "VIDEO") {
    return;
  }

  if (video.paused) {
    return;
  }
  tool.currentTool = null;
  video.pause();
  tool.withRefVideo((v) => {
    v.pause();
  });

  tool.raf(() => {
    tool.syncTime();
    tool.redrawFullCanvas();
  });
}
