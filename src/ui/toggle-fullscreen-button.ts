import type { AnnotationTool } from "../core";
import { applyButtonStyle } from "./theme";

export function createFullscreenButton(tool: AnnotationTool) {
    const button = document.createElement('button');
    button.textContent = '⛶';
    button.title = 'Toggle Fullscreen';
    button.type = 'button';
    applyButtonStyle(button);
    button.style.fontSize = '20px';

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
