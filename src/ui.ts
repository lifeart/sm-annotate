import { ButtonConstructor, addButtons } from "./buttons";
import { AnnotationTool } from "./core";
import { onDocumentClick } from "./events/document-click";
import { onDocumentCopy } from "./events/document-copy";
import { onDocumentCut } from "./events/document-cut";
import { onDocumentKeydown } from "./events/document-keydown";
import { onDocumentPaste } from "./events/document-paste";
import { createColorPicker } from "./ui/color-picker";
import { createStrokeWidthSlider } from "./ui/stroke-width-slider";
import { createFullscreenButton } from "./ui/toggle-fullscreen-button";

type StylePojo = Omit<Partial<CSSStyleDeclaration>, 'length' | 'parentRule' | typeof Symbol.iterator>;

const addStyle = (node: HTMLElement, style: StylePojo) => {
  Object.keys(style).forEach((key) => {
    const styleKey = key as unknown as keyof StylePojo;
    const value = style[styleKey];
    if (typeof value === 'string') {
      // @ts-expect-error style key
      node.style[styleKey] = value;
    }
  })
}
const defaultColor = "#F3CE32";

export const playerControlsDefaultStyle = `position: relative; top: 0px; left: 0px; z-index: 2;`;
export const uiContainerDefaultStyle = `position: absolute; top: -40px; left: 0px; z-index: 2; display: block;`;

export const playerControlsFullScreenStyle = 'position: absolute;left: 0px;bottom: 5px;width: 100%;z-index: 2;';
export const uiContainerFullScreenStyle = 'position: absolute; top: 0; left: 0px; z-index: 2; display: block;';

export function initUI(this: AnnotationTool) {
  // Create the container for the UI elements
  const uiContainer = document.createElement("div");
  uiContainer.style.cssText = uiContainerDefaultStyle;

  this.canvas.parentNode?.insertBefore(uiContainer, this.canvas);

  const playerControls = document.createElement("div");
  playerControls.style.cssText = playerControlsDefaultStyle;
  // add player controls right after canvas
  this.canvas.parentNode?.insertBefore(playerControls, this.canvas.nextSibling);

  this.playerControlsContainer = playerControls;

  const video =
    this.videoElement.tagName === "VIDEO"
      ? (this.videoElement as HTMLVideoElement)
      : null;

  this.uiContainer = uiContainer;

  const createWrapper = (): HTMLDivElement => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.margin = "5px";
    return wrapper;
  };

  const Button = new ButtonConstructor(this, uiContainer);

  addButtons(this, Button);

  if (this.isMobile) {
    this.hideButton("line");
    this.hideButton("circle");
    this.hideButton("rectangle");
    this.hideButton("eraser");
  }

  this.hideButton("compare");

  this.colorPicker = createColorPicker(defaultColor, this);;
  uiContainer.appendChild(this.colorPicker);

  // Create the wrapper for stroke controls
  const strokeControlWrapper = createWrapper();
  this.strokeSizePicker = createStrokeWidthSlider(this);
  strokeControlWrapper.appendChild(this.strokeSizePicker);
  uiContainer.appendChild(strokeControlWrapper);

  // disabling for performance reasons
  // this.addEvent(this.canvas, "pointerover", () => {
  //   this.focusOnMediaNode();
  // });

  

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
    this.addEvent(document.body.querySelector('div')!, "drop", (event: DragEvent) => {
      if (event.dataTransfer?.types) {
        // fine
      }
    })

    // Add fullscreen button to player controls
    const fullscreenButton = createFullscreenButton(this);
    fullscreenButton.style.position = 'absolute';
    fullscreenButton.style.right = '40px';
    fullscreenButton.style.bottom = '10px';
    playerControls.appendChild(fullscreenButton);
  }
}
