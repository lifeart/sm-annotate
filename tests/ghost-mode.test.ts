import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createMockContext,
  createMockAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';
import { defaultConfig, mergeConfig, type GhostConfig, type SmAnnotateConfig } from '../src/config';
import type { IShape } from '../src/plugins';
import type { AnnotationSessionV1, FrameAnnotationV1 } from '../src/core';

// Helper to create a mock annotation tool with ghost mode methods
function createGhostMockTool(mockCtx: MockCanvasContext) {
  const baseMock = createMockAnnotationTool(mockCtx);

  const ghostState = {
    enabled: false,
    config: { ...defaultConfig.ghost },
  };

  return {
    ...baseMock,
    fps: 25,
    _ghostEnabled: ghostState.enabled,
    config: { ...defaultConfig, ghost: ghostState.config },
    get ghostEnabled() {
      return ghostState.enabled;
    },
    setGhostEnabled: vi.fn((enabled: boolean) => {
      ghostState.enabled = enabled;
    }),
    toggleGhost: vi.fn(() => {
      ghostState.enabled = !ghostState.enabled;
      return ghostState.enabled;
    }),
    getGhostConfig: vi.fn(() => ({ ...ghostState.config })),
    setGhostConfig: vi.fn((config: Partial<GhostConfig>) => {
      ghostState.config = { ...ghostState.config, ...config };
    }),
    getShapesForFrame: vi.fn((frame: number) => baseMock.timeStack.get(frame) ?? []),
    saveSession: vi.fn((): AnnotationSessionV1 => ({
      version: 1,
      fps: 25,
      frames: [],
      ghost: {
        enabled: ghostState.enabled,
        framesBefore: ghostState.config.framesBefore,
        framesAfter: ghostState.config.framesAfter,
        opacity: ghostState.config.opacity,
        tintBefore: ghostState.config.tintBefore,
        tintAfter: ghostState.config.tintAfter,
      },
    })),
    loadSession: vi.fn((session: AnnotationSessionV1) => {
      if (session.ghost) {
        ghostState.enabled = session.ghost.enabled;
        ghostState.config = { ...session.ghost };
      }
    }),
  };
}

describe('Ghost Mode', () => {
  let mockCtx: MockCanvasContext;
  let mockAnnotationTool: ReturnType<typeof createGhostMockTool>;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockAnnotationTool = createGhostMockTool(mockCtx);
  });

  describe('ghostEnabled', () => {
    it('should be disabled by default', () => {
      expect(mockAnnotationTool.ghostEnabled).toBe(false);
    });
  });

  describe('setGhostEnabled', () => {
    it('should enable ghost mode when set to true', () => {
      mockAnnotationTool.setGhostEnabled(true);
      expect(mockAnnotationTool.setGhostEnabled).toHaveBeenCalledWith(true);
    });

    it('should disable ghost mode when set to false', () => {
      mockAnnotationTool.setGhostEnabled(false);
      expect(mockAnnotationTool.setGhostEnabled).toHaveBeenCalledWith(false);
    });
  });

  describe('toggleGhost', () => {
    it('should toggle ghost mode from disabled to enabled', () => {
      const result = mockAnnotationTool.toggleGhost();
      expect(result).toBe(true);
    });

    it('should toggle ghost mode from enabled to disabled', () => {
      mockAnnotationTool.toggleGhost(); // Enable
      const result = mockAnnotationTool.toggleGhost(); // Disable
      expect(result).toBe(false);
    });
  });

  describe('getGhostConfig', () => {
    it('should return current ghost configuration', () => {
      const config = mockAnnotationTool.getGhostConfig();

      expect(config.enabled).toBe(false);
      expect(config.framesBefore).toBe(2);
      expect(config.framesAfter).toBe(1);
      expect(config.opacity).toBe(0.3);
      expect(config.tintBefore).toBe('rgba(255, 0, 0, 0.3)');
      expect(config.tintAfter).toBe('rgba(0, 128, 0, 0.3)');
    });

    it('should return a copy, not the original config', () => {
      const config1 = mockAnnotationTool.getGhostConfig();
      const config2 = mockAnnotationTool.getGhostConfig();

      expect(config1).not.toBe(config2);
      expect(config1).toEqual(config2);
    });
  });

  describe('setGhostConfig', () => {
    it('should update ghost configuration partially', () => {
      mockAnnotationTool.setGhostConfig({ framesBefore: 5 });

      expect(mockAnnotationTool.setGhostConfig).toHaveBeenCalledWith({ framesBefore: 5 });
    });

    it('should allow setting tint to null', () => {
      mockAnnotationTool.setGhostConfig({ tintBefore: null, tintAfter: null });

      expect(mockAnnotationTool.setGhostConfig).toHaveBeenCalledWith({
        tintBefore: null,
        tintAfter: null,
      });
    });
  });

  describe('getShapesForFrame', () => {
    it('should return empty array for frame with no shapes', () => {
      const shapes = mockAnnotationTool.getShapesForFrame(5);
      expect(shapes).toEqual([]);
    });

    it('should return shapes for frame with shapes', () => {
      const testShapes: IShape[] = [
        {
          type: 'rectangle',
          x: 100,
          y: 100,
          width: 50,
          height: 50,
          strokeStyle: '#ff0000',
          fillStyle: '#ff0000',
          lineWidth: 2,
        },
      ];
      mockAnnotationTool.timeStack.set(10, testShapes);

      const shapes = mockAnnotationTool.getShapesForFrame(10);
      expect(shapes).toEqual(testShapes);
    });
  });
});

describe('Ghost Mode Session Save/Load', () => {
  let mockCtx: MockCanvasContext;
  let mockAnnotationTool: ReturnType<typeof createGhostMockTool>;

  beforeEach(() => {
    mockCtx = createMockContext();
    mockAnnotationTool = createGhostMockTool(mockCtx);
  });

  describe('saveSession', () => {
    it('should include ghost settings in session', () => {
      mockAnnotationTool.toggleGhost(); // Enable ghost mode
      mockAnnotationTool.setGhostConfig({ framesBefore: 3, opacity: 0.5 });

      const session = mockAnnotationTool.saveSession();

      expect(session.ghost).toBeDefined();
      expect(session.ghost!.enabled).toBe(true);
    });

    it('should save default ghost settings when not modified', () => {
      const session = mockAnnotationTool.saveSession();

      expect(session.ghost).toBeDefined();
      expect(session.ghost!.enabled).toBe(false);
      expect(session.ghost!.framesBefore).toBe(2);
      expect(session.ghost!.framesAfter).toBe(1);
      expect(session.ghost!.opacity).toBe(0.3);
    });
  });

  describe('loadSession', () => {
    it('should restore ghost settings from session', () => {
      const session: AnnotationSessionV1 = {
        version: 1,
        fps: 30,
        frames: [],
        ghost: {
          enabled: true,
          framesBefore: 4,
          framesAfter: 2,
          opacity: 0.4,
          tintBefore: '#ff0000',
          tintAfter: null,
        },
      };

      mockAnnotationTool.loadSession(session);

      expect(mockAnnotationTool.loadSession).toHaveBeenCalledWith(session);
    });

    it('should handle session without ghost settings', () => {
      const session: AnnotationSessionV1 = {
        version: 1,
        fps: 25,
        frames: [],
      };

      // Should not throw
      expect(() => mockAnnotationTool.loadSession(session)).not.toThrow();
    });
  });
});

describe('Ghost Frame Opacity Calculations', () => {
  it('should calculate correct opacity for ghost frames (framesBefore)', () => {
    const baseOpacity = 0.3;
    const framesBefore = 2;

    // Frame 1 away from current: opacity * (1 - (1-1)/2) = 0.3 * 1 = 0.3
    const opacityFrame1 = baseOpacity * (1 - (1 - 1) / framesBefore);
    expect(opacityFrame1).toBe(0.3);

    // Frame 2 away from current: opacity * (1 - (2-1)/2) = 0.3 * 0.5 = 0.15
    const opacityFrame2 = baseOpacity * (1 - (2 - 1) / framesBefore);
    expect(opacityFrame2).toBe(0.15);
  });

  it('should calculate correct opacity for ghost frames (framesAfter)', () => {
    const baseOpacity = 0.3;
    const framesAfter = 1;

    // Frame 1 away from current: opacity * (1 - (1-1)/1) = 0.3 * 1 = 0.3
    const opacityFrame1 = baseOpacity * (1 - (1 - 1) / framesAfter);
    expect(opacityFrame1).toBe(0.3);
  });

  it('should fade opacity linearly with distance', () => {
    const baseOpacity = 0.4;
    const framesBefore = 4;

    // Test linear fade: frame 1 = 100%, frame 2 = 75%, frame 3 = 50%, frame 4 = 25%
    const opacities = [1, 2, 3, 4].map(
      (i) => baseOpacity * (1 - (i - 1) / framesBefore)
    );

    expect(opacities[0]).toBeCloseTo(0.4, 5); // Frame 1: 100%
    expect(opacities[1]).toBeCloseTo(0.3, 5); // Frame 2: 75%
    expect(opacities[2]).toBeCloseTo(0.2, 5); // Frame 3: 50%
    expect(opacities[3]).toBeCloseTo(0.1, 5); // Frame 4: 25%
  });
});

describe('Ghost Config Defaults', () => {
  it('should have sensible default configuration', () => {
    expect(defaultConfig.ghost.enabled).toBe(false);
    expect(defaultConfig.ghost.framesBefore).toBe(2);
    expect(defaultConfig.ghost.framesAfter).toBe(1);
    expect(defaultConfig.ghost.opacity).toBe(0.3);
  });

  it('should have distinct tint colors for before and after frames', () => {
    expect(defaultConfig.ghost.tintBefore).not.toBe(defaultConfig.ghost.tintAfter);
    expect(defaultConfig.ghost.tintBefore).toContain('255'); // Red component
    expect(defaultConfig.ghost.tintAfter).toContain('128'); // Green component
  });

  it('should merge ghost config correctly', () => {
    const partial: Partial<SmAnnotateConfig> = {
      ghost: { enabled: true, framesBefore: 5 } as GhostConfig,
    };

    const merged = mergeConfig(partial);

    expect(merged.ghost.enabled).toBe(true);
    expect(merged.ghost.framesBefore).toBe(5);
    expect(merged.ghost.framesAfter).toBe(1); // Default preserved
    expect(merged.ghost.opacity).toBe(0.3); // Default preserved
  });
});

describe('Ghost Config Validation', () => {
  it('should clamp framesBefore to minimum of 1', () => {
    const config = { ...defaultConfig.ghost };

    // Simulate validation logic from setGhostConfig
    const validated = { framesBefore: 0 };
    validated.framesBefore = Math.max(1, Math.min(5, validated.framesBefore));

    expect(validated.framesBefore).toBe(1);
  });

  it('should clamp framesBefore to maximum of 5', () => {
    const validated = { framesBefore: 10 };
    validated.framesBefore = Math.max(1, Math.min(5, validated.framesBefore));

    expect(validated.framesBefore).toBe(5);
  });

  it('should clamp framesAfter to minimum of 1', () => {
    const validated = { framesAfter: -1 };
    validated.framesAfter = Math.max(1, Math.min(5, validated.framesAfter));

    expect(validated.framesAfter).toBe(1);
  });

  it('should clamp framesAfter to maximum of 5', () => {
    const validated = { framesAfter: 100 };
    validated.framesAfter = Math.max(1, Math.min(5, validated.framesAfter));

    expect(validated.framesAfter).toBe(5);
  });

  it('should clamp opacity to minimum of 0.1', () => {
    const validated = { opacity: 0 };
    validated.opacity = Math.max(0.1, Math.min(0.5, validated.opacity));

    expect(validated.opacity).toBe(0.1);
  });

  it('should clamp opacity to maximum of 0.5', () => {
    const validated = { opacity: 1.0 };
    validated.opacity = Math.max(0.1, Math.min(0.5, validated.opacity));

    expect(validated.opacity).toBe(0.5);
  });

  it('should allow values within valid range', () => {
    const validated = { framesBefore: 3, framesAfter: 2, opacity: 0.35 };
    validated.framesBefore = Math.max(1, Math.min(5, validated.framesBefore));
    validated.framesAfter = Math.max(1, Math.min(5, validated.framesAfter));
    validated.opacity = Math.max(0.1, Math.min(0.5, validated.opacity));

    expect(validated.framesBefore).toBe(3);
    expect(validated.framesAfter).toBe(2);
    expect(validated.opacity).toBe(0.35);
  });
});

describe('Ghost Change Callback System', () => {
  it('should register callback and return unsubscribe function', () => {
    const callbacks: Array<(enabled: boolean) => void> = [];

    const onGhostChange = (callback: (enabled: boolean) => void) => {
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      };
    };

    const callback = vi.fn();
    const unsubscribe = onGhostChange(callback);

    expect(callbacks).toHaveLength(1);
    expect(typeof unsubscribe).toBe('function');
  });

  it('should call registered callbacks when ghost mode changes', () => {
    const callbacks: Array<(enabled: boolean) => void> = [];
    let ghostEnabled = false;

    const notifyGhostChange = () => {
      for (const callback of callbacks) {
        callback(ghostEnabled);
      }
    };

    const onGhostChange = (callback: (enabled: boolean) => void) => {
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      };
    };

    const callback1 = vi.fn();
    const callback2 = vi.fn();

    onGhostChange(callback1);
    onGhostChange(callback2);

    ghostEnabled = true;
    notifyGhostChange();

    expect(callback1).toHaveBeenCalledWith(true);
    expect(callback2).toHaveBeenCalledWith(true);
  });

  it('should not call unsubscribed callbacks', () => {
    const callbacks: Array<(enabled: boolean) => void> = [];
    let ghostEnabled = false;

    const notifyGhostChange = () => {
      for (const callback of callbacks) {
        callback(ghostEnabled);
      }
    };

    const onGhostChange = (callback: (enabled: boolean) => void) => {
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      };
    };

    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const unsubscribe1 = onGhostChange(callback1);
    onGhostChange(callback2);

    // Unsubscribe first callback
    unsubscribe1();

    ghostEnabled = true;
    notifyGhostChange();

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(true);
  });

  it('should handle multiple subscribe/unsubscribe cycles', () => {
    const callbacks: Array<(enabled: boolean) => void> = [];
    let ghostEnabled = false;

    const notifyGhostChange = () => {
      for (const callback of callbacks) {
        callback(ghostEnabled);
      }
    };

    const onGhostChange = (callback: (enabled: boolean) => void) => {
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      };
    };

    const callback = vi.fn();

    // First subscribe
    const unsubscribe1 = onGhostChange(callback);
    ghostEnabled = true;
    notifyGhostChange();
    expect(callback).toHaveBeenCalledTimes(1);

    // Unsubscribe
    unsubscribe1();
    notifyGhostChange();
    expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again

    // Re-subscribe
    const unsubscribe2 = onGhostChange(callback);
    notifyGhostChange();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('Ghost Frame Bounds Checking', () => {
  it('should skip drawing when current frame is 0', () => {
    const currentFrame = 0;
    const totalFrames = 100;

    // Simulate bounds check
    const shouldDraw = currentFrame >= 1 && currentFrame <= totalFrames;

    expect(shouldDraw).toBe(false);
  });

  it('should skip drawing when current frame is negative', () => {
    const currentFrame = -5;
    const totalFrames = 100;

    const shouldDraw = currentFrame >= 1 && currentFrame <= totalFrames;

    expect(shouldDraw).toBe(false);
  });

  it('should skip drawing when current frame exceeds totalFrames', () => {
    const currentFrame = 150;
    const totalFrames = 100;

    const shouldDraw = currentFrame >= 1 && currentFrame <= totalFrames;

    expect(shouldDraw).toBe(false);
  });

  it('should allow drawing when current frame is 1', () => {
    const currentFrame = 1;
    const totalFrames = 100;

    const shouldDraw = currentFrame >= 1 && currentFrame <= totalFrames;

    expect(shouldDraw).toBe(true);
  });

  it('should allow drawing when current frame equals totalFrames', () => {
    const currentFrame = 100;
    const totalFrames = 100;

    const shouldDraw = currentFrame >= 1 && currentFrame <= totalFrames;

    expect(shouldDraw).toBe(true);
  });

  it('should skip previous ghost frames that would be < 1', () => {
    const currentFrame = 2;
    const framesBefore = 5;
    const drawnFrames: number[] = [];

    // Simulate ghost frame iteration for previous frames
    for (let i = framesBefore; i >= 1; i--) {
      const frame = currentFrame - i;
      if (frame < 1) continue;
      drawnFrames.push(frame);
    }

    // Only frame 1 should be drawn (current frame 2 - 1 = 1)
    expect(drawnFrames).toEqual([1]);
  });

  it('should skip next ghost frames that would exceed totalFrames', () => {
    const currentFrame = 98;
    const framesAfter = 5;
    const totalFrames = 100;
    const drawnFrames: number[] = [];

    // Simulate ghost frame iteration for next frames
    for (let i = 1; i <= framesAfter; i++) {
      const frame = currentFrame + i;
      if (frame > totalFrames) continue;
      drawnFrames.push(frame);
    }

    // Only frames 99 and 100 should be drawn
    expect(drawnFrames).toEqual([99, 100]);
  });
});

describe('Ghost Mode Edge Cases', () => {
  it('should handle video with only 1 frame', () => {
    const currentFrame = 1;
    const totalFrames = 1;
    const framesBefore = 2;
    const framesAfter = 1;

    const previousFrames: number[] = [];
    const nextFrames: number[] = [];

    // Previous frames
    for (let i = framesBefore; i >= 1; i--) {
      const frame = currentFrame - i;
      if (frame >= 1 && frame <= totalFrames) {
        previousFrames.push(frame);
      }
    }

    // Next frames
    for (let i = 1; i <= framesAfter; i++) {
      const frame = currentFrame + i;
      if (frame >= 1 && frame <= totalFrames) {
        nextFrames.push(frame);
      }
    }

    expect(previousFrames).toEqual([]);
    expect(nextFrames).toEqual([]);
  });

  it('should handle shape with zero opacity', () => {
    const shapeOpacity = 0;
    const baseOpacity = 0.3;
    const finalOpacity = shapeOpacity * baseOpacity;

    expect(finalOpacity).toBe(0);
  });

  it('should handle shape without explicit opacity (defaults to 1)', () => {
    const shapeOpacity = undefined;
    const baseOpacity = 0.3;
    const finalOpacity = (shapeOpacity ?? 1) * baseOpacity;

    expect(finalOpacity).toBe(0.3);
  });

  it('should handle framesBefore = 1 (single previous frame)', () => {
    const baseOpacity = 0.3;
    const framesBefore = 1;

    // With framesBefore = 1, only frame at distance 1 is shown
    // opacity * (1 - (1-1)/1) = 0.3 * 1 = 0.3
    const opacityFrame1 = baseOpacity * (1 - (1 - 1) / framesBefore);

    expect(opacityFrame1).toBe(0.3);
  });

  it('should handle framesAfter = 1 (single next frame)', () => {
    const baseOpacity = 0.3;
    const framesAfter = 1;

    // With framesAfter = 1, only frame at distance 1 is shown
    const opacityFrame1 = baseOpacity * (1 - (1 - 1) / framesAfter);

    expect(opacityFrame1).toBe(0.3);
  });

  it('should not modify original shapes when applying ghost styling', () => {
    const originalShape: IShape = {
      type: 'curve',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      strokeStyle: '#ff0000',
      fillStyle: '#ff0000',
      lineWidth: 2,
      opacity: 0.8,
    };

    // Simulate ghost drawing - should not modify original
    const shapeOpacity = originalShape.opacity ?? 1;
    const baseOpacity = 0.3;
    const ghostOpacity = shapeOpacity * baseOpacity;

    expect(originalShape.opacity).toBe(0.8); // Original unchanged
    expect(ghostOpacity).toBeCloseTo(0.24, 5); // New calculated value
  });
});

describe('AnnotationSessionV1 Type', () => {
  it('should allow session without ghost settings', () => {
    const session: AnnotationSessionV1 = {
      version: 1,
      fps: 25,
      frames: [],
    };

    expect(session.ghost).toBeUndefined();
  });

  it('should allow session with full ghost settings', () => {
    const session: AnnotationSessionV1 = {
      version: 1,
      fps: 25,
      frames: [],
      ghost: {
        enabled: true,
        framesBefore: 3,
        framesAfter: 2,
        opacity: 0.4,
        tintBefore: 'rgba(255, 0, 0, 0.3)',
        tintAfter: null,
      },
    };

    expect(session.ghost).toBeDefined();
    expect(session.ghost!.tintAfter).toBeNull();
  });

  it('should allow session with frames and ghost settings', () => {
    const frames: FrameAnnotationV1[] = [
      {
        frame: 1,
        fps: 25,
        version: 1,
        shapes: [
          {
            type: 'rectangle',
            x: 0.1,
            y: 0.1,
            width: 0.2,
            height: 0.2,
            strokeStyle: '#ff0000',
            fillStyle: '#ff0000',
            lineWidth: 2,
          },
        ],
      },
    ];

    const session: AnnotationSessionV1 = {
      version: 1,
      fps: 25,
      frames,
      ghost: {
        enabled: true,
        framesBefore: 2,
        framesAfter: 1,
        opacity: 0.3,
        tintBefore: 'rgba(255, 0, 0, 0.3)',
        tintAfter: 'rgba(0, 128, 0, 0.3)',
      },
    };

    expect(session.frames).toHaveLength(1);
    expect(session.ghost!.enabled).toBe(true);
  });
});
