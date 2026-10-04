import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnnotationTool } from '../src/core';
import { initUI } from '../src/ui';
import { initCanvas } from '../src/canvas';
import { addFrameSquareOverlay } from '../src/overlays/frame-number';
import { addVideoOverlay } from '../src/overlays/video';
import { addProgressBarOverlay } from '../src/overlays/progress-bar';
import { isContainerFullscreen } from '../src/ui/toggle-fullscreen-button';

AnnotationTool.prototype.initUI = initUI;
AnnotationTool.prototype.initCanvas = initCanvas;
AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

function setFullscreenEnabled(value: boolean | undefined) {
  Object.defineProperty(document, 'fullscreenEnabled', { value, configurable: true });
}

describe('fullscreen button', () => {
  let root: HTMLDivElement;
  let video: HTMLVideoElement;
  let tool: AnnotationTool;

  const button = () => root.querySelector('.sm-annotate-fullscreen-btn') as HTMLButtonElement;

  beforeEach(() => {
    root = document.createElement('div');
    video = document.createElement('video');
    Object.defineProperty(video, 'videoWidth', { value: 1920 });
    Object.defineProperty(video, 'videoHeight', { value: 1080 });
    root.appendChild(video);
    document.body.appendChild(root);
  });

  afterEach(() => {
    if (!tool.isDestroyed) tool.destroy();
    root.remove();
    setFullscreenEnabled(undefined);
    document.body.style.overflow = '';
  });

  describe('without the Fullscreen API (iPhone)', () => {
    beforeEach(() => {
      setFullscreenEnabled(false);
      tool = new AnnotationTool(video);
    });

    it('stays available and pins the container over the page', () => {
      expect(button().style.display).not.toBe('none');
      button().click();
      expect(root.classList.contains('sm-annotate-fullscreen-fallback')).toBe(true);
      expect(isContainerFullscreen(root)).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
      expect(button().dataset.tooltip).toBe('Exit fullscreen');

      button().click();
      expect(root.classList.contains('sm-annotate-fullscreen-fallback')).toBe(false);
      expect(isContainerFullscreen(root)).toBe(false);
      expect(document.body.style.overflow).toBe('');
      expect(button().dataset.tooltip).toBe('Fullscreen');
    });

    it('resizes the canvas when entering and leaving', () => {
      const resize = vi.spyOn(tool, 'setCanvasSize');
      button().click();
      button().click();
      expect(resize).toHaveBeenCalledTimes(2);
    });

    it('leaves with Escape', () => {
      button().click();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(root.classList.contains('sm-annotate-fullscreen-fallback')).toBe(false);
    });

    it('restores the page on destroy', () => {
      document.body.style.overflow = 'auto';
      button().click();
      tool.destroy();
      expect(root.classList.contains('sm-annotate-fullscreen-fallback')).toBe(false);
      expect(document.body.style.overflow).toBe('auto');
    });
  });

  it('uses the Fullscreen API on the container when it is available', () => {
    setFullscreenEnabled(true);
    const request = vi.fn(() => Promise.resolve());
    root.requestFullscreen = request;
    tool = new AnnotationTool(video);
    button().click();
    expect(request).toHaveBeenCalledTimes(1);
    expect(root.classList.contains('sm-annotate-fullscreen-fallback')).toBe(false);
  });
});
