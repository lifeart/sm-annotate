import type { AnnotationTool } from "../core";

function iconForSpeed(speed: number) {
  const ratioMap = {
    "0.25": "¼",
    "0.5": "½",
    "0.75": "¾",
    "1": "1×",
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-superscript">
        <style>
            .small {
                font-family: auto;
                font-size: ${speed === 1 ? "16" : "24"}px;
            }
        </style>
        <text x="${speed === 1 ? 3 : 2}" y="${
    speed === 1 ? 17 : 20
  }" font-weight="normal" class="small">${
    ratioMap[String(speed) as keyof typeof ratioMap]
  }</text>
        
    </svg>`;
}

export function createPlaybackSpeedControlButton(
  video: HTMLVideoElement,
  tool: AnnotationTool
) {
  const states: number[] = [0.25, 0.5, 0.75, 1];
  const button = document.createElement("button");
  const defaultState: number = states[states.length - 1];
  button.type = "button";
  video.playbackRate = defaultState;
  tool.withRefVideo((refVideo) => {
    refVideo.playbackRate = defaultState;
  });

  button.innerHTML = iconForSpeed(defaultState);
  button.style.margin = "5px";

  tool.addEvent(button, "click", () => {
    const currentState = states.indexOf(video.playbackRate);
    const nextState = currentState + 1 >= states.length ? 0 : currentState + 1;
    video.playbackRate = states[nextState];
    tool.withRefVideo((refVideo) => {
      refVideo.playbackRate = states[nextState];
    });
    button.innerHTML = iconForSpeed(states[nextState]);
  });

  tool.buttons.push(button);
  tool.playerControlsContainer.appendChild(button);
}
