import { AnnotationTool } from "./core";
import { onDocumentClick } from "./events/document-click";
import { onDocumentCopy } from "./events/document-copy";
import { onDocumentCut } from "./events/document-cut";
import { onDocumentKeydown } from "./events/document-keydown";
import { onDocumentPaste } from "./events/document-paste";
import { createDownloadCurrentFrameButton } from "./ui/download-current-frame-button";
import { createMuteUnmuteButton } from "./ui/mute-unmute-button";
import { createPlayPauseButton } from "./ui/play-pause-button";
import { createPlaybackSpeedControlButton } from "./ui/playback-speed-button";

const defaultColor = "#F3CE32";

export function initUI(this: AnnotationTool) {
  // Create the container for the UI elements
  const uiContainer = document.createElement("div");
  uiContainer.style.position = "absolute";
  uiContainer.style.top = "-40px";
  uiContainer.style.left = "0";
  uiContainer.style.zIndex = "2";
  this.canvas.parentNode?.insertBefore(uiContainer, this.canvas);

  const playerControls = document.createElement("div");
  playerControls.style.position = "relative";
  playerControls.style.top = "0";
  playerControls.style.left = "0";
  playerControls.style.zIndex = "2";
  // add player controls right after canvas
  this.canvas.parentNode?.insertBefore(playerControls, this.canvas.nextSibling);

  this.playerControlsContainer = playerControls;

  const video =
    this.videoElement.tagName === "VIDEO"
      ? (this.videoElement as HTMLVideoElement)
      : null;

  this.uiContainer = uiContainer;

  type Tool = NonNullable<typeof this.currentTool>;

  // Create a helper function to generate buttons
  const createButton = (
    icon: string,
    tool: Tool | ((e: Event) => void),
    container: HTMLElement = uiContainer
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

      this.addEvent(button, "click", onClick);
    }

    return button;
  };

  const createWrapper = (): HTMLDivElement => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.margin = "5px";
    uiContainer.appendChild(wrapper);
    return wrapper;
  };

  // https://lucide.dev/icon/type
  // Create buttons for different drawing tools
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
    "rectangle"
  );
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>',
    "circle"
  );
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"></path><path d="m7.5 10.5 2 2"></path><path d="m10.5 7.5 2 2"></path><path d="m13.5 4.5 2 2"></path><path d="m4.5 13.5 2 2"></path></svg>',
    "line"
  );
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path></svg>',
    "curve"
  );
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    "arrow"
  );
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
    "text"
  );
  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>',
    "eraser"
  );

  if (this.isMobile) {
    this.hideButton("line");
    this.hideButton("circle");
    this.hideButton("rectangle");
    this.hideButton("eraser");
  }

  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
    "move"
  );

  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flip-horizontal"><path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path><path d="M12 20v2"></path><path d="M12 14v2"></path><path d="M12 8v2"></path><path d="M12 2v2"></path></svg>',
    "compare"
  );

  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>',
    () => {
      this.handleUndo();
    }
  );

  if (video) {
    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>',
      () => {
        this.prevFrame();
      },
      this.playerControlsContainer
    );

    createPlayPauseButton(video, this);

    createButton(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>',
      () => {
        this.nextFrame();
      },
      this.playerControlsContainer
    );

    createMuteUnmuteButton(video, this);
    createPlaybackSpeedControlButton(video, this);

    createDownloadCurrentFrameButton(video, this);
  }

  // Create the color picker
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = defaultColor;
  colorPicker.style.margin = "5px";
  this.colorPicker = colorPicker;
  uiContainer.appendChild(colorPicker);

  // Create the wrapper for stroke controls
  const strokeControlWrapper = createWrapper();

  const strokeWidthSlider = document.createElement("input");
  strokeWidthSlider.type = "number";
  strokeWidthSlider.step = "1";
  strokeWidthSlider.min = "1";
  strokeWidthSlider.max = "10";
  strokeWidthSlider.value = "5";
  strokeWidthSlider.style.margin = "5px";
  strokeControlWrapper.appendChild(strokeWidthSlider);

  const onStrokeWidthChange = (event: Event) => {
    this.ctx.lineWidth = (event.target as HTMLInputElement).valueAsNumber;
    this.focusOnMediaNode();
  };

  this.addEvent(strokeWidthSlider, "input", onStrokeWidthChange);

  const onColorChange = (event: Event) => {
    this.ctx.strokeStyle = (event.target as HTMLInputElement).value;
    this.ctx.fillStyle = (event.target as HTMLInputElement).value;
    this.focusOnMediaNode();
  };

  this.addEvent(colorPicker, "input", onColorChange);

  // disabling for performance reasons
  // this.addEvent(this.canvas, "pointerover", () => {
  //   this.focusOnMediaNode();
  // });

  this.colorPicker = colorPicker;
  this.strokeSizePicker = strokeWidthSlider;

  this.hideButton("compare");

  if (video) {
    this.hide();
    this.addEvent(video, "pause", () => {
      this.show();
    });
    this.addEvent(video, "seek", () => {
      if (video.paused) {
        this.show();
      }
    });

    this.addEvent(video, "timeupdate", () => {
      if (video.currentTime < 0.0002 && !video.paused) {
        this.startAnnotationsAsVideo();
      }
    });
    this.addEvent(video, "error", () => {
      this.hide();
    });
    this.addEvent(video, "stalled", () => {
      this.hide();
    });
    this.addEvent(video, "play", () => {
      this.hideControls();
      this.startAnnotationsAsVideo();
    });

    this.addEvent(document, "copy", (event: ClipboardEvent) => {
      onDocumentCopy(event, this);
    });
    this.addEvent(document, "cut", (event: ClipboardEvent) => {
      onDocumentCut(event, this);
    });
    this.addEvent(document, "paste", (event: ClipboardEvent) => {
      onDocumentPaste(event, this);
    });
    this.addEvent(document, "click", (event: PointerEvent) => {
      onDocumentClick(event, this);
    });
    this.addEvent(document, "keydown", (event: KeyboardEvent) => {
      onDocumentKeydown(event, this);
    });
  }
}
