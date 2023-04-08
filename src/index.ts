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

const video = document.querySelector("video") as HTMLVideoElement;
const tool = new AnnotationTool(video);

setInterval(() => {
  tool.destroy();
  tool.init(video);
}, 100000000);

setInterval(() => {
  console.log(tool.saveAllFrames());
}, 100000);




// setInterval(() => {
//   const img = tool.imageForCapture();
//   if (img) {
//     document.body.appendChild(img);
//   }
// }, 10000);
