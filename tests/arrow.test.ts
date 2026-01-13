import { describe, it, expect, beforeEach } from 'vitest';
import { ArrowToolPlugin } from '../src/plugins/arrow';
import { createPurePlugin, setupPluginTest, pointerAt, DrawingContext } from './helpers/minimal-mocks';
import { createArrow, createHorizontalArrow, createDiagonalArrow, createPointArrow } from './helpers/shape-factories';

describe('ArrowToolPlugin', () => {
  // Pure functions - no mocks needed
  describe('normalize', () => {
    const plugin = createPurePlugin(ArrowToolPlugin);

    it('should normalize arrow coordinates relative to canvas size', () => {
      const shape = createArrow({ x1: 100, y1: 50, x2: 300, y2: 150 });
      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x1).toBe(0.25);
      expect(normalized.y1).toBe(0.25);
      expect(normalized.x2).toBe(0.75);
      expect(normalized.y2).toBe(0.75);
    });
  });

  describe('move', () => {
    const plugin = createPurePlugin(ArrowToolPlugin);

    it('should move both endpoints by delta values', () => {
      const shape = createArrow({ x1: 100, y1: 100, x2: 200, y2: 150 });
      const moved = plugin.move(shape, 50, -25);

      expect(moved.x1).toBe(150);
      expect(moved.y1).toBe(75);
      expect(moved.x2).toBe(250);
      expect(moved.y2).toBe(125);
    });
  });

  describe('isPointerAtShape', () => {
    const plugin = createPurePlugin(ArrowToolPlugin);

    describe('horizontal arrow', () => {
      const shape = createHorizontalArrow({ x1: 100, x2: 200, y1: 100 });

      it('returns true on the arrow', () => {
        expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
      });

      it('returns true near the arrow (within tolerance)', () => {
        expect(plugin.isPointerAtShape(shape, 150, 103)).toBe(true);
      });

      it('returns true at endpoints', () => {
        expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(true);
        expect(plugin.isPointerAtShape(shape, 200, 100)).toBe(true);
      });

      it('returns false far from arrow', () => {
        expect(plugin.isPointerAtShape(shape, 150, 150)).toBe(false);
      });

      it('returns false beyond endpoints', () => {
        expect(plugin.isPointerAtShape(shape, 50, 100)).toBe(false);
        expect(plugin.isPointerAtShape(shape, 250, 100)).toBe(false);
      });
    });

    describe('diagonal arrow', () => {
      const shape = createDiagonalArrow();

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

    describe('zero-length arrow (point)', () => {
      const shape = createPointArrow(100, 100);

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
      it('thick arrows have larger hit area', () => {
        const thin = createHorizontalArrow({ x1: 100, x2: 200, y1: 100, lineWidth: 2 });
        const thick = createHorizontalArrow({ x1: 100, x2: 200, y1: 100, lineWidth: 20 });

        expect(plugin.isPointerAtShape(thin, 150, 108)).toBe(false);
        expect(plugin.isPointerAtShape(thick, 150, 108)).toBe(true);
      });
    });
  });

  // Drawing tests - need minimal ctx mock
  describe('drawing', () => {
    let plugin: ArrowToolPlugin;
    let ctx: DrawingContext;

    beforeEach(() => {
      ({ plugin, ctx } = setupPluginTest(ArrowToolPlugin));
    });

    it('draw() renders arrow shape', () => {
      const shape = createArrow({ x1: 10, y1: 20, x2: 100, y2: 80 });
      plugin.draw(shape);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(10, 20);
      expect(ctx.lineTo).toHaveBeenCalledWith(100, 80);
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('drawArrow() renders line and arrowhead', () => {
      plugin.drawArrow(0, 0, 100, 0);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
      expect(ctx.lineTo).toHaveBeenCalledWith(100, 0);
      expect(ctx.stroke).toHaveBeenCalled();
    });
  });

  // Pointer event tests
  describe('pointer events', () => {
    let plugin: ArrowToolPlugin;
    let ctx: DrawingContext;
    let tool: ReturnType<typeof setupPluginTest>['tool'];

    beforeEach(() => {
      ({ plugin, ctx, tool } = setupPluginTest(ArrowToolPlugin));
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

      it('draws arrow when drawing', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        plugin.onPointerMove(pointerAt(100, 80));

        expect(ctx.moveTo).toHaveBeenCalledWith(10, 20);
        expect(ctx.lineTo).toHaveBeenCalledWith(100, 80);
      });
    });

    describe('onPointerUp', () => {
      it('does nothing when not drawing', () => {
        plugin.isDrawing = false;
        plugin.onPointerUp(pointerAt(100, 100));

        expect(tool.addShape).not.toHaveBeenCalled();
      });

      it('saves arrow shape', () => {
        plugin.isDrawing = true;
        plugin.startX = 10;
        plugin.startY = 20;
        ctx.strokeStyle = '#ff0000';
        ctx.fillStyle = '#00ff00';
        ctx.lineWidth = 3;

        plugin.onPointerUp(pointerAt(100, 80));

        expect(tool.addShape).toHaveBeenCalledWith({
          type: 'arrow',
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
