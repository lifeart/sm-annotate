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

/**
 * True when a keyboard event originates from a text-editing element
 * (input, textarea, select or contenteditable), where global shortcuts
 * must not hijack keystrokes.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target as HTMLElement).tagName) {
    return false;
  }
  const el = target as HTMLElement;
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }
  if (tag === "INPUT") {
    const type = ((el as HTMLInputElement).type || "text").toLowerCase();
    // Non-text inputs (buttons, checkboxes, ranges, colors) don't take text
    return !["button", "checkbox", "color", "radio", "range", "reset", "submit", "file", "image"].includes(type);
  }
  return el.isContentEditable === true;
}
