import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ISelection, SelectionToolPlugin } from '../src/plugins/selection';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('SelectionToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize selection coordinates relative to canvas size', () => {
      const plugin = Object.create(SelectionToolPlugin.prototype);

      const shape: ISelection = {
        type: 'selection',
        x: 100,
        y: 50,
        width: 200,
        height: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x).toBe(0.25); // 100 / 400
      expect(normalized.y).toBe(0.25); // 50 / 200
      expect(normalized.width).toBe(0.5); // 200 / 400
      expect(normalized.height).toBe(0.5); // 100 / 200
    });
  });

  describe('move', () => {
    it('should move selection by delta values', () => {
      const plugin = Object.create(SelectionToolPlugin.prototype);

      const shape: ISelection = {
        type: 'selection',
        x: 100,
        y: 100,
        width: 50,
        height: 30,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 30, -20);

      expect(moved.x).toBe(130);
      expect(moved.y).toBe(80);
      expect(moved.width).toBe(50); // width should remain unchanged
      expect(moved.height).toBe(30); // height should remain unchanged
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = Object.create(SelectionToolPlugin.prototype);

    const shape: ISelection = {
      type: 'selection',
      x: 100,
      y: 100,
      width: 100,
      height: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is inside selection bounds', () => {
      expect(plugin.isPointerAtShape(shape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 200, 150)).toBe(true);
    });

    it('should return false when pointer is outside selection bounds', () => {
      expect(plugin.isPointerAtShape(shape, 50, 125)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 250, 125)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 50)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 200)).toBe(false);
    });
  });

  describe('isPointerAtShape - negative dimensions', () => {
    const plugin = Object.create(SelectionToolPlugin.prototype);

    const negativeWidthShape: ISelection = {
      type: 'selection',
      x: 200,
      y: 100,
      width: -100,
      height: 50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative width correctly', () => {
      expect(plugin.isPointerAtShape(negativeWidthShape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(negativeWidthShape, 50, 125)).toBe(false);
    });

    const negativeHeightShape: ISelection = {
      type: 'selection',
      x: 100,
      y: 150,
      width: 100,
      height: -50,
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should handle negative height correctly', () => {
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 125)).toBe(true);
      expect(plugin.isPointerAtShape(negativeHeightShape, 150, 175)).toBe(false);
    });
  });

  describe('drawing methods', () => {
    let plugin: SelectionToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockCtx.save = vi.fn();
      mockCtx.restore = vi.fn();
      mockCtx.fillRect = vi.fn();
      mockCtx.strokeRect = vi.fn();
      mockCtx.setLineDash = vi.fn();
      mockCtx.getImageData = vi.fn(() => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }));
      mockCtx.putImageData = vi.fn();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      mockAnnotationTool.clearCanvas = vi.fn();
      mockAnnotationTool.drawShapesOverlay = vi.fn();
      mockAnnotationTool.addVideoOverlay = vi.fn();
      mockAnnotationTool.redrawFullCanvas = vi.fn();
      mockAnnotationTool.globalShapes = [];
      mockAnnotationTool.pixelRatio = 1;
      plugin = new SelectionToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('reset', () => {
      it('should reset selectedArea and call parent reset', () => {
        plugin.selectedArea = {} as ImageData;
        plugin.startX = 100;
        plugin.startY = 100;
        plugin.isDrawing = true;

        plugin.reset();

        expect(plugin.selectedArea).toBeNull();
        expect(plugin.startX).toBe(0);
        expect(plugin.startY).toBe(0);
        expect(plugin.isDrawing).toBe(false);
      });
    });

    describe('onPointerDown', () => {
      it('should set start coordinates and isDrawing flag', () => {
        const event = createMockPointerEvent(50, 75);

        plugin.onPointerDown(event);

        expect(plugin.startX).toBe(50);
        expect(plugin.startY).toBe(75);
        expect(plugin.isDrawing).toBe(true);
        expect(plugin.selectedArea).toBeNull();
      });
    });

    describe('onPointerMove', () => {
      it('should not draw when not in drawing mode', () => {
        plugin.isDrawing = false;
        const event = createMockPointerEvent(100, 100);

        plugin.onPointerMove(event);

        expect(mockAnnotationTool.clearCanvas).not.toHaveBeenCalled();
      });

      it('should clear canvas and draw selection rect when in drawing mode', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        mockAnnotationTool.globalShapes = [];
        const event = createMockPointerEvent(110, 100);

        plugin.onPointerMove(event);

        expect(mockAnnotationTool.clearCanvas).toHaveBeenCalled();
        expect(mockAnnotationTool.addVideoOverlay).toHaveBeenCalled();
      });

      it('should draw shapes overlay when global shapes exist', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        mockAnnotationTool.globalShapes = [{ type: 'compare', x: 100 }] as any;
        const event = createMockPointerEvent(110, 100);

        plugin.onPointerMove(event);

        expect(mockAnnotationTool.clearCanvas).toHaveBeenCalled();
        expect(mockAnnotationTool.drawShapesOverlay).toHaveBeenCalled();
      });
    });

    describe('onPointerUp', () => {
      it('should not process when not in drawing mode', () => {
        plugin.isDrawing = false;
        const event = createMockPointerEvent(100, 100);

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.redrawFullCanvas).not.toHaveBeenCalled();
      });

      it('should reject zero-size selections', () => {
        plugin.isDrawing = true;
        plugin.startX = 100;
        plugin.startY = 100;
        const event = createMockPointerEvent(100, 100); // same point

        plugin.onPointerUp(event);

        expect(plugin.isDrawing).toBe(false);
        expect(mockAnnotationTool.redrawFullCanvas).toHaveBeenCalled();
      });

      it('should return early if video element is not HTMLVideoElement', () => {
        plugin.isDrawing = true;
        plugin.startX = 50;
        plugin.startY = 50;
        mockAnnotationTool.videoElement = null;
        const event = createMockPointerEvent(150, 150);

        plugin.onPointerUp(event);

        expect(mockAnnotationTool.redrawFullCanvas).not.toHaveBeenCalled();
      });

      it('should handle wider video than canvas (letterboxing vertically)', () => {
        plugin.isDrawing = true;
        plugin.startX = 50;
        plugin.startY = 50;

        // Create mock video element with wider aspect ratio than canvas
        // Video: 1920/1080 = 1.78, Canvas: 800/600 = 1.33
        // So video is wider than canvas
        const mockVideo = document.createElement('video');
        Object.defineProperty(mockVideo, 'videoWidth', { value: 1920 });
        Object.defineProperty(mockVideo, 'videoHeight', { value: 1080 });
        mockAnnotationTool.videoElement = mockVideo;
        mockAnnotationTool.canvasWidth = 800;
        mockAnnotationTool.canvasHeight = 600;

        // Mock pluginForTool
        const mockImagePlugin = {
          save: vi.fn()
        };
        mockAnnotationTool.pluginForTool = vi.fn(() => mockImagePlugin);
        mockAnnotationTool.currentTool = 'selection';

        const event = createMockPointerEvent(150, 150);

        // This should hit the wider video branch (lines 111-112)
        plugin.onPointerUp(event);

        // Check that currentTool was set to 'move'
        expect(mockAnnotationTool.currentTool).toBe('move');
      });

      it('should handle video capture with valid video element', async () => {
        plugin.isDrawing = true;
        plugin.startX = 50;
        plugin.startY = 50;

        const mockVideo = document.createElement('video');
        Object.defineProperty(mockVideo, 'videoWidth', { value: 800 });
        Object.defineProperty(mockVideo, 'videoHeight', { value: 600 });
        mockAnnotationTool.videoElement = mockVideo;
        mockAnnotationTool.canvasWidth = 800;
        mockAnnotationTool.canvasHeight = 600;

        const mockImagePlugin = {
          save: vi.fn()
        };
        mockAnnotationTool.pluginForTool = vi.fn(() => mockImagePlugin);

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const event = createMockPointerEvent(150, 150);
        plugin.onPointerUp(event);

        // Clean up
        consoleErrorSpy.mockRestore();
        // May succeed or fail depending on canvas context availability
      });

      it('should handle error in catch block', () => {
        plugin.isDrawing = true;
        plugin.startX = 50;
        plugin.startY = 50;

        const mockVideo = document.createElement('video');
        Object.defineProperty(mockVideo, 'videoWidth', { value: 800 });
        Object.defineProperty(mockVideo, 'videoHeight', { value: 600 });
        mockAnnotationTool.videoElement = mockVideo;
        mockAnnotationTool.canvasWidth = 800;
        mockAnnotationTool.canvasHeight = 600;

        // Force an error by making document.createElement fail for temp canvas
        const originalCreateElement = document.createElement.bind(document);
        let callCount = 0;
        vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
          callCount++;
          if (tag === 'canvas' && callCount > 1) {
            throw new Error('Canvas creation failed');
          }
          return originalCreateElement(tag);
        });

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        const event = createMockPointerEvent(150, 150);
        plugin.onPointerUp(event);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Error capturing selection:', expect.any(Error));
        expect(plugin.isDrawing).toBe(false);

        consoleErrorSpy.mockRestore();
        vi.restoreAllMocks();
      });
    });

    describe('draw', () => {
      it('should call drawSelectionRect with shape coordinates', () => {
        const shape: ISelection = {
          type: 'selection',
          x: 100,
          y: 100,
          width: 50,
          height: 30,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.fillRect).toHaveBeenCalled();
        expect(mockCtx.strokeRect).toHaveBeenCalled();
      });
    });

    describe('drawSelectionRect', () => {
      it('should draw selection rectangle with overlay', () => {
        plugin.drawSelectionRect(10, 20, 100, 80);

        expect(mockCtx.fillRect).toHaveBeenCalled();
        expect(mockCtx.getImageData).toHaveBeenCalled();
        expect(mockCtx.putImageData).toHaveBeenCalled();
        expect(mockCtx.strokeRect).toHaveBeenCalled();
        expect(mockCtx.setLineDash).toHaveBeenCalledWith([5, 5]);
      });

      it('should handle negative dimensions', () => {
        plugin.drawSelectionRect(100, 100, -50, -30);

        expect(mockCtx.fillRect).toHaveBeenCalled();
        expect(mockCtx.strokeRect).toHaveBeenCalled();
      });

      it('should skip getImageData for zero-size selections', () => {
        mockCtx.getImageData = vi.fn();
        plugin.drawSelectionRect(100, 100, 0, 0);

        expect(mockCtx.getImageData).not.toHaveBeenCalled();
      });

      it('should handle getImageData failure (CORS) and fallback to video redraw', () => {
        mockCtx.getImageData = vi.fn(() => {
          throw new Error('CORS error');
        });

        // Create real video element
        const mockVideo = document.createElement('video');
        Object.defineProperty(mockVideo, 'videoWidth', { value: 800 });
        Object.defineProperty(mockVideo, 'videoHeight', { value: 600 });
        mockAnnotationTool.videoElement = mockVideo;
        mockAnnotationTool.videoFrameBuffer = null;
        mockCtx.drawImage = vi.fn();

        plugin.drawSelectionRect(10, 20, 100, 80);

        expect(mockCtx.drawImage).toHaveBeenCalled();
        expect(mockCtx.strokeRect).toHaveBeenCalled();
      });

      it('should use videoFrameBuffer when available in fallback', () => {
        mockCtx.getImageData = vi.fn(() => {
          throw new Error('CORS error');
        });

        const mockFrame = {
          width: 800,
          height: 600,
        };
        // Create real video element
        const mockVideo = document.createElement('video');
        Object.defineProperty(mockVideo, 'videoWidth', { value: 800 });
        Object.defineProperty(mockVideo, 'videoHeight', { value: 600 });
        Object.defineProperty(mockVideo, 'currentTime', { value: 1.5 });
        mockAnnotationTool.videoElement = mockVideo;
        mockAnnotationTool.videoFrameBuffer = {
          frameNumberFromTime: vi.fn(() => 45),
          getFrame: vi.fn(() => mockFrame),
        };
        mockCtx.drawImage = vi.fn();

        plugin.drawSelectionRect(10, 20, 100, 80);

        expect(mockAnnotationTool.videoFrameBuffer.frameNumberFromTime).toHaveBeenCalledWith(1.5);
        expect(mockAnnotationTool.videoFrameBuffer.getFrame).toHaveBeenCalledWith(45);
        expect(mockCtx.drawImage).toHaveBeenCalled();
      });

      it('should skip fallback when video is not HTMLVideoElement', () => {
        mockCtx.getImageData = vi.fn(() => {
          throw new Error('CORS error');
        });

        mockAnnotationTool.videoElement = { nodeName: 'IMG' }; // Not a video
        mockCtx.drawImage = vi.fn();

        plugin.drawSelectionRect(10, 20, 100, 80);

        expect(mockCtx.drawImage).not.toHaveBeenCalled();
      });
    });
  });
});
