import type { SmAnnotate } from "..";
import { isTargetBelongsToVideo } from "./utils";

export function onDocumentCopy(event: ClipboardEvent, tool: SmAnnotate) {
  if (!isTargetBelongsToVideo(event, tool)) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  event.clipboardData?.setData(
    "application/json",
    JSON.stringify(tool.saveCurrentFrame())
  );
}
