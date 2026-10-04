import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AnnotationTool } from '../src/core';
import { initUI } from '../src/ui';
import { initCanvas } from '../src/canvas';
import { addFrameSquareOverlay } from '../src/overlays/frame-number';
import { addVideoOverlay } from '../src/overlays/video';
import { addProgressBarOverlay } from '../src/overlays/progress-bar';
import type { SmAnnotateConfig } from '../src/config';
import type { MoveToolPlugin } from '../src/plugins/move';

AnnotationTool.prototype.initUI = initUI;
AnnotationTool.prototype.initCanvas = initCanvas;
AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

const originalWidth = window.innerWidth;

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true });
}

describe('mobile dock', () => {
  let root: HTMLDivElement;
  let video: HTMLVideoElement;
  let tool: AnnotationTool;

  const create = (config?: Partial<SmAnnotateConfig>) => {
    tool = new AnnotationTool(video, config);
    return tool;
  };

  beforeEach(() => {
    setViewportWidth(390);
    root = document.createElement('div');
    video = document.createElement('video');
    Object.defineProperty(video, 'duration', { value: 10, writable: true });
    Object.defineProperty(video, 'videoWidth', { value: 1920, writable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1080, writable: true });
    root.appendChild(video);
    document.body.appendChild(root);
  });

  afterEach(() => {
    if (!tool.isDestroyed) tool.destroy();
    root.remove();
    setViewportWidth(originalWidth);
  });

  it('docks the toolbars below the breakpoint', () => {
    create();
    expect(root.classList.contains('sm-annotate-mobile')).toBe(true);
    expect(tool.mobileDock?.active).toBe(true);
    expect(tool.uiContainer.querySelector('[data-control="style"]')).not.toBeNull();
  });

  it('keeps every drawing tool available on phones', () => {
    create();
    for (const name of ['curve', 'arrow', 'line', 'rectangle', 'circle', 'text', 'eraser']) {
      const button = tool.getButtonForTool(name as never);
      expect(button, name).toBeTruthy();
      expect(button.style.display, name).toBe('');
    }
  });

  it('can be turned off with mobile.dock = false', () => {
    create({ mobile: { dock: false } as SmAnnotateConfig['mobile'] });
    expect(root.classList.contains('sm-annotate-mobile')).toBe(false);
    expect(tool.mobileDock?.active).toBe(false);
  });

  it('follows the viewport across the breakpoint', () => {
    setViewportWidth(1280);
    create();
    expect(root.classList.contains('sm-annotate-mobile')).toBe(false);

    setViewportWidth(390);
    window.dispatchEvent(new Event('resize'));
    expect(root.classList.contains('sm-annotate-mobile')).toBe(true);

    setViewportWidth(1280);
    window.dispatchEvent(new Event('resize'));
    expect(root.classList.contains('sm-annotate-mobile')).toBe(false);
  });

  it('dims the dock during playback instead of removing it from the layout', () => {
    create();
    tool.showControls();
    tool.hideControls();
    expect(tool.uiContainer.style.display).toBe('');
    expect(tool.uiContainer.classList.contains('sm-annotate-dimmed')).toBe(true);
    tool.showControls();
    expect(tool.uiContainer.classList.contains('sm-annotate-dimmed')).toBe(false);
  });

  it('still hides the floating toolbar on desktop', () => {
    setViewportWidth(1280);
    create();
    tool.showControls();
    tool.hideControls();
    expect(tool.uiContainer.style.display).toBe('none');
  });

  describe('style sheet', () => {
    it('opens from the style button and closes with Done', () => {
      create();
      const sheet = root.querySelector('.sm-annotate-sheet') as HTMLDivElement;
      expect(sheet.hidden).toBe(true);
      (tool.uiContainer.querySelector('[data-control="style"]') as HTMLButtonElement).click();
      expect(sheet.hidden).toBe(false);
      (sheet.querySelector('.sm-annotate-sheet-done') as HTMLButtonElement).click();
      expect(sheet.hidden).toBe(true);
    });

    it('sets the stroke colour from a swatch', () => {
      create();
      const swatch = root.querySelector('.sm-annotate-swatch[data-color="#15d33b"]') as HTMLButtonElement;
      swatch.click();
      expect(tool.colorPicker.value).toBe('#15d33b');
      expect(tool.selectedColor).toBe('#15d33b');
      expect(swatch.classList.contains('active')).toBe(true);
    });

    it('sets the stroke width from the slider', () => {
      create();
      const range = root.querySelector('.sm-annotate-size-range') as HTMLInputElement;
      range.value = '8';
      range.dispatchEvent(new Event('input'));
      expect(tool.selectedStrokeSize).toBe(8);
    });

    it('is removed on destroy', () => {
      create();
      tool.destroy();
      expect(root.querySelector('.sm-annotate-sheet')).toBeNull();
      expect(root.classList.contains('sm-annotate-mobile')).toBe(false);
    });
  });

  it('pauses playback when a drawing tool is picked', () => {
    create();
    Object.defineProperty(video, 'paused', { value: false, configurable: true });
    const pause = vi.spyOn(video, 'pause').mockImplementation(() => {});
    tool.getButtonForTool('rectangle').click();
    expect(pause).toHaveBeenCalled();
    expect(tool.currentTool).toBe('rectangle');
  });

  describe('shape actions', () => {
    const button = (control: string) =>
      tool.uiContainer.querySelector(`[data-control="${control}"]`) as HTMLButtonElement;

    it('shows delete and duplicate only while the move tool has a selection', () => {
      create();
      const move = tool.pluginForTool('move') as unknown as MoveToolPlugin;
      const selected = vi.spyOn(move, 'getSelectedShape').mockReturnValue(null);
      tool.currentTool = 'move';
      tool.redrawFullCanvas();
      expect(button('delete').style.display).toBe('none');

      selected.mockReturnValue({ type: 'rectangle' } as never);
      tool.redrawFullCanvas();
      expect(button('delete').style.display).toBe('');
      expect(button('duplicate').style.display).toBe('');

      tool.currentTool = 'curve';
      tool.redrawFullCanvas();
      expect(button('delete').style.display).toBe('none');
    });

    it('runs delete and duplicate on the move tool', () => {
      create();
      const move = tool.pluginForTool('move') as unknown as MoveToolPlugin;
      const del = vi.spyOn(move, 'deleteSelectedShape').mockImplementation(() => {});
      const dup = vi.spyOn(move, 'duplicateSelectedShape').mockImplementation(() => {});
      button('duplicate').click();
      button('delete').click();
      expect(dup).toHaveBeenCalledTimes(1);
      expect(del).toHaveBeenCalledTimes(1);
    });
  });

  it('long-pressing previous frame jumps to the previous annotation without also stepping a frame', () => {
    vi.useFakeTimers();
    try {
      create();
      const prev = vi.spyOn(tool, 'prevFrame').mockImplementation(() => {});
      const prevAnnotated = vi.spyOn(tool, 'prevAnnotatedFrame').mockImplementation(() => {});
      const button = tool.playerControlsContainer.querySelector('[data-tooltip^="Previous frame"]') as HTMLButtonElement;

      button.dispatchEvent(new Event('pointerdown'));
      vi.advanceTimersByTime(600);
      button.dispatchEvent(new Event('pointerup'));
      button.click();

      expect(prevAnnotated).toHaveBeenCalledTimes(1);
      expect(prev).not.toHaveBeenCalled();

      // A normal tap still steps one frame
      button.dispatchEvent(new Event('pointerdown'));
      button.dispatchEvent(new Event('pointerup'));
      button.click();
      expect(prev).toHaveBeenCalledTimes(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
