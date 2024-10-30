import type { SmAnnotate } from "../..";

export const isTargetBelongsToVideo = (
  event: PointerEvent | KeyboardEvent | ClipboardEvent,
  tool: SmAnnotate
) => {
  const isBody = event.target === document.body;
  const isTool = tool.uiContainer.contains(event.target as Node);
  const isControl = tool.playerControlsContainer.contains(event.target as Node);
  const isVideo = tool.videoElement.contains(event.target as Node);
  const isCanvas = tool.canvas.contains(event.target as Node);
  return isTool || isControl || isVideo || isCanvas || isBody;
};

export function isMultiTouch(event: PointerEvent) {
  if (event.pointerType === "pen") {
    return false;
  }
  return event.pointerType === "touch" && event.isPrimary === false;
}
