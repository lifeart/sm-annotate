import type { AnnotationTool } from "../core";

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect width="4" height="16" x="6" y="4"></rect><rect width="4" height="16" x="14" y="4"></rect></svg>';

export function createPlayPauseButton(
  video: HTMLVideoElement,
  tool: AnnotationTool
) {
  const button = document.createElement("button");

  button.type = "button";
  button.innerHTML = playIcon;
  button.style.margin = "5px";

  tool.addEvent(video, "play", () => {
    button.innerHTML = pauseIcon;
  });

  tool.addEvent(video, "pause", () => {
    button.innerHTML = playIcon;
  });

  tool.addEvent(button, "click", () => {

    tool.withRefVideo((refVideo) => {
      if (refVideo.paused) {
        refVideo.play().then(() => {
          tool.referenceVideoFrameBuffer?.setCanvasSize();
          tool.showButton("compare");
        });
      }
    });

    if (video.paused) {
      video.play().then(() => {
        tool.redrawFullCanvas();
      });
    } else {
      video.pause();
      tool.raf(() => {
        tool.redrawFullCanvas();
      });
    }
  });

  tool.buttons.push(button);
  tool.playerControlsContainer.appendChild(button);
}
