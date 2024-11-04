import type { AnnotationTool } from "./core";
import { createDownloadCurrentFrameButton } from "./ui/download-current-frame-button";
import { createMuteUnmuteButton } from "./ui/mute-unmute-button";
import { createPlayPauseButton } from "./ui/play-pause-button";
import { createPlaybackSpeedControlButton } from "./ui/playback-speed-button";

type Tool = NonNullable<AnnotationTool["currentTool"]>;

export class ButtonConstructor {
  tool!: AnnotationTool;
  uiContainer!: HTMLElement;
  constructor(tool: AnnotationTool, container: HTMLElement) {
    this.tool = tool;
    this.uiContainer = container;
  }
  get buttons() {
    return this.tool.buttons;
  }
  get addEvent() {
    return this.tool.addEvent.bind(this.tool);
  }
  get currentTool() {
    return this.tool.currentTool;
  }
  set currentTool(value: AnnotationTool["currentTool"]) {
    this.tool.currentTool = value;
  }
  create = (
    icon: string,
    tool: Tool | ((e: Event) => void),
    container: HTMLElement = this.uiContainer
  ): HTMLButtonElement => {
    const button = document.createElement("button");

    button.type = "button";
    button.innerHTML = icon;
    button.style.margin = "5px";
    container.appendChild(button);

    this.buttons.push(button);

    if (typeof tool === "function") {
      this.addEvent(button, "click", tool);
    } else {
      button.dataset.tool = tool;
      const onClick = () => {
        if (this.currentTool === tool) {
          this.currentTool = null;
        } else {
          this.currentTool = tool;
        }
      };

      try {
        this.tool.pluginForTool(tool);
        this.addEvent(button, "click", onClick);
      } catch (e) {
        console.error(e);
        button.disabled = true;
      }

    }

    return button;
  };
}

// Create a helper function to generate buttons
export function addButtons(tool: AnnotationTool, Button: ButtonConstructor) {
  const video =
    tool.videoElement.tagName === "VIDEO"
      ? (tool.videoElement as HTMLVideoElement)
      : null;

  // https://lucide.dev/icon/type
  // Create buttons for different drawing tools
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
    "rectangle"
  );
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',
    "circle"
  );
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',
    "line"
  );
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',
    "curve"
  );
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    "arrow"
  );
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
    "text"
  );
  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',
    "eraser"
  );

  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
    "move"
  );

  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',
    "compare"
  );

  Button.create(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',
    () => {
      tool.handleUndo();
    }
  );

  // Button.create(
  //   '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>',
  //   "zoom-draw"
  // );

  if (video) {
    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',
      () => {
        tool.prevFrame();
      },
      tool.playerControlsContainer
    );

    createPlayPauseButton(video, tool);

    Button.create(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',
      () => {
        tool.nextFrame();
      },
      tool.playerControlsContainer
    );

    createMuteUnmuteButton(video, tool);
    createPlaybackSpeedControlButton(video, tool);

    createDownloadCurrentFrameButton(video, tool);
  }
}
