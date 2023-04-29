export type PointerEventNames =
  | "pointerdown"
  | "pointermove"
  | "pointerup"
  | "pointercancel"
  | "pointerover";
export type KeyboardEventNames = "keydown";
export type ButtonEventNames = "click";
export type InputEventNames = "input" | "change";
export type ClipboardEventNames = "copy" | "paste" | "cut";
export type VideoEventNames =
  | "timeupdate"
  | "volumechange"
  | "seeking"
  | "play"
  | "pause"
  | "ended"
  | "seek"
  | "stalled"
  | "waiting"
  | "error";
export type WindowEventNames = "resize";
export type EventNames =
  | VideoEventNames
  | InputEventNames
  | PointerEventNames
  | KeyboardEventNames
  | WindowEventNames
  | ButtonEventNames
  | ClipboardEventNames;
