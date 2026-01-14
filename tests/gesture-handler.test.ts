import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GestureHandler, type GestureState, type GestureChangeCallback } from '../src/gestures/gesture-handler';

// Helper to create mock touch events
function createTouchEvent(
  type: string,
  touches: Array<{ clientX: number; clientY: number }>
): TouchEvent {
  const touchList = touches.map((t, i) => ({
    clientX: t.clientX,
    clientY: t.clientY,
    identifier: i,
    target: document.createElement('div'),
    pageX: t.clientX,
    pageY: t.clientY,
    screenX: t.clientX,
    screenY: t.clientY,
    radiusX: 1,
    radiusY: 1,
    rotationAngle: 0,
    force: 1,
  })) as unknown as Touch[];

  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  Object.defineProperty(event, 'touches', { value: touchList, writable: false });
  Object.defineProperty(event, 'preventDefault', { value: vi.fn(), writable: false });

  return event;
}

describe('GestureHandler', () => {
  let canvas: HTMLCanvasElement;
  let handler: GestureHandler;
  let onGestureChange: GestureChangeCallback;
  let lastState: GestureState | null;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    lastState = null;
    onGestureChange = vi.fn((state: GestureState) => {
      lastState = state;
    });

    handler = new GestureHandler(canvas, onGestureChange);
  });

  afterEach(() => {
    handler.destroy();
    canvas.remove();
  });

  describe('init', () => {
    it('should add touch event listeners', () => {
      const addEventListenerSpy = vi.spyOn(canvas, 'addEventListener');
      handler.init();

      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: false });
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function), { passive: false });
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function), { passive: false });
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function), { passive: false });
    });
  });

  describe('getState', () => {
    it('should return initial state with scale 1 and pan 0', () => {
      handler.init();
      const state = handler.getState();

      expect(state.scale).toBe(1);
      expect(state.panX).toBe(0);
      expect(state.panY).toBe(0);
    });
  });

  describe('isActive', () => {
    it('should return false initially', () => {
      handler.init();
      expect(handler.isActive()).toBe(false);
    });

    it('should return true during two-finger gesture', () => {
      handler.init();

      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 100 },
        { clientX: 200, clientY: 100 },
      ]);
      canvas.dispatchEvent(touchStart);

      expect(handler.isActive()).toBe(true);
    });

    it('should return false after gesture ends', () => {
      handler.init();

      // Start gesture
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 100 },
        { clientX: 200, clientY: 100 },
      ]);
      canvas.dispatchEvent(touchStart);
      expect(handler.isActive()).toBe(true);

      // End gesture
      const touchEnd = createTouchEvent('touchend', []);
      canvas.dispatchEvent(touchEnd);
      expect(handler.isActive()).toBe(false);
    });
  });

  describe('hasTwoFingers', () => {
    it('should return false with no touches', () => {
      handler.init();
      expect(handler.hasTwoFingers()).toBe(false);
    });

    it('should return false with one touch', () => {
      handler.init();

      const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
      canvas.dispatchEvent(touchStart);

      expect(handler.hasTwoFingers()).toBe(false);
    });

    it('should return true with two touches', () => {
      handler.init();

      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 100 },
        { clientX: 200, clientY: 100 },
      ]);
      canvas.dispatchEvent(touchStart);

      expect(handler.hasTwoFingers()).toBe(true);
    });
  });

  describe('pinch-to-zoom', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should increase scale when fingers move apart', () => {
      // Start with fingers 100px apart
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // Move fingers to 200px apart (double distance = double scale)
      const touchMove = createTouchEvent('touchmove', [
        { clientX: 50, clientY: 200 },
        { clientX: 250, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchMove);

      expect(onGestureChange).toHaveBeenCalled();
      expect(lastState?.scale).toBe(2);
    });

    it('should decrease scale when fingers move together', () => {
      // Start with fingers 200px apart
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 50, clientY: 200 },
        { clientX: 250, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // Move fingers to 100px apart (half distance = half scale)
      const touchMove = createTouchEvent('touchmove', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchMove);

      expect(onGestureChange).toHaveBeenCalled();
      expect(lastState?.scale).toBe(0.5);
    });

    it('should clamp scale to minimum of 0.5', () => {
      // Start with fingers 100px apart
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // Move fingers very close together (would result in scale < 0.5)
      const touchMove = createTouchEvent('touchmove', [
        { clientX: 145, clientY: 200 },
        { clientX: 155, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchMove);

      expect(lastState?.scale).toBe(0.5);
    });

    it('should clamp scale to maximum of 3', () => {
      // Start with fingers 100px apart
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 150, clientY: 200 },
        { clientX: 250, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // Move fingers very far apart (would result in scale > 3)
      const touchMove = createTouchEvent('touchmove', [
        { clientX: 0, clientY: 200 },
        { clientX: 400, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchMove);

      expect(lastState?.scale).toBe(3);
    });
  });

  describe('two-finger pan', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should track horizontal pan movement', () => {
      // Start gesture
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // Move both fingers right by 50px
      const touchMove = createTouchEvent('touchmove', [
        { clientX: 150, clientY: 200 },
        { clientX: 250, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchMove);

      expect(lastState?.panX).toBe(50);
    });

    it('should track vertical pan movement', () => {
      // Start gesture
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // Move both fingers down by 30px
      const touchMove = createTouchEvent('touchmove', [
        { clientX: 100, clientY: 230 },
        { clientX: 200, clientY: 230 },
      ]);
      canvas.dispatchEvent(touchMove);

      expect(lastState?.panY).toBe(30);
    });

    it('should accumulate pan across multiple moves', () => {
      // Start gesture
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      // First move
      const touchMove1 = createTouchEvent('touchmove', [
        { clientX: 120, clientY: 210 },
        { clientX: 220, clientY: 210 },
      ]);
      canvas.dispatchEvent(touchMove1);

      // Second move
      const touchMove2 = createTouchEvent('touchmove', [
        { clientX: 140, clientY: 220 },
        { clientX: 240, clientY: 220 },
      ]);
      canvas.dispatchEvent(touchMove2);

      expect(lastState?.panX).toBe(40); // 20 + 20
      expect(lastState?.panY).toBe(20); // 10 + 10
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should reset scale to 1', () => {
      // Zoom in
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      const touchMove = createTouchEvent('touchmove', [
        { clientX: 50, clientY: 200 },
        { clientX: 250, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchMove);
      expect(lastState?.scale).toBeGreaterThan(1);

      // Reset
      handler.reset();

      expect(lastState?.scale).toBe(1);
    });

    it('should reset pan to 0', () => {
      // Pan
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);

      const touchMove = createTouchEvent('touchmove', [
        { clientX: 150, clientY: 250 },
        { clientX: 250, clientY: 250 },
      ]);
      canvas.dispatchEvent(touchMove);

      // Reset
      handler.reset();

      expect(lastState?.panX).toBe(0);
      expect(lastState?.panY).toBe(0);
    });

    it('should call onGestureChange with reset state', () => {
      handler.reset();

      expect(onGestureChange).toHaveBeenCalledWith({
        scale: 1,
        panX: 0,
        panY: 0,
      });
    });

    it('should set isActive to false', () => {
      // Start gesture
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);
      expect(handler.isActive()).toBe(true);

      handler.reset();
      expect(handler.isActive()).toBe(false);
    });
  });

  describe('setScale', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should set scale directly', () => {
      handler.setScale(2);
      expect(lastState?.scale).toBe(2);
    });

    it('should clamp scale to minimum', () => {
      handler.setScale(0.1);
      expect(lastState?.scale).toBe(0.5);
    });

    it('should clamp scale to maximum', () => {
      handler.setScale(5);
      expect(lastState?.scale).toBe(3);
    });

    it('should call onGestureChange', () => {
      handler.setScale(1.5);
      expect(onGestureChange).toHaveBeenCalled();
    });
  });

  describe('setPan', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should set pan directly', () => {
      handler.setPan(100, 50);
      expect(lastState?.panX).toBe(100);
      expect(lastState?.panY).toBe(50);
    });

    it('should allow negative pan values', () => {
      handler.setPan(-50, -30);
      expect(lastState?.panX).toBe(-50);
      expect(lastState?.panY).toBe(-30);
    });

    it('should call onGestureChange', () => {
      handler.setPan(10, 20);
      expect(onGestureChange).toHaveBeenCalled();
    });
  });

  describe('destroy', () => {
    it('should remove touch event listeners', () => {
      const removeEventListenerSpy = vi.spyOn(canvas, 'removeEventListener');
      handler.init();
      handler.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));
    });
  });

  describe('single touch handling', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should not start gesture with single touch', () => {
      const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
      canvas.dispatchEvent(touchStart);

      expect(handler.isActive()).toBe(false);
    });

    it('should not process move with single touch', () => {
      const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
      canvas.dispatchEvent(touchStart);

      const touchMove = createTouchEvent('touchmove', [{ clientX: 150, clientY: 150 }]);
      canvas.dispatchEvent(touchMove);

      expect(onGestureChange).not.toHaveBeenCalled();
    });
  });

  describe('touchend with remaining finger', () => {
    beforeEach(() => {
      handler.init();
    });

    it('should end gesture when second finger is lifted', () => {
      // Start with two fingers
      const touchStart = createTouchEvent('touchstart', [
        { clientX: 100, clientY: 200 },
        { clientX: 200, clientY: 200 },
      ]);
      canvas.dispatchEvent(touchStart);
      expect(handler.isActive()).toBe(true);

      // Lift one finger
      const touchEnd = createTouchEvent('touchend', [{ clientX: 100, clientY: 200 }]);
      canvas.dispatchEvent(touchEnd);

      expect(handler.isActive()).toBe(false);
      expect(handler.hasTwoFingers()).toBe(false);
    });
  });
});
