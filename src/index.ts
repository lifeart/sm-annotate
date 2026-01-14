import { initUI } from "./ui";
import { initCanvas } from "./canvas";
import { AnnotationTool, FrameAnnotationV1 } from "./core";
import { addFrameSquareOverlay } from "./overlays/frame-number";
import { addVideoOverlay } from "./overlays/video";
import { addProgressBarOverlay } from "./overlays/progress-bar";

AnnotationTool.prototype.initUI = initUI;
AnnotationTool.prototype.initCanvas = initCanvas;
AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

export { AnnotationTool as SmAnnotate, FrameAnnotationV1 };

// Configuration types
export type {
  SmAnnotateConfig,
  LayoutMode,
  MobileConfig,
  ToolbarConfig,
  FeatureFlags,
  ToolbarPosition,
} from './config';
export { defaultConfig } from './config';

// Gesture types
export type { GestureState } from './gestures/gesture-handler';

// Exporters & Parsers
export {
  // OpenRV export
  exportToOpenRV,
  downloadAsOpenRV,
  hexToRGBA,
  type OpenRVExportOptions,
  // OpenRV import
  parseOpenRV,
  parseOpenRVFile,
  rgbaToHex,
  type ParsedOpenRVResult,
} from './exporters';
