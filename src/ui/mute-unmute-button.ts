import type { AnnotationTool } from "../core";
import { applyButtonStyle } from "./theme";

const muteIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="22" x2="16" y1="9" y2="15"></line><line x1="16" x2="22" y1="9" y2="15"></line></svg>';
const unmuteIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>';

export function createMuteUnmuteButton(
  video: HTMLVideoElement,
  tool: AnnotationTool
) {
  const button = document.createElement("button");

  button.type = "button";
  applyButtonStyle(button);
  button.dataset.tooltip = "Mute/Unmute";
  button.dataset.tooltipPosition = "bottom";

  if (video.muted || video.volume === 0) {
    button.innerHTML = muteIcon;
  } else {
    button.innerHTML = unmuteIcon;
  }

  tool.addEvent(video, "volumechange", () => {
    if (video.muted || video.volume === 0) {
      button.innerHTML = muteIcon;
    } else {
      button.innerHTML = unmuteIcon;
    }
  });

  tool.addEvent(button, "click", () => {
    if (video.muted) {
      video.muted = false;
      return;
    }
    if (video.volume === 0) {
      video.volume = 1;
    } else {
      video.volume = 0;
    }
  });

  tool.buttons.push(button);
  tool.playerControlsContainer.appendChild(button);
}
