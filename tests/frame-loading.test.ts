import { describe, it, expect, beforeEach } from 'vitest';
import { AnnotationToolBase } from '../src/base';
import type { IShape } from '../src/plugins';
import type { FrameAnnotationV1 } from '../src/core';

// Create a minimal test implementation
class TestAnnotationTool extends AnnotationToolBase<IShape> {
  // Add the methods we need to test
  parseShapes(shapes: string): IShape[] {
    return JSON.parse(shapes);
  }

  stringifyShapes(shapes: IShape[]): string {
    return JSON.stringify(shapes);
  }

  loadAllFrames(frames: FrameAnnotationV1[]) {
    this.cleanFrameStacks();
    frames.forEach((frame) => {
      this.timeStack.set(frame.frame, this.parseShapes(this.stringifyShapes(frame.shapes)));
    });
  }

  appendFrames(frames: FrameAnnotationV1[]) {
    frames.forEach((frame) => {
      this.addShapesToFrame(frame.frame, frame.shapes);
    });
  }

  addShapesToFrame(frame: number, shapes: IShape[]) {
    const existingShapes = this.timeStack.get(frame) || [];
    this.timeStack.set(frame, [
      ...existingShapes,
      ...(this.parseShapes(this.stringifyShapes(shapes)) as IShape[]),
    ]);
  }

  get shapes(): IShape[] {
    if (!this.timeStack.has(this.activeTimeFrame)) {
      this.timeStack.set(this.activeTimeFrame, []);
    }
    return this.timeStack.get(this.activeTimeFrame) as IShape[];
  }
}

describe('Frame Loading', () => {
  let tool: TestAnnotationTool;

  const createMockShape = (id: string, type: string = 'curve'): IShape => ({
    type: type as IShape['type'],
    strokeStyle: '#ff0000',
    fillStyle: '#ff0000',
    lineWidth: 2,
    points: [{ x: 0.5, y: 0.5 }],
  } as IShape);

  beforeEach(() => {
    tool = new TestAnnotationTool();
  });

  describe('loadAllFrames', () => {
    it('should store shapes in timeStack, not globalShapes', () => {
      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('s1')] },
        { frame: 5, fps: 24, version: 1, shapes: [createMockShape('s2')] },
      ];

      tool.loadAllFrames(frames);

      // Shapes should be in timeStack
      expect(tool.timeStack.size).toBe(2);
      expect(tool.timeStack.has(1)).toBe(true);
      expect(tool.timeStack.has(5)).toBe(true);

      // globalShapes should be empty
      expect(tool.globalShapes.length).toBe(0);
    });

    it('should store each frame\'s shapes separately', () => {
      const shape1 = createMockShape('s1');
      const shape2 = createMockShape('s2');
      const shape3 = createMockShape('s3');

      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 24, version: 1, shapes: [shape1] },
        { frame: 5, fps: 24, version: 1, shapes: [shape2, shape3] },
      ];

      tool.loadAllFrames(frames);

      // Frame 1 should have 1 shape
      const frame1Shapes = tool.timeStack.get(1)!;
      expect(frame1Shapes.length).toBe(1);

      // Frame 5 should have 2 shapes
      const frame5Shapes = tool.timeStack.get(5)!;
      expect(frame5Shapes.length).toBe(2);

      // Verify they are different arrays (not shared references)
      expect(frame1Shapes).not.toBe(frame5Shapes);
    });

    it('should create deep copies of shapes (no shared references)', () => {
      const originalShape = createMockShape('s1');
      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 24, version: 1, shapes: [originalShape] },
      ];

      tool.loadAllFrames(frames);

      const loadedShape = tool.timeStack.get(1)![0];

      // Should be equal in value but not the same reference
      expect(loadedShape).toEqual(originalShape);
      expect(loadedShape).not.toBe(originalShape);
    });

    it('should clear existing frames before loading', () => {
      // Pre-populate with some data
      tool.timeStack.set(10, [createMockShape('old')]);
      tool.timeStack.set(20, [createMockShape('old2')]);

      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('new')] },
      ];

      tool.loadAllFrames(frames);

      // Old frames should be gone
      expect(tool.timeStack.has(10)).toBe(false);
      expect(tool.timeStack.has(20)).toBe(false);

      // Only new frame should exist
      expect(tool.timeStack.size).toBe(1);
      expect(tool.timeStack.has(1)).toBe(true);
    });
  });

  describe('shapes getter', () => {
    it('should return only shapes for activeTimeFrame', () => {
      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('s1')] },
        { frame: 5, fps: 24, version: 1, shapes: [createMockShape('s2'), createMockShape('s3')] },
        { frame: 15, fps: 24, version: 1, shapes: [createMockShape('s4')] },
      ];

      tool.loadAllFrames(frames);

      // When activeTimeFrame is 1, should get 1 shape
      tool.activeTimeFrame = 1;
      expect(tool.shapes.length).toBe(1);

      // When activeTimeFrame is 5, should get 2 shapes
      tool.activeTimeFrame = 5;
      expect(tool.shapes.length).toBe(2);

      // When activeTimeFrame is 15, should get 1 shape
      tool.activeTimeFrame = 15;
      expect(tool.shapes.length).toBe(1);

      // When activeTimeFrame is a frame with no annotations, should get 0 shapes
      tool.activeTimeFrame = 10;
      expect(tool.shapes.length).toBe(0);
    });

    it('should not return shapes from other frames', () => {
      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('frame1-shape')] },
        { frame: 5, fps: 24, version: 1, shapes: [createMockShape('frame5-shape')] },
      ];

      tool.loadAllFrames(frames);

      // Set active frame to 1
      tool.activeTimeFrame = 1;
      const shapes = tool.shapes;

      // Should only have frame 1 shapes, not frame 5
      expect(shapes.length).toBe(1);
      // Verify it's not the same as frame 5
      expect(tool.timeStack.get(5)).not.toBe(shapes);
    });
  });

  describe('appendFrames', () => {
    it('should add shapes to existing frames without removing them', () => {
      // First load
      tool.loadAllFrames([
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('s1')] },
      ]);

      // Append to same frame
      tool.appendFrames([
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('s2')] },
      ]);

      // Should now have 2 shapes on frame 1
      expect(tool.timeStack.get(1)!.length).toBe(2);
    });

    it('should add new frames without affecting existing ones', () => {
      // First load
      tool.loadAllFrames([
        { frame: 1, fps: 24, version: 1, shapes: [createMockShape('s1')] },
      ]);

      // Append new frame
      tool.appendFrames([
        { frame: 5, fps: 24, version: 1, shapes: [createMockShape('s2')] },
      ]);

      // Both frames should exist
      expect(tool.timeStack.get(1)!.length).toBe(1);
      expect(tool.timeStack.get(5)!.length).toBe(1);
    });
  });
});
