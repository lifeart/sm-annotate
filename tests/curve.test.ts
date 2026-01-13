import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ICurve, CurveToolPlugin } from '../src/plugins/curve';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';
import { colorMap } from '../src/plugins/utils/color-map';

describe('CurveToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize curve points relative to canvas size', () => {
      const plugin = Object.create(CurveToolPlugin.prototype);

      const shape: ICurve = {
        type: 'curve',
        points: [
          { x: 100, y: 50 },
          { x: 200, y: 100 },
          { x: 300, y: 150 },
        ],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.points[0].x).toBe(0.25); // 100 / 400
      expect(normalized.points[0].y).toBe(0.25); // 50 / 200
      expect(normalized.points[1].x).toBe(0.5); // 200 / 400
      expect(normalized.points[1].y).toBe(0.5); // 100 / 200
      expect(normalized.points[2].x).toBe(0.75); // 300 / 400
      expect(normalized.points[2].y).toBe(0.75); // 150 / 200
    });
  });

  describe('move', () => {
    it('should move all curve points by delta values', () => {
      const plugin = Object.create(CurveToolPlugin.prototype);

      const shape: ICurve = {
        type: 'curve',
        points: [
          { x: 100, y: 100 },
          { x: 150, y: 120 },
          { x: 200, y: 100 },
        ],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 50, -25);

      expect(moved.points[0].x).toBe(150);
      expect(moved.points[0].y).toBe(75);
      expect(moved.points[1].x).toBe(200);
      expect(moved.points[1].y).toBe(95);
      expect(moved.points[2].x).toBe(250);
      expect(moved.points[2].y).toBe(75);
    });
  });

  describe('isPointerAtShape', () => {
    let plugin: CurveToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new CurveToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    const shape: ICurve = {
      type: 'curve',
      points: [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 100, y: 0 },
      ],
      strokeStyle: '#000',
      fillStyle: '#fff',
      lineWidth: 1,
    };

    it('should return true when pointer is on the curve', () => {
      expect(plugin.isPointerAtShape(shape, 25, 0)).toBe(true);
      expect(plugin.isPointerAtShape(shape, 75, 0)).toBe(true);
    });

    it('should return true when pointer is near the curve (within tolerance)', () => {
      expect(plugin.isPointerAtShape(shape, 25, 3)).toBe(true);
    });

    it('should return true at start point', () => {
      expect(plugin.isPointerAtShape(shape, 0, 0)).toBe(true);
    });

    it('should return true at end point', () => {
      expect(plugin.isPointerAtShape(shape, 100, 0)).toBe(true);
    });

    it('should return false when pointer is far from the curve', () => {
      expect(plugin.isPointerAtShape(shape, 50, 50)).toBe(false);
    });

    it('should return false when pointer is beyond curve endpoints', () => {
      expect(plugin.isPointerAtShape(shape, -50, 0)).toBe(false);
      expect(plugin.isPointerAtShape(shape, 150, 0)).toBe(false);
    });

    it('should use shape lineWidth for tolerance calculation', () => {
      const thinCurve: ICurve = {
        type: 'curve',
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
        ],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const thickCurve: ICurve = {
        type: 'curve',
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 0 },
        ],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 20,
      };

      // At y=8, thin curve should not be detected (tolerance ~5)
      expect(plugin.isPointerAtShape(thinCurve, 50, 8)).toBe(false);
      // At y=8, thick curve should be detected (tolerance ~10)
      expect(plugin.isPointerAtShape(thickCurve, 50, 8)).toBe(true);
    });

    it('should return false for empty points array', () => {
      const shape: ICurve = {
        type: 'curve',
        points: [],
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      expect(plugin.isPointerAtShape(shape, 50, 50)).toBe(false);
    });

    it('should return false for undefined points', () => {
      const shape = {
        type: 'curve',
        points: undefined,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      } as unknown as ICurve;

      expect(plugin.isPointerAtShape(shape, 50, 50)).toBe(false);
    });
  });

  describe('drawing methods', () => {
    let plugin: CurveToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockCtx.quadraticCurveTo = vi.fn();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new CurveToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('draw', () => {
      it('should call drawCurve with shape', () => {
        const shape: ICurve = {
          type: 'curve',
          points: [
            { x: 0, y: 0 },
            { x: 50, y: 50 },
            { x: 100, y: 0 },
          ],
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
        expect(mockCtx.quadraticCurveTo).toHaveBeenCalled();
        expect(mockCtx.stroke).toHaveBeenCalled();
      });

      it('should not draw with empty points array', () => {
        const shape: ICurve = {
          type: 'curve',
          points: [],
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.beginPath).not.toHaveBeenCalled();
        expect(mockCtx.stroke).not.toHaveBeenCalled();
      });

      it('should not draw with undefined points', () => {
        const shape = {
          type: 'curve',
          points: undefined,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        } as unknown as ICurve;

        plugin.draw(shape);

        expect(mockCtx.beginPath).not.toHaveBeenCalled();
        expect(mockCtx.stroke).not.toHaveBeenCalled();
      });
    });

    describe('drawCurve', () => {
      it('should draw a dot for single point curves', () => {
        const shape = {
          points: [
            { x: 50, y: 50 },
            { x: 50, y: 50 },
          ],
          lineWidth: 4,
        };

        plugin.drawCurve(shape);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 1, 0, 2 * Math.PI);
        expect(mockCtx.stroke).toHaveBeenCalled();
      });

      it('should draw quadratic curves for multiple points', () => {
        const shape = {
          points: [
            { x: 0, y: 0 },
            { x: 50, y: 50 },
            { x: 100, y: 0 },
          ],
          lineWidth: 2,
        };

        plugin.drawCurve(shape);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
        expect(mockCtx.quadraticCurveTo).toHaveBeenCalledTimes(2);
        expect(mockCtx.stroke).toHaveBeenCalled();
      });
    });

    describe('reset', () => {
      it('should reset curvePoints', () => {
        plugin.curvePoints = [{ x: 1, y: 2 }];
        plugin.startX = 10;
        plugin.startY = 20;
        plugin.isDrawing = true;

        plugin.reset();

        expect(plugin.curvePoints).toEqual([]);
        expect(plugin.startX).toBe(0);
        expect(plugin.startY).toBe(0);
        expect(plugin.isDrawing).toBe(false);
      });
    });

    describe('onPointerDown', () => {
      it('should not start drawing if already drawing', () => {
        plugin.isDrawing = true;
        plugin.curvePoints = [{ x: 1, y: 2 }];
        const event = createMockPointerEvent(50, 75);

        plugin.onPointerDown(event);

        // Should not reset curvePoints
        expect(plugin.curvePoints).toEqual([{ x: 1, y: 2 }]);
      });

      it('should start drawing if not already drawing', () => {
        plugin.isDrawing = false;
        const event = createMockPointerEvent(50, 75);

        plugin.onPointerDown(event);

        expect(plugin.startX).toBe(50);
        expect(plugin.startY).toBe(75);
        expect(plugin.isDrawing).toBe(true);
        expect(plugin.curvePoints).toEqual([{ x: 50, y: 75 }]);
      });
    });

    describe('onDeactivate', () => {
      it('should clear zoom context and canvas', () => {
        plugin.zoomCtx = {} as any;
        plugin.zoomCanvas = {} as any;

        plugin.onDeactivate();

        expect(plugin.zoomCtx).toBeNull();
        expect(plugin.zoomCanvas).toBeNull();
      });
    });

    describe('onActivate', () => {
      it('should initialize zoom canvas and add keypress listener', () => {
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

        plugin.onActivate();

        expect(addEventListenerSpy).toHaveBeenCalledWith('keypress', expect.any(Function));
        expect(plugin.zoomCanvas).not.toBeNull();

        addEventListenerSpy.mockRestore();
      });
    });

    describe('initZoomCanvas', () => {
      it('should create zoom canvas with correct dimensions', () => {
        plugin.zoomRadius = 100;

        plugin.initZoomCanvas();

        expect(plugin.zoomCanvas).not.toBeNull();
        expect(plugin.zoomCtx).not.toBeNull();
        expect(plugin.zoomCanvas!.width).toBe(400); // 100 * 2 * 2
        expect(plugin.zoomCanvas!.height).toBe(400);
      });
    });

    describe('onPointerMove - not drawing', () => {
      it('should call drawZoomCircle when not drawing', () => {
        plugin.isDrawing = false;
        const event = { ...createMockPointerEvent(100, 100), shiftKey: false };

        // Should not throw
        expect(() => plugin.onPointerMove(event as PointerEvent)).not.toThrow();
      });
    });

    describe('onPointerMove - while drawing', () => {
      it('should add point and draw curve while drawing', () => {
        plugin.isDrawing = true;
        plugin.curvePoints = [{ x: 0, y: 0 }];
        mockCtx.lineWidth = 2;
        const event = { ...createMockPointerEvent(50, 50), shiftKey: false };

        plugin.onPointerMove(event as PointerEvent);

        expect(plugin.curvePoints.length).toBe(2);
        expect(plugin.curvePoints[1]).toEqual({ x: 50, y: 50 });
        expect(mockCtx.beginPath).toHaveBeenCalled();
      });

      it('should call drawZoomCircle with shiftKey after drawing', () => {
        plugin.isDrawing = true;
        plugin.curvePoints = [{ x: 0, y: 0 }];
        mockCtx.lineWidth = 2;
        mockAnnotationTool.clearCanvas = vi.fn();
        mockAnnotationTool.addVideoOverlay = vi.fn();
        mockAnnotationTool.drawShapesOverlay = vi.fn();
        const event = { ...createMockPointerEvent(50, 50), shiftKey: true };

        plugin.onPointerMove(event as PointerEvent);

        expect(plugin.curvePoints.length).toBe(2);
      });
    });

    describe('onPointerUp', () => {
      it('should not save when not in drawing mode', () => {
        plugin.isDrawing = false;
        const event = { ...createMockPointerEvent(100, 100), shiftKey: false };

        plugin.onPointerUp(event as PointerEvent);

        expect(mockAnnotationTool.addShape).not.toHaveBeenCalled();
      });

      it('should save curve shape with optimized points', () => {
        plugin.isDrawing = true;
        plugin.curvePoints = [
          { x: 0, y: 0 },
          { x: 50, y: 50 },
          { x: 100, y: 0 },
        ];
        mockCtx.strokeStyle = '#ff0000';
        mockCtx.fillStyle = '#00ff00';
        mockCtx.lineWidth = 3;
        const event = { ...createMockPointerEvent(150, 50), shiftKey: false };

        plugin.onPointerUp(event as PointerEvent);

        expect(mockAnnotationTool.addShape).toHaveBeenCalled();
        expect(plugin.isDrawing).toBe(false);
        expect(plugin.curvePoints).toEqual([]);
      });
    });

    describe('onKeyPress', () => {
      it('should ignore space key', () => {
        const event = { key: ' ', isComposing: false } as KeyboardEvent;
        // Should not throw
        expect(() => plugin.onKeyPress(event)).not.toThrow();
      });

      it('should ignore composing events', () => {
        const event = { key: '1', isComposing: true } as KeyboardEvent;
        // Should not throw
        expect(() => plugin.onKeyPress(event)).not.toThrow();
      });

      it('should set stroke size for numeric keys', () => {
        mockAnnotationTool.strokeSizePicker = { value: '' };
        mockAnnotationTool.setCanvasSettings = vi.fn();
        const event = { key: '5', isComposing: false } as KeyboardEvent;

        plugin.onKeyPress(event);

        expect(mockAnnotationTool.strokeSizePicker.value).toBe('5');
        expect(mockAnnotationTool.setCanvasSettings).toHaveBeenCalled();
      });

      it('should set color for color keys', () => {
        mockAnnotationTool.colorPicker = { value: '' };
        mockAnnotationTool.setCanvasSettings = vi.fn();
        const event = { key: 'r', isComposing: false } as KeyboardEvent;

        plugin.onKeyPress(event);

        expect(mockAnnotationTool.colorPicker.value).toBe(colorMap['r']);
        expect(mockAnnotationTool.setCanvasSettings).toHaveBeenCalled();
      });

      it('should ignore non-numeric non-color keys', () => {
        mockAnnotationTool.colorPicker = { value: '' };
        mockAnnotationTool.setCanvasSettings = vi.fn();
        const event = { key: '!', isComposing: false } as KeyboardEvent;

        plugin.onKeyPress(event);

        // '!' is not in colorMap and not numeric, so nothing should be set
        expect(mockAnnotationTool.colorPicker.value).toBe('');
      });
    });

    describe('drawZoomCircle', () => {
      it('should not draw when not enabled', () => {
        plugin.drawZoomCircle(100, 100, false);
        // Should not throw and not draw
      });

      it('should not draw without zoom context', () => {
        plugin.zoomCtx = null;
        mockAnnotationTool.clearCanvas = vi.fn();
        mockAnnotationTool.addVideoOverlay = vi.fn();
        mockAnnotationTool.drawShapesOverlay = vi.fn();
        plugin.isDrawing = false;
        plugin.drawZoomCircle(100, 100, true);
        // Should call canvas methods but stop early due to no zoomCtx
        expect(mockAnnotationTool.clearCanvas).toHaveBeenCalled();
      });

      it('should draw full zoom circle when enabled with context', () => {
        // Create a proper zoom context
        const mockZoomCtx = {
          clearRect: vi.fn(),
          drawImage: vi.fn(),
        };
        const mockZoomCanvas = {
          width: 400,
          height: 400,
        };
        plugin.zoomCtx = mockZoomCtx as any;
        plugin.zoomCanvas = mockZoomCanvas as any;
        plugin.zoomRadius = 100;
        plugin.zoomScale = 2;
        mockAnnotationTool.pixelRatio = 1;
        mockAnnotationTool.clearCanvas = vi.fn();
        mockAnnotationTool.addVideoOverlay = vi.fn();
        mockAnnotationTool.drawShapesOverlay = vi.fn();
        mockCtx.canvas = { width: 800, height: 600 } as any;
        mockCtx.save = vi.fn();
        mockCtx.restore = vi.fn();
        mockCtx.clip = vi.fn();
        mockCtx.closePath = vi.fn();
        mockCtx.drawImage = vi.fn();
        plugin.isDrawing = false;

        plugin.drawZoomCircle(100, 100, true);

        expect(mockZoomCtx.clearRect).toHaveBeenCalledWith(0, 0, 400, 400);
        expect(mockZoomCtx.drawImage).toHaveBeenCalled();
        expect(mockCtx.save).toHaveBeenCalled();
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(100, 100, 100, 0, 2 * Math.PI);
        expect(mockCtx.closePath).toHaveBeenCalled();
        expect(mockCtx.clip).toHaveBeenCalled();
        expect(mockCtx.drawImage).toHaveBeenCalled();
        expect(mockCtx.restore).toHaveBeenCalled();
      });

      it('should skip canvas clear/draw when isDrawing is true', () => {
        const mockZoomCtx = {
          clearRect: vi.fn(),
          drawImage: vi.fn(),
        };
        const mockZoomCanvas = {
          width: 400,
          height: 400,
        };
        plugin.zoomCtx = mockZoomCtx as any;
        plugin.zoomCanvas = mockZoomCanvas as any;
        mockAnnotationTool.pixelRatio = 1;
        mockAnnotationTool.clearCanvas = vi.fn();
        mockAnnotationTool.addVideoOverlay = vi.fn();
        mockAnnotationTool.drawShapesOverlay = vi.fn();
        mockCtx.canvas = { width: 800, height: 600 } as any;
        mockCtx.save = vi.fn();
        mockCtx.restore = vi.fn();
        mockCtx.clip = vi.fn();
        mockCtx.closePath = vi.fn();
        mockCtx.drawImage = vi.fn();
        plugin.isDrawing = true;

        plugin.drawZoomCircle(100, 100, true);

        // Should NOT call clearCanvas when isDrawing is true
        expect(mockAnnotationTool.clearCanvas).not.toHaveBeenCalled();
        // But should still draw zoom
        expect(mockZoomCtx.drawImage).toHaveBeenCalled();
      });
    });
  });
});
