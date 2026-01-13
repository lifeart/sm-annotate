import { describe, it, expect, beforeEach } from 'vitest';
import { LineToolPlugin } from '../src/plugins/line';
import { createPurePlugin, setupPluginTest, pointerAt, DrawingContext } from './helpers/minimal-mocks';
import { createLine, createHorizontalLine, createDiagonalLine, createPointLine } from './helpers/shape-factories';

describe('LineToolPlugin', () => {
  // Pure functions - no mocks needed
  describe('normalize', () => {
    const plugin = createPurePlugin(LineToolPlugin);

    it('should normalize line coordinates relative to canvas size', () => {
      const shape = createLine({ x1: 100, y1: 50, x2: 300, y2: 150 });
      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x1).toBe(0.25);
      expect(normalized.y1).toBe(0.25);
      expect(normalized.x2).toBe(0.75);
      expect(normalized.y2).toBe(0.75);
    });
  });

  describe('move', () => {
    const plugin = createPurePlugin(LineToolPlugin);

    it('should move both endpoints by delta values', () => {
      const shape = createLine({ x1: 100, y1: 100, x2: 200, y2: 150 });
      const moved = plugin.move(shape, 50, -25);

      expect(moved.x1).toBe(150);
      expect(moved.y1).toBe(75);
      expect(moved.x2).toBe(250);
      expect(moved.y2).toBe(125);
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = createPurePlugin(LineToolPlugin);

    describe('horizontal line', () => {
      const shape = createHorizontalLine({ x1: 100, x2: 200, y1: 100 });

      it('returns true on the line', () => {
        expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
      });

      it('returns true near the line (within tolerance)', () => {
        expect(plugin.isPointerAtShape(shape, 150, 103)).toBe(true);
      });

      it('returns true at endpoints', () => {
        expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
        expect(plugin.isPointerAtShape(shape, 200, 100)).toBe(true);
      });

      it('returns false far from line', () => {
        expect(plugin.isPointerAtShape(shape, 150, 150)).toBe(false);
      });

      it('returns false beyond endpoints', () => {
        expect(plugin.isPointerAtShape(shape, 50, 100)).toBe(false);
        expect(plugin.isPointerAtShape(shape, 250, 100)).toBe(false);
      });
    });

    describe('diagonal line', () => {
      const shape = createDiagonalLine();

      it('returns true on diagonal', () => {
        expect(plugin.isPointerAtShape(shape, 50, 50)).toBe(true);
      });

      it('returns true near diagonal', () => {
        expect(plugin.isPointerAtShape(shape, 52, 50)).toBe(true);
      });

      it('returns false far from diagonal', () => {
        expect(plugin.isPointerAtShape(shape, 20, 80)).toBe(false);
      });
    });

    describe('zero-length line (point)', () => {
      const shape = createPointLine(100, 100);

      it('returns true at the point', () => {
        expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
      });

      it('returns true near the point', () => {
        expect(plugin.isPointerAtShape(shape, 103, 100)).toBe(true);
      });

      it('returns false far from point', () => {
        expect(plugin.isPointerAtShape(shape, 120, 100)).toBe(false);
      });
    });

    describe('lineWidth tolerance', () => {
      it('thick lines have larger hit area', () => {
        const thin = createHorizontalLine({ x1: 100, x2: 200, y1: 100, lineWidth: 2 });
        const thick = createHorizontalLine({ x1: 100, x2: 200, y1: 100, lineWidth: 20 });

        expect(plugin.isPointerAtShape(thin, 150, 108)).toBe(false);
        expect(plugin.isPointerAtShape(thick, 150, 108)).toBe(true);
      });
    });
  });

  // Drawing tests - need minimal ctx mock
  describe('drawing', () => {
    let plugin: LineToolPlugin;
    let ctx: DrawingContext;

    beforeEach(() => {
      ({ plugin, ctx } = setupPluginTest(LineToolPlugin));
    });

    it('draw() renders line shape', () => {
      const shape = createLine({ x1: 10, y1: 20, x2: 100, y2: 80 });
      plugin.draw(shape);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(10, 20);
      expect(ctx.lineTo).toHaveBeenCalledWith(100, 80);
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('drawLine() renders with given parameters', () => {
      plugin.drawLine(10, 20, 100, 80);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(10, 20);
      expect(ctx.lineTo).toHaveBeenCalledWith(100, 80);
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  // Pointer event tests
  describe('pointer events', () => {
    let plugin: LineToolPlugin;
    let ctx: DrawingContext;
    let tool: ReturnType<typeof setupPluginTest>['tool'];

    beforeEach(() => {
      ({ plugin, ctx, tool } = setupPluginTest(LineToolPlugin));
    });

    describe('onPointerDown', () => {
      it('starts drawing at pointer position', () => {
        plugin.onPointerDown(pointerAt(50, 75));

        expect(plugin.startX).toBe(50);
        expect(plugin.startY).toBe(75);
        expect(plugin.isDrawing).toBe(true);
      });
    });

    describe('onPointerMove', () => {
      it('does nothing when not drawing', () => {
        plugin.isDrawing = false;
        plugin.onPointerMove(pointerAt(100, 100));

        expect(ctx.beginPath).not.toHaveBeenCalled();
      });

      it('draws line when drawing', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        plugin.onPointerMove(pointerAt(100, 80));

        expect(ctx.moveTo).toHaveBeenCalledWith(10, 20);
        expect(ctx.lineTo).toHaveBeenCalledWith(100, 80);
        expect(ctx.stroke).toHaveBeenCalled();
      });
    });

    describe('onPointerUp', () => {
      it('does nothing when not drawing', () => {
        plugin.isDrawing = false;
        plugin.onPointerUp(pointerAt(100, 100));

        expect(tool.addShape).not.toHaveBeenCalled();
      });

      it('saves line shape', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        ctx.strokeStyle = '#ff0000';
        ctx.fillStyle = '#00ff00';
        ctx.lineWidth = 3;

        plugin.onPointerUp(pointerAt(100, 80));

        expect(tool.addShape).toHaveBeenCalledWith({
          type: 'line',
          x1: 10,
          y1: 20,
          x2: 100,
          y2: 80,
          strokeStyle: '#ff0000',
          fillStyle: '#00ff00',
          lineWidth: 3,
        });
        expect(plugin.isDrawing).toBe(false);
      });
    });
  });
});
