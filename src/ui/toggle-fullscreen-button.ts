import type { AnnotationTool } from "../core";
import { applyFullscreenButtonStyle } from "./theme";

const fullscreenIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
</svg>`;

export function createFullscreenButton(tool: AnnotationTool) {
    const button = document.createElement('button');
    button.innerHTML = fullscreenIcon;
    button.title = 'Toggle Fullscreen';
    button.type = 'button';
    applyFullscreenButtonStyle(button);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            const container = tool.videoElement.parentElement;
            if (container?.requestFullscreen) {
                container.requestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
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


    // Update button state when fullscreen changes
    document.addEventListener('fullscreenchange', onFullscreenChange);

    tool.destructors.push(() => {
        button.removeEventListener('click', toggleFullScreen);
        document.removeEventListener('fullscreenchange', onFullscreenChange);
    });

    return button;
}
