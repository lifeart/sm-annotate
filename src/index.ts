import { initUI } from "./ui";
import { initCanvas } from "./canvas";
import { AnnotationTool } from "./core";
import { addFrameSquareOverlay } from "./overlays/frame-number";
import { addVideoOverlay } from "./overlays/video";
import { addProgressBarOverlay } from "./overlays/progress-bar";

AnnotationTool.prototype.initUI = initUI;
AnnotationTool.prototype.initCanvas = initCanvas;
AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

export const SmAnnotate = AnnotationTool;