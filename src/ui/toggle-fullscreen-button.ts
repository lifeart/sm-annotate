import type { AnnotationTool } from "../core";
import { applyFullscreenButtonStyle, getCSSPrefix } from "./theme";

const fullscreenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;

const exitFullscreenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
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

// Class used where the Fullscreen API is missing (iPhone): the container is
// pinned over the page with CSS instead
export function fullscreenFallbackClass(): string {
    return `${getCSSPrefix()}-fullscreen-fallback`;
}

// True while the annotation container is shown fullscreen, either through the
// Fullscreen API or the CSS fallback
export function isContainerFullscreen(container: Element | null): boolean {
    if (getFullscreenElement()) return true;
    return !!container?.classList.contains(fullscreenFallbackClass());
}

export function createFullscreenButton(tool: AnnotationTool) {
    const button = document.createElement('button');
    button.innerHTML = fullscreenIcon;
    button.type = 'button';
    button.dataset.tooltip = 'Fullscreen';
    button.dataset.tooltipPosition = 'bottom';
    applyFullscreenButtonStyle(button);

    const syncButton = () => {
        const active = isContainerFullscreen(tool.videoElement.parentElement);
        button.innerHTML = active ? exitFullscreenIcon : fullscreenIcon;
        button.dataset.tooltip = active ? 'Exit fullscreen' : 'Fullscreen';
        button.setAttribute('aria-label', button.dataset.tooltip);
    };

    const onFullscreenChange = () => {
        syncButton();
        tool.setCanvasSize();
        tool.playbackFrame = tool.playbackFrame;
        tool.canvas.focus();
        tool.redrawFullCanvas();
        button.blur();
    };

    // No Fullscreen API (iPhone Safari): pin the container over the page
    if (!isFullscreenSupported()) {
        const container = tool.videoElement.parentElement;
        const fallbackClass = fullscreenFallbackClass();
        let prevBodyOverflow = '';
        const setFallback = (on: boolean, notify = true) => {
            if (!container || container.classList.contains(fallbackClass) === on) return;
            container.classList.toggle(fallbackClass, on);
            // Keep the page behind from scrolling while pinned
            if (on) {
                prevBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = prevBodyOverflow;
            }
            if (notify) onFullscreenChange();
        };
        const toggleFallback = () => setFallback(!container?.classList.contains(fallbackClass));
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setFallback(false);
        };
        button.addEventListener('click', toggleFallback);
        document.addEventListener('keydown', onKeyDown);
        tool.destructors.push(() => {
            setFallback(false, false);
            button.removeEventListener('click', toggleFallback);
            document.removeEventListener('keydown', onKeyDown);
        });
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
