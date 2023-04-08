new EventSource('/esbuild').addEventListener('change', () => location.reload())

import { SmAnnotate } from "../src";

const video = document.querySelector("video") as HTMLVideoElement;
const tool = new SmAnnotate(video);

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
