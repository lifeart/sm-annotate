import type { AnnotationTool } from "../core";
import { applyFullscreenButtonStyle } from "./theme";

const fullscreenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;

// Helper to get current fullscreen element (cross-browser)
function getFullscreenElement(): Element | null {
    return document.fullscreenElement ??
           (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ??
           null;
}

// Helper to request fullscreen (cross-browser)
function requestFullscreen(element: HTMLElement): Promise<void> | void {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }
    const el = element as unknown as { webkitRequestFullscreen?: () => Promise<void> };
    if (el.webkitRequestFullscreen) {
        return el.webkitRequestFullscreen();
    }
}

// Helper to exit fullscreen (cross-browser)
function exitFullscreen(): Promise<void> | void {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    }
    const doc = document as unknown as { webkitExitFullscreen?: () => Promise<void> };
    if (doc.webkitExitFullscreen) {
        return doc.webkitExitFullscreen();
    }
}

// Check if fullscreen is supported (iOS Safari on iPhone doesn't support it)
function isFullscreenSupported(): boolean {
    return !!(document.fullscreenEnabled ??
              (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled);
}

export function createFullscreenButton(tool: AnnotationTool) {
    const button = document.createElement('button');
    button.innerHTML = fullscreenIcon;
    button.type = 'button';
    button.dataset.tooltip = 'Fullscreen';
    button.dataset.tooltipPosition = 'bottom';
    applyFullscreenButtonStyle(button);

    // Hide button if fullscreen is not supported (e.g., iPhone Safari)
    if (!isFullscreenSupported()) {
        button.style.display = 'none';
        return button;
    }

    const toggleFullScreen = () => {
        if (!getFullscreenElement()) {
            // Enter fullscreen
            const container = tool.videoElement.parentElement;
            if (container) {
                requestFullscreen(container);
            }
        } else {
            // Exit fullscreen
            exitFullscreen();
        }
    };

    button.addEventListener('click', toggleFullScreen);


    const onFullscreenChange = () => {
        tool.setCanvasSize();
        tool.playbackFrame = tool.playbackFrame;
        tool.canvas.focus();
        tool.redrawFullCanvas();
        button.blur();
    };


    // Update button state when fullscreen changes (both standard and webkit events)
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    tool.destructors.push(() => {
        button.removeEventListener('click', toggleFullScreen);
        document.removeEventListener('fullscreenchange', onFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    });

    return button;
}
