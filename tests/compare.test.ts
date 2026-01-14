import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ICompare, CompareToolPlugin } from '../src/plugins/compare';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('CompareToolPlugin', () => {
  let plugin: CompareToolPlugin;
  let mockCtx: MockCanvasContext;
  let mockAnnotationTool: MockAnnotationTool;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockAnnotationTool = createMockAnnotationTool(mockCtx);
    mockAnnotationTool.canvasWidth = 800;
    mockAnnotationTool.canvasHeight = 600;
    mockAnnotationTool.overlayOpacity = 1;
    mockAnnotationTool.globalShapes = [];
    mockAnnotationTool.addGlobalShape = vi.fn();
    mockAnnotationTool.serialize = vi.fn((shapes) => shapes.map(s => ({ ...s, x: s.x / 800 })));
    mockAnnotationTool.deserialize = vi.fn((shapes) => shapes.map(s => ({ ...s, x: s.x * 800 })));
    mockAnnotationTool.canvas = { style: { cursor: 'default' }, parentElement: null };
    mockAnnotationTool.addFrameSquareOverlay = vi.fn();
    plugin = new CompareToolPlugin(asAnnotationTool(mockAnnotationTool));
  });

  describe('normalize', () => {
    it('should normalize x coordinate relative to canvas width', () => {
      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 800, 600);

      expect(normalized.x).toBe(0.5); // 400 / 800
    });
  });

  describe('move', () => {
    it('should move compare line by dx only', () => {
      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 50, 25);

      expect(moved.x).toBe(450);
    });
  });

  describe('onActivate', () => {
    it('should set cursor and initialize comparison line', () => {
      plugin.onActivate();

      expect(plugin.comparisonLine).toBe(400); // canvasWidth / 2
      expect(plugin.leftOpacity).toBe(1);
      expect(mockAnnotationTool.canvas.style.cursor).toBe('col-resize');
    });
  });

  describe('onDeactivate', () => {
    it('should reset cursor and comparison state', () => {
      plugin.comparisonLine = 500;
      plugin.isDrawing = true;
      plugin.leftOpacity = 0.5;

      plugin.onDeactivate();

      expect(mockAnnotationTool.canvas.style.cursor).toBe('default');
      expect(plugin.comparisonLine).toBe(0);
      expect(plugin.leftOpacity).toBe(1);
      expect(plugin.isDrawing).toBe(false);
    });
  });

  describe('rightOpacity', () => {
    it('should return overlay opacity from annotation tool', () => {
      mockAnnotationTool.overlayOpacity = 0.75;

      expect(plugin.rightOpacity).toBe(0.75);
    });
  });

  describe('onPointerDown', () => {
    it('should start drawing and disable previous compare shapes', () => {
      mockAnnotationTool.globalShapes = [
        { type: 'compare', x: 0.5, disabled: false },
      ];

      const event = createMockPointerEvent(300, 200);
      plugin.onPointerDown(event);

      expect(plugin.startX).toBe(300);
      expect(plugin.startY).toBe(200);
      expect(plugin.isDrawing).toBe(true);
      expect(mockAnnotationTool.globalShapes[0].disabled).toBe(true);
    });
  });

  describe('onPointerMove', () => {
    it('should not process when not drawing and no global shapes', () => {
      plugin.isDrawing = false;
      mockAnnotationTool.globalShapes = [];

      const event = createMockPointerEvent(400, 300);
      plugin.onPointerMove(event);

      expect(plugin.comparisonLine).toBe(0);
    });

    it('should draw existing compare shape when not drawing', () => {
      plugin.isDrawing = false;
      mockAnnotationTool.globalShapes = [
        { type: 'compare', x: 0.5, disabled: false },
      ];

      const event = createMockPointerEvent(400, 300);
      plugin.onPointerMove(event);

      expect(mockAnnotationTool.deserialize).toHaveBeenCalled();
      expect(mockAnnotationTool.addFrameSquareOverlay).toHaveBeenCalled();
    });

    it('should update comparison line when drawing', () => {
      plugin.isDrawing = true;
      mockCtx.strokeStyle = '#ff0000';
      mockCtx.fillStyle = '#00ff00';
      mockCtx.lineWidth = 2;

      const event = createMockPointerEvent(500, 300);
      plugin.onPointerMove(event);

      expect(plugin.comparisonLine).toBe(500);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalledWith(500, 0);
    });
  });

  describe('onPointerUp', () => {
    it('should not save when not drawing', () => {
      plugin.isDrawing = false;

      plugin.onPointerUp();

      expect(mockAnnotationTool.addGlobalShape).not.toHaveBeenCalled();
    });

    it('should save compare shape when drawing', () => {
      plugin.isDrawing = true;
      plugin.comparisonLine = 400;
      mockCtx.strokeStyle = '#ff0000';
      mockCtx.fillStyle = '#00ff00';
      mockCtx.lineWidth = 2;

      plugin.onPointerUp();

      expect(mockAnnotationTool.addGlobalShape).toHaveBeenCalled();
      expect(plugin.isDrawing).toBe(false);
    });
  });

  describe('save', () => {
    it('should not save if normalized x is less than 0.05', () => {
      mockAnnotationTool.serialize = vi.fn((shapes) => shapes.map(s => ({ ...s, x: 0.02 })));

      const shape: ICompare = {
        type: 'compare',
        x: 16,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.save(shape);

      expect(mockAnnotationTool.addGlobalShape).not.toHaveBeenCalled();
    });

    it('should not save if normalized x is greater than 0.95', () => {
      mockAnnotationTool.serialize = vi.fn((shapes) => shapes.map(s => ({ ...s, x: 0.98 })));

      const shape: ICompare = {
        type: 'compare',
        x: 784,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.save(shape);

      expect(mockAnnotationTool.addGlobalShape).not.toHaveBeenCalled();
    });

    it('should save when normalized x is within valid range', () => {
      mockAnnotationTool.serialize = vi.fn((shapes) => shapes.map(s => ({ ...s, x: 0.5 })));

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.save(shape);

      expect(mockAnnotationTool.addGlobalShape).toHaveBeenCalled();
    });
  });

  describe('removePreviousCompare', () => {
    it('should remove compare shapes from global shapes', () => {
      mockAnnotationTool.globalShapes = [
        { type: 'compare', x: 0.5 },
        { type: 'other', x: 0.3 },
      ];

      plugin.removePreviousCompare();

      expect(mockAnnotationTool.globalShapes).toEqual([{ type: 'other', x: 0.3 }]);
    });
  });

  describe('disablePreviousCompare', () => {
    it('should disable compare shapes', () => {
      mockAnnotationTool.globalShapes = [
        { type: 'compare', x: 0.5, disabled: false },
        { type: 'other', x: 0.3 },
      ];

      plugin.disablePreviousCompare();

      expect(mockAnnotationTool.globalShapes[0].disabled).toBe(true);
      expect(mockAnnotationTool.globalShapes[1]).toEqual({ type: 'other', x: 0.3 });
    });
  });

  describe('drawDelimiter', () => {
    it('should draw vertical line at shape x position', () => {
      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawDelimiter(shape);

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalledWith(400, 0);
      expect(mockCtx.lineTo).toHaveBeenCalledWith(400, 800);
      expect(mockCtx.stroke).toHaveBeenCalled();
    });
  });

  describe('draw', () => {
    it('should return early if shape is disabled', () => {
      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: true,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Should not throw
      expect(() => plugin.draw(shape)).not.toThrow();
    });

    it('should return early if video1 is missing', () => {
      mockAnnotationTool.videoElement = null;

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Should not throw
      expect(() => plugin.draw(shape)).not.toThrow();
    });

    it('should return early if video2 is missing', () => {
      mockAnnotationTool.videoElement = document.createElement('video');
      mockAnnotationTool.referenceVideoElement = null;

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Should not throw
      expect(() => plugin.draw(shape)).not.toThrow();
    });
  });

  describe('drawShape', () => {
    it('should return early if video1 is missing', () => {
      mockAnnotationTool.videoElement = null;

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Should not throw
      expect(() => plugin.drawShape(shape)).not.toThrow();
    });

    it('should return early if video2 is missing', () => {
      mockAnnotationTool.videoElement = document.createElement('video');
      mockAnnotationTool.referenceVideoElement = null;

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Should not throw
      expect(() => plugin.drawShape(shape)).not.toThrow();
    });

    it('should draw with both videos present', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1080 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1920 });
      Object.defineProperty(video2, 'videoHeight', { value: 1080 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
        getFrameNumberBySignature: vi.fn(),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
        getAudioFingerprint: vi.fn(),
      };
      mockCtx.drawImage = vi.fn();
      mockCtx.globalAlpha = 1;

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should handle mobile mode', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1080 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1920 });
      Object.defineProperty(video2, 'videoHeight', { value: 1080 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = true;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => null),
      };
      mockCtx.drawImage = vi.fn();
      mockCtx.imageSmoothingQuality = 'high';

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.imageSmoothingQuality).toBe('low');
    });

    it('should handle different aspect ratios', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1080 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1280 });
      Object.defineProperty(video2, 'videoHeight', { value: 720 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1280, height: 720 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockCtx.drawImage = vi.fn();
      mockCtx.globalAlpha = 1;

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should skip reference video when opacity is 0', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1080 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1920 });
      Object.defineProperty(video2, 'videoHeight', { value: 1080 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.overlayOpacity = 0;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockCtx.drawImage = vi.fn();

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      // Should only call drawImage once (for video1)
      expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
    });

    it('should handle audio sync when reference video is much larger', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 640 });
      Object.defineProperty(video1, 'videoHeight', { value: 480 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      // Reference video is more than 2x larger in both dimensions
      Object.defineProperty(video2, 'videoWidth', { value: 1920 });
      Object.defineProperty(video2, 'videoHeight', { value: 1080 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.overlayOpacity = 1;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
        getFrameNumberBySignature: vi.fn(() => 32), // Return frame 2 away
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 640, height: 480 })),
        getAudioFingerprint: vi.fn(() => [0.1, 0.2, 0.3]),
      };
      mockCtx.drawImage = vi.fn();

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockAnnotationTool.referenceVideoFrameBuffer.getFrameNumberBySignature).toHaveBeenCalled();
      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should handle different video heights (heightDiff > 0)', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1080 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1920 });
      Object.defineProperty(video2, 'videoHeight', { value: 1200 }); // Taller reference

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.overlayOpacity = 1;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1200 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockCtx.drawImage = vi.fn();

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should handle different video heights (heightDiff < 0)', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1200 }); // Main video is taller
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1920 });
      Object.defineProperty(video2, 'videoHeight', { value: 1080 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.overlayOpacity = 1;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1920, height: 1200 })),
      };
      mockCtx.drawImage = vi.fn();

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should handle narrower reference video (widthDiff < 0)', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1920 });
      Object.defineProperty(video1, 'videoHeight', { value: 1080 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1280 }); // Narrower reference
      Object.defineProperty(video2, 'videoHeight', { value: 720 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.overlayOpacity = 1;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1280, height: 720 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockCtx.drawImage = vi.fn();

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should handle wider reference video (widthDiff > 0)', () => {
      const video1 = document.createElement('video');
      Object.defineProperty(video1, 'videoWidth', { value: 1280 });
      Object.defineProperty(video1, 'videoHeight', { value: 720 });
      Object.defineProperty(video1, 'currentTime', { value: 1.0 });

      const video2 = document.createElement('video');
      Object.defineProperty(video2, 'videoWidth', { value: 1920 }); // Wider reference
      Object.defineProperty(video2, 'videoHeight', { value: 1080 });

      mockAnnotationTool.videoElement = video1;
      mockAnnotationTool.referenceVideoElement = video2;
      mockAnnotationTool.isMobile = false;
      mockAnnotationTool.overlayOpacity = 1;
      mockAnnotationTool.referenceVideoFrameBuffer = {
        frameNumberFromTime: vi.fn(() => 30),
        getFrame: vi.fn(() => ({ width: 1920, height: 1080 })),
      };
      mockAnnotationTool.videoFrameBuffer = {
        getFrame: vi.fn(() => ({ width: 1280, height: 720 })),
      };
      mockCtx.drawImage = vi.fn();

      const shape: ICompare = {
        type: 'compare',
        x: 400,
        disabled: false,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.drawShape(shape);

      expect(mockCtx.drawImage).toHaveBeenCalled();
    });
  });
});
