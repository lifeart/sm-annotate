import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AnnotationTool } from '../src/core';
import { initUI } from '../src/ui';
import { initCanvas } from '../src/canvas';
import { addFrameSquareOverlay } from '../src/overlays/frame-number';
import { addVideoOverlay } from '../src/overlays/video';
import { addProgressBarOverlay } from '../src/overlays/progress-bar';

// Setup prototype methods
AnnotationTool.prototype.initUI = initUI;
AnnotationTool.prototype.initCanvas = initCanvas;
AnnotationTool.prototype.addFrameSquareOverlay = addFrameSquareOverlay;
AnnotationTool.prototype.addVideoOverlay = addVideoOverlay;
AnnotationTool.prototype.addProgressBarOverlay = addProgressBarOverlay;

describe('Frame Calculations', () => {
  let tool: AnnotationTool;
  let video: HTMLVideoElement;

  beforeEach(() => {
    // Create a real video element
    video = document.createElement('video');
    // Set video properties that would normally come from loading a video
    Object.defineProperty(video, 'duration', { value: 10, writable: true });
    Object.defineProperty(video, 'videoWidth', { value: 1920, writable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1080, writable: true });
    document.body.appendChild(video);

    // Create the real AnnotationTool
    tool = new AnnotationTool(video);
    tool.setFrameRate(24);
  });

  afterEach(() => {
    tool.destroy();
    video.remove();
  });

  describe('msPerFrame', () => {
    it('should calculate correct milliseconds per frame for 24fps', () => {
      tool.setFrameRate(24);
      expect(tool.msPerFrame).toBeCloseTo(41.67, 1);
    });

    it('should calculate correct milliseconds per frame for 30fps', () => {
      tool.setFrameRate(30);
      expect(tool.msPerFrame).toBeCloseTo(33.33, 1);
    });

    it('should calculate correct milliseconds per frame for 60fps', () => {
      tool.setFrameRate(60);
      expect(tool.msPerFrame).toBeCloseTo(16.67, 1);
    });

    it('should calculate correct milliseconds per frame for 25fps', () => {
      tool.setFrameRate(25);
      expect(tool.msPerFrame).toBe(40);
    });
  });

  describe('totalFrames', () => {
    it('should calculate total frames from video duration and fps', () => {
      tool.setFrameRate(24);
      expect(tool.totalFrames).toBe(240); // 10s * 24fps
    });

    it('should update when fps changes', () => {
      tool.setFrameRate(30);
      expect(tool.totalFrames).toBe(300); // 10s * 30fps
    });

    it('should use enforced total frames when set', () => {
      tool.setFrameRate(24);
      tool.setTotalFrames(500);
      expect(tool.totalFrames).toBe(500);
    });

    it('should revert to calculated value when enforcement is cleared', () => {
      tool.setFrameRate(24);
      tool.setTotalFrames(500);
      expect(tool.totalFrames).toBe(500);
      tool.setTotalFrames(null);
      expect(tool.totalFrames).toBe(240);
    });

    it('should return enforced value via getEnforcedTotalFrames', () => {
      expect(tool.getEnforcedTotalFrames()).toBeNull();
      tool.setTotalFrames(500);
      expect(tool.getEnforcedTotalFrames()).toBe(500);
    });
  });

  describe('timeToFrame', () => {
    beforeEach(() => {
      tool.setFrameRate(24);
    });

    it('should convert time to frame number', () => {
      expect(tool.timeToFrame(1)).toBe(24); // 1 second = 24 frames
      expect(tool.timeToFrame(0.5)).toBe(12); // 0.5 seconds = 12 frames
    });

    it('should return minimum frame 1 for time 0', () => {
      expect(tool.timeToFrame(0)).toBe(1);
    });

    it('should return minimum frame 1 for very small time', () => {
      expect(tool.timeToFrame(0.01)).toBe(1);
    });

    it('should use Math.round for fractional frames', () => {
      // 0.52 seconds * 24 fps = 12.48 frames -> rounds to 12
      expect(tool.timeToFrame(0.52)).toBe(12);
      // 0.54 seconds * 24 fps = 12.96 frames -> rounds to 13
      expect(tool.timeToFrame(0.54)).toBe(13);
    });
  });

  describe('prevFrame', () => {
    beforeEach(() => {
      tool.setFrameRate(24);
    });

    it('should decrement frame by 1', () => {
      tool.playbackFrame = 10;
      tool.prevFrame();
      expect(tool.playbackFrame).toBe(9);
    });

    it('should wrap to totalFrames when at frame 1', () => {
      tool.playbackFrame = 1;
      tool.prevFrame();
      expect(tool.playbackFrame).toBe(240); // totalFrames for 10s @ 24fps
    });

    it('should allow reaching frame 1', () => {
      tool.playbackFrame = 2;
      tool.prevFrame();
      expect(tool.playbackFrame).toBe(1);
    });

    it('should work correctly with enforced total frames', () => {
      tool.setTotalFrames(100);
      tool.playbackFrame = 1;
      tool.prevFrame();
      expect(tool.playbackFrame).toBe(100);
    });
  });

  describe('nextFrame', () => {
    beforeEach(() => {
      tool.setFrameRate(24);
    });

    it('should increment frame by 1', () => {
      tool.playbackFrame = 10;
      tool.nextFrame();
      expect(tool.playbackFrame).toBe(11);
    });

    it('should wrap to frame 1 when exceeding totalFrames', () => {
      tool.playbackFrame = 240; // totalFrames for 10s @ 24fps
      tool.nextFrame();
      expect(tool.playbackFrame).toBe(1);
    });

    it('should allow reaching totalFrames', () => {
      tool.playbackFrame = 239;
      tool.nextFrame();
      expect(tool.playbackFrame).toBe(240);
    });

    it('should work correctly with enforced total frames', () => {
      tool.setTotalFrames(100);
      tool.playbackFrame = 100;
      tool.nextFrame();
      expect(tool.playbackFrame).toBe(1);
    });
  });

  describe('frame navigation symmetry', () => {
    beforeEach(() => {
      tool.setFrameRate(24);
    });

    it('should be symmetric: prev then next returns to same frame', () => {
      tool.playbackFrame = 50;
      tool.prevFrame();
      tool.nextFrame();
      expect(tool.playbackFrame).toBe(50);
    });

    it('should be symmetric: next then prev returns to same frame', () => {
      tool.playbackFrame = 50;
      tool.nextFrame();
      tool.prevFrame();
      expect(tool.playbackFrame).toBe(50);
    });

    it('should cycle through all frames with nextFrame', () => {
      tool.setTotalFrames(10); // Small number for testing
      const visitedFrames = new Set<number>();
      tool.playbackFrame = 1;

      for (let i = 0; i < 10; i++) {
        visitedFrames.add(tool.playbackFrame);
        tool.nextFrame();
      }

      expect(visitedFrames.size).toBe(10);
      expect(tool.playbackFrame).toBe(1); // Back to start
    });

    it('should cycle through all frames with prevFrame', () => {
      tool.setTotalFrames(10); // Small number for testing
      const visitedFrames = new Set<number>();
      tool.playbackFrame = 1;

      for (let i = 0; i < 10; i++) {
        visitedFrames.add(tool.playbackFrame);
        tool.prevFrame();
      }

      expect(visitedFrames.size).toBe(10);
      expect(tool.playbackFrame).toBe(1); // Back to start
    });
  });

  describe('annotated frame navigation', () => {
    beforeEach(() => {
      tool.setFrameRate(24);
      tool.setTotalFrames(100);
    });

    // Helper to add shape at specific frame (updates activeTimeFrame for jsdom)
    const addShapeAtFrame = (frame: number, shape: any) => {
      tool.updateActiveTimeFrame(frame / tool.fps);
      tool.addShape(shape);
    };

    it('should return empty array when no annotations', () => {
      expect(tool.getAnnotatedFrames()).toEqual([]);
    });

    it('should return frames that have annotations', () => {
      // Add shapes to specific frames
      addShapeAtFrame(10, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      addShapeAtFrame(50, {
        type: 'circle',
        x: 50, y: 50, radius: 25,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      addShapeAtFrame(30, {
        type: 'line',
        x1: 0, y1: 0, x2: 100, y2: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      const annotatedFrames = tool.getAnnotatedFrames();
      expect(annotatedFrames).toEqual([10, 30, 50]); // Should be sorted
    });

    it('should jump to next annotated frame', () => {
      addShapeAtFrame(10, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      addShapeAtFrame(50, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      tool.updateActiveTimeFrame(1 / tool.fps); // Set to frame 1
      tool.nextAnnotatedFrame();
      expect(tool.playbackFrame).toBe(10);

      tool.nextAnnotatedFrame();
      expect(tool.playbackFrame).toBe(50);
    });

    it('should wrap to first annotated frame when at end', () => {
      addShapeAtFrame(10, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      addShapeAtFrame(50, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      tool.updateActiveTimeFrame(60 / tool.fps); // Set to frame 60
      tool.nextAnnotatedFrame();
      expect(tool.playbackFrame).toBe(10); // Wraps to first
    });

    it('should jump to previous annotated frame', () => {
      addShapeAtFrame(10, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      addShapeAtFrame(50, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      tool.updateActiveTimeFrame(60 / tool.fps); // Set to frame 60
      tool.prevAnnotatedFrame();
      expect(tool.playbackFrame).toBe(50);

      tool.prevAnnotatedFrame();
      expect(tool.playbackFrame).toBe(10);
    });

    it('should wrap to last annotated frame when at beginning', () => {
      addShapeAtFrame(10, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      addShapeAtFrame(50, {
        type: 'rectangle',
        x: 0, y: 0, width: 100, height: 100,
        strokeStyle: '#000', fillStyle: '#fff', lineWidth: 1
      });

      tool.updateActiveTimeFrame(5 / tool.fps); // Set to frame 5
      tool.prevAnnotatedFrame();
      expect(tool.playbackFrame).toBe(50); // Wraps to last
    });

    it('should not change frame when no annotations exist', () => {
      tool.updateActiveTimeFrame(25 / tool.fps); // Set to frame 25
      const initialFrame = tool.playbackFrame;
      tool.nextAnnotatedFrame();
      expect(tool.playbackFrame).toBe(initialFrame);

      tool.prevAnnotatedFrame();
      expect(tool.playbackFrame).toBe(initialFrame);
    });
  });
});

describe('Progress Bar Frame Calculations', () => {
  let tool: AnnotationTool;
  let video: HTMLVideoElement;

  beforeEach(() => {
    video = document.createElement('video');
    Object.defineProperty(video, 'duration', { value: 10, writable: true });
    Object.defineProperty(video, 'videoWidth', { value: 1920, writable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1080, writable: true });

    // Mock getBoundingClientRect for jsdom
    video.getBoundingClientRect = () => ({
      width: 800,
      height: 450,
      top: 0,
      left: 0,
      right: 800,
      bottom: 450,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });

    document.body.appendChild(video);

    tool = new AnnotationTool(video);
    tool.setFrameRate(24);

    // Manually set canvas size since jsdom doesn't support proper layout
    tool.enforcedCanvasSize = { width: 800, height: 450 };
  });

  afterEach(() => {
    tool.destroy();
    video.remove();
  });

  describe('frameFromProgressBar', () => {
    it('should return null for non-video elements', () => {
      const img = document.createElement('img');
      document.body.appendChild(img);
      const imgTool = new AnnotationTool(img);

      const event = new PointerEvent('pointerdown', { clientX: 100, clientY: 100 });
      Object.defineProperty(event, 'offsetX', { value: 100 });
      Object.defineProperty(event, 'offsetY', { value: 100 });

      expect(imgTool.frameFromProgressBar(event)).toBeNull();

      imgTool.destroy();
      img.remove();
    });

    it('should return frame number when clicking within progress bar', () => {
      const coords = tool.progressBarCoordinates;

      // Create event at middle of progress bar
      const event = new PointerEvent('pointerdown');
      Object.defineProperty(event, 'offsetX', { value: coords.x + coords.width / 2 });
      Object.defineProperty(event, 'offsetY', { value: coords.y + coords.height / 2 });

      const frame = tool.frameFromProgressBar(event);
      expect(frame).toBeGreaterThan(0);
      expect(frame).toBeLessThanOrEqual(tool.totalFrames);
    });

    it('should return null when clicking outside progress bar vertically', () => {
      const coords = tool.progressBarCoordinates;

      const event = new PointerEvent('pointerdown');
      Object.defineProperty(event, 'offsetX', { value: coords.x + coords.width / 2 });
      Object.defineProperty(event, 'offsetY', { value: 10 }); // Far above progress bar

      expect(tool.frameFromProgressBar(event, true)).toBeNull();
    });

    it('should ignore Y when countY is false', () => {
      const coords = tool.progressBarCoordinates;

      const event = new PointerEvent('pointerdown');
      Object.defineProperty(event, 'offsetX', { value: coords.x + coords.width / 2 });
      Object.defineProperty(event, 'offsetY', { value: 10 }); // Far above progress bar

      const frame = tool.frameFromProgressBar(event, false);
      expect(frame).toBeGreaterThan(0);
    });

    it('should clamp frame to valid range', () => {
      const coords = tool.progressBarCoordinates;

      // Click at left edge
      const leftEvent = new PointerEvent('pointerdown');
      Object.defineProperty(leftEvent, 'offsetX', { value: coords.x });
      Object.defineProperty(leftEvent, 'offsetY', { value: coords.y + coords.height / 2 });

      const leftFrame = tool.frameFromProgressBar(leftEvent);
      expect(leftFrame).toBeGreaterThanOrEqual(1);

      // Click at right edge
      const rightEvent = new PointerEvent('pointerdown');
      Object.defineProperty(rightEvent, 'offsetX', { value: coords.x + coords.width });
      Object.defineProperty(rightEvent, 'offsetY', { value: coords.y + coords.height / 2 });

      const rightFrame = tool.frameFromProgressBar(rightEvent);
      expect(rightFrame).toBeLessThanOrEqual(tool.totalFrames);
    });
  });
});
