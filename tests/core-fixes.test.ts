import { describe, it, expect, vi } from 'vitest';
import { AnnotationTool } from '../src/core';
import { defaultConfig } from '../src/config';
import type { IShape } from '../src/plugins';

const proto = AnnotationTool.prototype;

const line = (): IShape => ({
  type: 'line', x1: 0.1, y1: 0.1, x2: 0.2, y2: 0.2,
  strokeStyle: '#f00', fillStyle: '#f00', lineWidth: 1,
} as IShape);

function fakeTool(extra: Record<string, unknown> = {}) {
  const t: any = {
    timeStack: new Map<number, IShape[]>(),
    undoTimeStack: new Map<number, IShape[][]>(),
    destructors: [] as Array<() => void>,
    fps: 25,
    activeTimeFrame: 1,
    redrawFullCanvas: vi.fn(),
    stringifyShapes: proto.stringifyShapes,
    parseShapes: proto.parseShapes,
    pushUndoForFrame: proto.pushUndoForFrame,
    ...extra,
  };
  Object.defineProperty(t, 'shapes', {
    get() { return t.timeStack.get(t.activeTimeFrame) ?? []; },
    set(v) { t.timeStack.set(t.activeTimeFrame, v); },
  });
  Object.defineProperty(t, 'undoStack', {
    get() {
      if (!t.undoTimeStack.has(t.activeTimeFrame)) t.undoTimeStack.set(t.activeTimeFrame, []);
      return t.undoTimeStack.get(t.activeTimeFrame);
    },
  });
  return t;
}

describe('core: frame edits are undoable', () => {
  it('replaceFrame (cut) can be undone', () => {
    const t = fakeTool();
    t.timeStack.set(1, [line()]);
    proto.replaceFrame.call(t, 1, []);
    expect(t.shapes.length).toBe(0);
    proto.handleUndo.call(t);
    expect(t.shapes.length).toBe(1);
  });

  it('addShapesToFrame (paste) can be undone', () => {
    const t = fakeTool();
    proto.addShapesToFrame.call(t, 1, [line()]);
    expect(t.shapes.length).toBe(1);
    proto.handleUndo.call(t);
    expect(t.shapes.length).toBe(0);
  });
});

describe('core: undo shortcut', () => {
  const press = (init: KeyboardEventInit, target?: EventTarget) => {
    const e = new KeyboardEvent('keydown', { key: 'z', bubbles: true, ...init });
    if (target) Object.defineProperty(e, 'target', { value: target });
    return e;
  };

  it('undoes on Ctrl+Z but not from text fields or with Shift (redo)', () => {
    const t = fakeTool({ handleUndo: vi.fn() });
    proto.onKeyDown.call(t, press({ ctrlKey: true }, document.createElement('textarea')));
    proto.onKeyDown.call(t, press({ ctrlKey: true, shiftKey: true }, document.body));
    expect(t.handleUndo).not.toHaveBeenCalled();
    proto.onKeyDown.call(t, press({ metaKey: true }, document.body));
    expect(t.handleUndo).toHaveBeenCalledTimes(1);
  });
});

describe('core: setFrameRate', () => {
  it('ignores invalid frame rates', () => {
    const t = fakeTool();
    for (const bad of [0, -5, NaN, Infinity]) {
      proto.setFrameRate.call(t, bad);
      expect(t.fps).toBe(25);
    }
  });

  it('removes the frame-rate detector so detection can be re-enabled', () => {
    const t = fakeTool();
    const detector = vi.fn();
    Object.defineProperty(detector, 'name', { value: 'frameRateDetector' });
    t.destructors.push(detector);
    proto.setFrameRate.call(t, 30);
    expect(detector).toHaveBeenCalledTimes(1);
    expect(t.destructors).not.toContain(detector);
    expect(t.fps).toBe(30);
  });
});

describe('core: loadSession', () => {
  it('clamps ghost settings and notifies listeners', () => {
    const listener = vi.fn();
    const t = fakeTool({
      config: { ...defaultConfig, ghost: { ...defaultConfig.ghost } },
      _ghostEnabled: false,
      _ghostChangeCallbacks: [listener],
      loadAllFrames: vi.fn(),
      setFrameRate: vi.fn(),
    });
    t.setGhostConfig = proto.setGhostConfig.bind(t);
    t.setGhostEnabled = proto.setGhostEnabled.bind(t);
    t._notifyGhostChange = (proto as any)._notifyGhostChange.bind(t);

    proto.loadSession.call(t, {
      version: 1,
      fps: 25,
      frames: [],
      ghost: { enabled: true, framesBefore: 99, framesAfter: 2, opacity: 5, tintBefore: '#f00', tintAfter: '#0f0' },
    });

    expect(t._ghostEnabled).toBe(true);
    expect(t.config.ghost.framesBefore).toBe(5);
    expect(t.config.ghost.opacity).toBe(0.5);
    expect(listener).toHaveBeenCalledWith(true);
  });
});
