import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BasePlugin, IShapeBase } from '../src/plugins/base';
import {
  createMockContext,
  createMockAnnotationTool,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

interface ITestShape extends IShapeBase {
  type: 'test';
  x: number;
  y: number;
}

describe('BasePlugin', () => {
  let plugin: BasePlugin<ITestShape>;
  let mockCtx: MockCanvasContext;
  let mockAnnotationTool: MockAnnotationTool;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockAnnotationTool = createMockAnnotationTool(mockCtx);
    plugin = new BasePlugin<ITestShape>(asAnnotationTool(mockAnnotationTool));
  });

  describe('constructor', () => {
    it('should initialize with annotation tool', () => {
      expect(plugin.annotationTool).toBe(mockAnnotationTool);
    });

    it('should initialize default values', () => {
      expect(plugin.startX).toBe(0);
      expect(plugin.startY).toBe(0);
      expect(plugin.isDrawing).toBe(false);
    });
  });

  describe('ctx getter', () => {
    it('should return the annotation tool context', () => {
      expect(plugin.ctx).toBe(mockCtx);
    });
  });

  describe('isPointerAtShape', () => {
    it('should return false by default', () => {
      const shape: ITestShape = {
        type: 'test',
        x: 100,
        y: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(false);
    });
  });

  describe('on', () => {
    it('should be a no-op', () => {
      // Should not throw
      expect(() => plugin.on('event', 'data')).not.toThrow();
    });
  });

  describe('onDeactivate', () => {
    it('should be a no-op', () => {
      // Should not throw
      expect(() => plugin.onDeactivate()).not.toThrow();
    });
  });

  describe('onActivate', () => {
    it('should be a no-op', () => {
      // Should not throw
      expect(() => plugin.onActivate()).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset startX, startY, and isDrawing', () => {
      plugin.startX = 100;
      plugin.startY = 200;
      plugin.isDrawing = true;

      plugin.reset();

      expect(plugin.startX).toBe(0);
      expect(plugin.startY).toBe(0);
      expect(plugin.isDrawing).toBe(false);
    });
  });

  describe('save', () => {
    it('should call addShape on annotation tool', () => {
      const shape: ITestShape = {
        type: 'test',
        x: 100,
        y: 100,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      plugin.save(shape);

      expect(mockAnnotationTool.addShape).toHaveBeenCalledWith(shape);
    });
  });
});
