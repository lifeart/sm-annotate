import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { computeDifferenceImage, fitRect } from '../src/plugins/utils/image-difference';
import { ICompare, CompareToolPlugin } from '../src/plugins/compare';
import { AnnotationTool } from '../src/core';
import { initUI } from '../src/ui';
import { initCanvas } from '../src/canvas';
import { addFrameSquareOverlay } from '../src/overlays/frame-number';
import { addVideoOverlay } from '../src/overlays/video';
import { addProgressBarOverlay } from '../src/overlays/progress-bar';
import { defaultConfig, mergeConfig } from '../src/config';
import {
  createMockContext,
  createMockAnnotationTool,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

AnnotationTool.prototype.initUI = initUI;
AnnotationTool.prototype.initCanvas = initCanvas;
AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

function pixels(...rgb: [number, number, number][]) {
  const data = new Uint8ClampedArray(rgb.length * 4);
  rgb.forEach(([r, g, b], i) => {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = 255;
  });
  return data;
}

describe('computeDifferenceImage', () => {
  it('renders identical pixels as grayscale of the first image', () => {
    const a = pixels([100, 150, 200]);
    const out = new Uint8ClampedArray(4);

    const changed = computeDifferenceImage(a, pixels([100, 150, 200]), out);

    const v = Math.round(0.299 * 100 + 0.587 * 150 + 0.114 * 200);
    expect(Array.from(out)).toEqual([v, v, v, 255]);
    expect(changed).toBe(0);
  });

  it('marks pixels brighter in the first image red and darker ones blue', () => {
    const a = pixels([200, 200, 200], [10, 10, 10]);
    const b = pixels([10, 10, 10], [200, 200, 200]);
    const out = new Uint8ClampedArray(8);

    const changed = computeDifferenceImage(a, b, out);

    expect(Array.from(out.slice(0, 4))).toEqual([255, 0, 0, 255]);
    expect(Array.from(out.slice(4, 8))).toEqual([0, 0, 255, 255]);
    expect(changed).toBe(2);
  });

  it('treats differences within the threshold as equal', () => {
    const a = pixels([100, 100, 100], [100, 100, 100]);
    const b = pixels([105, 103, 100], [140, 100, 100]);
    const out = new Uint8ClampedArray(8);

    const changed = computeDifferenceImage(a, b, out, 10);

    expect(out[0]).toBe(out[1]); // grayscale
    expect(Array.from(out.slice(4, 8))).toEqual([0, 0, 255, 255]);
    expect(changed).toBe(1);
  });

  it('colors hue-only changes instead of leaving them black', () => {
    // Same red channel, different green: the issue sample would output black
    const out = new Uint8ClampedArray(4);
    computeDifferenceImage(pixels([50, 200, 50]), pixels([50, 20, 50]), out);
    expect(Array.from(out)).toEqual([255, 0, 0, 255]);
  });

  it('always writes an opaque alpha', () => {
    const a = new Uint8ClampedArray([1, 2, 3, 0]);
    const out = new Uint8ClampedArray(4);
    computeDifferenceImage(a, a, out);
    expect(out[3]).toBe(255);
  });
});

describe('fitRect', () => {
  it('fills the destination when aspect ratios match', () => {
    expect(fitRect(1280, 720, 800, 450)).toEqual({ x: 0, y: 0, width: 800, height: 450 });
  });

  it('letterboxes a wider source', () => {
    const rect = fitRect(2000, 500, 800, 400);
    expect(rect.x).toBe(0);
    expect(rect.width).toBe(800);
    expect(rect.height).toBe(200);
    expect(rect.y).toBe(100);
  });

  it('pillarboxes a narrower source', () => {
    const rect = fitRect(600, 800, 800, 400);
    expect(rect.y).toBe(0);
    expect(rect.height).toBe(400);
    expect(rect.width).toBe(300);
    expect(rect.x).toBe(250);
  });

  it('falls back to the full destination for unknown source size', () => {
    expect(fitRect(0, 0, 800, 400)).toEqual({ x: 0, y: 0, width: 800, height: 400 });
  });
});

describe('CompareToolPlugin modes', () => {
  let plugin: CompareToolPlugin;
  let mockCtx: MockCanvasContext;
  let mockTool: MockAnnotationTool;
  const shape: ICompare = {
    type: 'compare',
    x: 400,
    disabled: false,
    strokeStyle: '#000',
    fillStyle: '#fff',
    lineWidth: 1,
  };

  function setupVideos(refWidth = 1920, refHeight = 1080) {
    const video1 = document.createElement('video');
    Object.defineProperty(video1, 'videoWidth', { value: 1920 });
    Object.defineProperty(video1, 'videoHeight', { value: 1080 });
    Object.defineProperty(video1, 'currentTime', { value: 1.0 });
    const video2 = document.createElement('video');
    Object.defineProperty(video2, 'videoWidth', { value: refWidth });
    Object.defineProperty(video2, 'videoHeight', { value: refHeight });
    mockTool.videoElement = video1;
    mockTool.referenceVideoElement = video2;
    const mainFrame = { width: 1920, height: 1080, id: 'main' };
    const refFrame = { width: refWidth, height: refHeight, id: 'ref' };
    mockTool.videoFrameBuffer = {
      frameNumberFromTime: vi.fn(() => 25),
      getFrame: vi.fn(() => mainFrame),
    };
    mockTool.referenceVideoFrameBuffer = {
      frameNumberFromTime: vi.fn(() => 25),
      getFrame: vi.fn(() => refFrame),
    };
    return { mainFrame, refFrame };
  }

  beforeEach(() => {
    mockCtx = createMockContext();
    mockCtx.drawImage = vi.fn();
    mockTool = createMockAnnotationTool(mockCtx);
    mockTool.canvasWidth = 800;
    mockTool.canvasHeight = 450;
    mockTool.overlayOpacity = 0.5;
    mockTool.isMobile = false;
    mockTool.differenceThreshold = 30;
    plugin = new CompareToolPlugin(asAnnotationTool(mockTool));
  });

  describe('overlay', () => {
    beforeEach(() => {
      mockTool.compareMode = 'overlay';
    });

    it('draws the main frame, then the full reference frame at overlay opacity', () => {
      const { mainFrame, refFrame } = setupVideos();
      const alphas: number[] = [];
      mockCtx.drawImage = vi.fn(() => alphas.push(mockCtx.globalAlpha));

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalledTimes(2);
      expect(mockCtx.drawImage).toHaveBeenNthCalledWith(1, mainFrame, 0, 0, 1920, 1080, 0, 0, 800, 450);
      expect(mockCtx.drawImage).toHaveBeenNthCalledWith(2, refFrame, 0, 0, 1920, 1080, 0, 0, 800, 450);
      expect(alphas).toEqual([1, 0.5]);
    });

    it('ignores the divider position', () => {
      setupVideos();
      plugin.drawShape({ ...shape, x: 100 });
      const refCall = (mockCtx.drawImage as any).mock.calls[1];
      expect(refCall.slice(5)).toEqual([0, 0, 800, 450]);
    });

    it('keeps the reference aspect ratio', () => {
      setupVideos(1080, 1080);
      plugin.drawShape(shape);
      const refCall = (mockCtx.drawImage as any).mock.calls[1];
      expect(refCall.slice(5)).toEqual([175, 0, 450, 450]);
    });

    it('draws only the main frame when overlay opacity is off', () => {
      setupVideos();
      mockTool.overlayOpacity = 0;
      plugin.drawShape(shape);
      expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
    });

    it('restores global alpha', () => {
      setupVideos();
      mockCtx.globalAlpha = 0.8;
      plugin.drawShape(shape);
      expect(mockCtx.globalAlpha).toBe(0.8);
    });
  });

  describe('difference', () => {
    let offscreenCtx: MockCanvasContext;

    beforeEach(() => {
      mockTool.compareMode = 'difference';
      offscreenCtx = createMockContext();
      offscreenCtx.drawImage = vi.fn();
      offscreenCtx.fillRect = vi.fn();
      offscreenCtx.putImageData = vi.fn();
      const reads = [
        // main: two pixels, second one bright
        { data: pixels([10, 10, 10], [200, 200, 200]) },
        // reference: both dark
        { data: pixels([10, 10, 10], [10, 10, 10]) },
      ];
      let read = 0;
      offscreenCtx.getImageData = vi.fn(() => reads[read++ % 2]);
      offscreenCtx.createImageData = vi.fn(() => ({ data: new Uint8ClampedArray(8) }));
      const realCreate = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tag: string, ...rest: any[]) => {
        const el = realCreate(tag, ...rest);
        if (tag === 'canvas') {
          (el as HTMLCanvasElement).getContext = (() => offscreenCtx) as any;
        }
        return el;
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('renders the colored difference and layers it over the main frame', () => {
      const { mainFrame, refFrame } = setupVideos();

      plugin.drawShape(shape);

      expect(offscreenCtx.drawImage).toHaveBeenCalledWith(mainFrame, 0, 0, 1920, 1080, 0, 0, 800, 450);
      expect(offscreenCtx.drawImage).toHaveBeenCalledWith(refFrame, 0, 0, 1920, 1080, 0, 0, 800, 450);
      const out = (offscreenCtx.putImageData as any).mock.calls[0][0].data;
      expect(Array.from(out.slice(4, 8))).toEqual([255, 0, 0, 255]);
      expect(plugin.differentPixelRatio).toBeCloseTo(1 / (800 * 450));

      // main frame + diff canvas on the visible canvas
      expect(mockCtx.drawImage).toHaveBeenCalledTimes(2);
      const diffCall = (mockCtx.drawImage as any).mock.calls[1];
      expect(diffCall[0]).toBeInstanceOf(HTMLCanvasElement);
      expect(diffCall.slice(5)).toEqual([0, 0, 800, 450]);
    });

    it('caps the offscreen buffer width', () => {
      setupVideos();
      mockTool.canvasWidth = 2560;
      mockTool.canvasHeight = 1440;
      plugin.drawShape(shape);
      const call = (offscreenCtx.drawImage as any).mock.calls[0];
      expect(call.slice(5)).toEqual([0, 0, 1280, 720]);
    });

    it('uses the configured threshold', () => {
      setupVideos();
      mockTool.differenceThreshold = 765;
      plugin.drawShape(shape);
      expect(plugin.differentPixelRatio).toBe(0);
    });

    it('falls back to a difference blend when pixels cannot be read', () => {
      const { refFrame } = setupVideos();
      offscreenCtx.getImageData = vi.fn(() => {
        throw new DOMException('tainted', 'SecurityError');
      });
      mockCtx.globalCompositeOperation = 'source-over';
      const ops: string[] = [];
      mockCtx.drawImage = vi.fn(() => ops.push(mockCtx.globalCompositeOperation));

      plugin.drawShape(shape);
      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalledWith(refFrame, 0, 0, 1920, 1080, 0, 0, 800, 450);
      expect(ops).toEqual(['source-over', 'difference', 'source-over', 'difference']);
      expect(mockCtx.globalCompositeOperation).toBe('source-over');
      // Readback is not retried on every frame
      expect(offscreenCtx.getImageData).toHaveBeenCalledTimes(1);
    });

    it('skips the difference when overlay opacity is off', () => {
      setupVideos();
      mockTool.overlayOpacity = 0;
      plugin.drawShape(shape);
      expect(offscreenCtx.getImageData).not.toHaveBeenCalled();
      expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
    });
  });

  it('only draws the divider while dragging in wipe mode', () => {
    setupVideos();
    plugin.isDrawing = true;
    mockTool.compareMode = 'overlay';
    plugin.onPointerMove({ clientX: 300, clientY: 10 } as PointerEvent);
    expect(mockCtx.stroke).not.toHaveBeenCalled();

    mockTool.compareMode = 'wipe';
    plugin.onPointerMove({ clientX: 300, clientY: 10 } as PointerEvent);
    expect(mockCtx.stroke).toHaveBeenCalled();
  });
});

describe('compare mode config', () => {
  it('defaults to wipe with a noise threshold', () => {
    expect(defaultConfig.compare).toEqual({ mode: 'wipe', differenceThreshold: 30 });
  });

  it('merges partial compare config', () => {
    const config = mergeConfig({ compare: { mode: 'difference' } as any });
    expect(config.compare).toEqual({ mode: 'difference', differenceThreshold: 30 });
  });
});

describe('AnnotationTool compare mode API', () => {
  let tool: AnnotationTool;
  let video: HTMLVideoElement;

  beforeEach(() => {
    video = document.createElement('video');
    Object.defineProperty(video, 'duration', { value: 10, writable: true });
    Object.defineProperty(video, 'videoWidth', { value: 1920, writable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1080, writable: true });
    document.body.appendChild(video);
    tool = new AnnotationTool(video);
  });

  afterEach(() => {
    tool.destroy();
    video.remove();
    // config objects must not leak between instances
    expect(defaultConfig.compare.mode).toBe('wipe');
  });

  it('starts in the configured mode', () => {
    expect(tool.compareMode).toBe('wipe');
    const other = new AnnotationTool(video, { compare: { mode: 'overlay', differenceThreshold: 5 } });
    expect(other.compareMode).toBe('overlay');
    expect(other.differenceThreshold).toBe(5);
    other.destroy();
  });

  it('cycles wipe -> overlay -> difference -> wipe', () => {
    expect(tool.cycleCompareMode()).toBe('overlay');
    expect(tool.cycleCompareMode()).toBe('difference');
    expect(tool.cycleCompareMode()).toBe('wipe');
  });

  it('notifies listeners and supports unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = tool.onCompareModeChange(listener);
    tool.setCompareMode('difference');
    tool.setCompareMode('difference'); // no-op
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('difference');
    unsubscribe();
    tool.setCompareMode('overlay');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('ignores unknown modes', () => {
    tool.setCompareMode('bogus' as any);
    expect(tool.compareMode).toBe('wipe');
  });

  it('clamps the difference threshold', () => {
    tool.setDifferenceThreshold(-5);
    expect(tool.differenceThreshold).toBe(0);
    tool.setDifferenceThreshold(1000);
    expect(tool.differenceThreshold).toBe(765);
    tool.setDifferenceThreshold(NaN);
    expect(tool.differenceThreshold).toBe(765);
  });

  it('reports whether a comparison is shown', () => {
    expect(tool.isCompareActive).toBe(false);
    tool.addGlobalShape({ type: 'compare', x: 0.5, disabled: true } as any);
    expect(tool.isCompareActive).toBe(false);
    tool.globalShapes = [{ type: 'compare', x: 0.5, disabled: false } as any];
    expect(tool.isCompareActive).toBe(true);
  });

  describe('mode button', () => {
    const modeButton = () =>
      tool.buttons.find((b) => b.dataset.linkedTool === 'compare')!;

    it('is hidden and shown together with the compare button', () => {
      expect(modeButton()).toBeDefined();
      expect(modeButton().style.display).toBe('none');
      tool.showButton('compare');
      expect(modeButton().style.display).toBe('');
      expect(tool.getButtonForTool('compare').style.display).toBe('');
      tool.hideButton('compare');
      expect(modeButton().style.display).toBe('none');
    });

    it('cycles the mode and reflects it', () => {
      modeButton().click();
      expect(tool.compareMode).toBe('overlay');
      expect(modeButton().dataset.mode).toBe('overlay');
      tool.setCompareMode('difference');
      expect(modeButton().dataset.mode).toBe('difference');
    });

    it('turns the comparison on when a reference video is loaded', () => {
      modeButton().click();
      expect(tool.isCompareActive).toBe(false);

      tool.referenceVideoElement = document.createElement('video');
      modeButton().click();
      expect(tool.isCompareActive).toBe(true);
      expect(tool.globalShapes.filter((s) => s.type === 'compare')).toHaveLength(1);
      expect((tool.globalShapes[0] as any).x).toBe(0.5);
    });
  });
});
