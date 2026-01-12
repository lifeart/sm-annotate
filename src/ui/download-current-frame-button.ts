import type { AnnotationTool } from "../core";
import { applyButtonStyle } from "./theme";


export function createDownloadCurrentFrameButton(
  video: HTMLVideoElement,
  tool: AnnotationTool
) {

    const button = document.createElement("button");

    button.type = "button";
    applyButtonStyle(button);
    button.style.float = "right";
    button.dataset.tooltip = "Download frame";
    button.dataset.tooltipPosition = "bottom";


    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>';

    tool.addEvent(button, "click", () => {
        const url = tool.frameToDataUrl();
        if (!url) return;
        const link = document.createElement("a");
        link.download = `frame_${String(tool.activeTimeFrame).padStart(3, '0')}.png`;
        link.href = url;
        link.click();
    });

    tool.buttons.push(button);
    tool.playerControlsContainer.appendChild(button);
}