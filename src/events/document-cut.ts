import type { SmAnnotate } from "..";
import { isTargetBelongsToVideo } from "./utils";

export function onDocumentCut(event: ClipboardEvent, tool: SmAnnotate) {
  if (!isTargetBelongsToVideo(event, tool)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const data = tool.saveCurrentFrame();
  tool.replaceFrame(tool.playbackFrame, []);
  tool.redrawFullCanvas();
  event.clipboardData?.setData("application/json", JSON.stringify(data));
}
