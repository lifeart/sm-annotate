import type { AnnotationTool } from "../core";

export function createFullscreenButton(tool: AnnotationTool) {
    const button = document.createElement('button');
    button.textContent = '⛶';
    button.title = 'Toggle Fullscreen';
    button.type = 'button';
    button.style.fontSize = '20px';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.color = '#fff';

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
