import { AnnotationTool } from "./core";
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

  createButton(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line></svg>',
    "move"
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

    // this.addEvent(video, "timeupdate", () => {

    // });
    this.addEvent(video, "error", () => {
      this.hide();
    });
    this.addEvent(video, "stalled", () => {
      this.hide();
    });
    this.addEvent(video, "waiting", () => {
      this.hide();
    });
    this.addEvent(video, "ended", () => {
      this.hide();
    });
    this.addEvent(video, "play", () => {
      this.hideControls();
      this.playAnnotationsAsVideo();
    });

    const isTargetBelongsToVideo = (
      event: PointerEvent | KeyboardEvent | ClipboardEvent
    ) => {
      const isBody = event.target === document.body;
      const isTool = this.uiContainer.contains(event.target as Node);
      const isControl = this.playerControlsContainer.contains(
        event.target as Node
      );
      const isVideo = this.videoElement.contains(event.target as Node);
      const isCanvas = this.canvas.contains(event.target as Node);
      return isTool || isControl || isVideo || isCanvas || isBody;
    };

    this.addEvent(document, "copy", (event: ClipboardEvent) => {
      if (!isTargetBelongsToVideo(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.clipboardData?.setData(
        "application/json",
        JSON.stringify(this.saveCurrentFrame())
      );
    });
    this.addEvent(document, "cut", (event: ClipboardEvent) => {
      if (!isTargetBelongsToVideo(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const data = this.saveCurrentFrame();
      this.replaceFrame(this.playbackFrame, []);
      this.redrawFullCanvas();
      event.clipboardData?.setData("application/json", JSON.stringify(data));
    });
    this.addEvent(document, "paste", (event: ClipboardEvent) => {
      if (!isTargetBelongsToVideo(event)) {
        return;
      }

      const dataTypes = event.clipboardData?.types ?? [];
      console.log("dataTypes", JSON.stringify(dataTypes));
      if (dataTypes.includes("application/json")) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      } else if (dataTypes.includes("Files")) {
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            const img = new Image();
            img.addEventListener("load", () => {
              const imageRatio = img.naturalWidth / img.naturalHeight;
              const pasteWidth = 0.25;
              const pasteHeight = (pasteWidth / imageRatio) * this.aspectRatio;
              this.addShapesToFrame(this.playbackFrame, [
                {
                  type: "image",
                  image: img,
                  x: 0,
                  y: 0,
                  width: pasteWidth,
                  height: pasteHeight,
                  strokeStyle: "red",
                  fillStyle: "red",
                  lineWidth: 2,
                },
              ]);
              this.redrawFullCanvas();
              requestAnimationFrame(() => {
                this.show();
              })
              this.currentTool = 'move';
            }, {
              once: true
            });

            img.src = URL.createObjectURL(file);
            this.redrawFullCanvas();
          }
        }
      } else if (dataTypes.includes("text/plain")) {
        const text = event.clipboardData?.getData("text/plain");
        if (text) {
          console.log("text", text);
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          this.addShapesToFrame(this.playbackFrame, [
            {
              type: "text",
              text,
              x: 0.4,
              y: 0.4,
              strokeStyle: this.ctx.strokeStyle,
              fillStyle: this.ctx.fillStyle,
              lineWidth: this.ctx.lineWidth,
            },
          ]);
          this.show();
          this.currentTool = 'move';
          this.redrawFullCanvas();
        }

      } else {
        return;
      }
      const json = event.clipboardData?.getData("application/json");
      if (!json) {
        return;
      }
      const data = JSON.parse(json);
      if (!data) {
        return;
      }
      // check data for shapes
      if (!data.shapes) {
        return;
      }
      // check for version

      if (data.version !== 1) {
        return;
      }
      this.addShapesToFrame(this.playbackFrame, data.shapes);
      this.redrawFullCanvas();
    });

    // add onclick event to pause playback
    this.addEvent(document, "click", (event: PointerEvent) => {
      if (!isTargetBelongsToVideo(event)) {
        return;
      }

      const isTool = this.uiContainer.contains(event.target as Node);
      const isControl = this.playerControlsContainer.contains(
        event.target as Node
      );
      if (isTool || isControl) {
        return;
      }

      if (video.paused) {
        return;
      }
      this.currentTool = null;
      video.pause();
    });

    // add event listener for frame by frame navigation from arrow keys
    this.addEvent(document, "keydown", (event: KeyboardEvent) => {
      if (!isTargetBelongsToVideo(event)) {
        return;
      }

      // space key to play/pause
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (event.key === "ArrowLeft") {
          this.prevFrame();
        } else if (event.key === "ArrowRight") {
          this.nextFrame();
        }
      } else if (event.code === "Space") {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  }
}
