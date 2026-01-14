/**
 * @module gestures/gesture-handler
 * @description Touch gesture handling for mobile zoom and pan.
 *
 * The GestureHandler provides pinch-to-zoom and two-finger pan support
 * for mobile devices, allowing users to zoom in for detailed annotation work.
 *
 * Features:
 * - Pinch-to-zoom with scale limits (0.5x to 3x)
 * - Two-finger pan for moving the canvas view
 * - Zoom centered on canvas center
 * - Reset functionality to return to default view
 *
 * @example
 * ```typescript
 * const handler = new GestureHandler(canvas, (state) => {
 *   console.log(`Zoom: ${state.scale}x, Pan: (${state.panX}, ${state.panY})`);
 *   // Apply transform to canvas context
 *   ctx.setTransform(state.scale, 0, 0, state.scale, state.panX, state.panY);
 *   redraw();
 * });
 *
 * handler.init();
 *
 * // Reset zoom/pan
 * handler.reset();
 *
 * // Cleanup
 * handler.destroy();
 * ```
 */

/**
 * State of the current gesture transformation.
 * Used to track zoom and pan values for canvas rendering.
 */
export interface GestureState {
  /** Current zoom scale (1 = no zoom, range: 0.5 to 3) */
  scale: number;
  /** Horizontal pan offset in pixels */
  panX: number;
  /** Vertical pan offset in pixels */
  panY: number;
}

/**
 * Callback invoked when gesture state changes.
 * @param state - The new gesture state to apply
 */
export type GestureChangeCallback = (state: GestureState) => void;

/**
 * Handles pinch-to-zoom and two-finger pan gestures on the canvas.
 *
 * The handler listens for touch events and calculates zoom and pan values
 * based on finger movements. Changes are reported via the callback function.
 */
export class GestureHandler {
  private initialDistance = 0;
  private initialScale = 1;
  private currentScale = 1;
  private panStart = { x: 0, y: 0 };
  private panOffset = { x: 0, y: 0 };
  private isGesturing = false;
  private activeTouches = 0;

  /** Minimum zoom scale */
  private readonly minScale = 0.5;
  /** Maximum zoom scale */
  private readonly maxScale = 3;

  constructor(
    private canvas: HTMLCanvasElement,
    private onGestureChange: GestureChangeCallback
  ) {}

  /**
   * Initialize gesture listeners
   */
  init(): void {
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
  }

  /**
   * Handle touch start - detect two-finger gesture
   */
  private handleTouchStart = (e: TouchEvent): void => {
    this.activeTouches = e.touches.length;

    if (e.touches.length === 2) {
      // Start two-finger gesture
      e.preventDefault();
      this.isGesturing = true;
      this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
      this.initialScale = this.currentScale;
      this.panStart = this.getMidpoint(e.touches[0], e.touches[1]);
    }
  };

  /**
   * Handle touch move - process pinch and pan
   */
  private handleTouchMove = (e: TouchEvent): void => {
    if (e.touches.length === 2 && this.isGesturing) {
      e.preventDefault();

      // Calculate pinch-to-zoom
      const distance = this.getDistance(e.touches[0], e.touches[1]);
      const scaleChange = distance / this.initialDistance;
      this.currentScale = Math.max(
        this.minScale,
        Math.min(this.maxScale, this.initialScale * scaleChange)
      );

      // Calculate two-finger pan
      const midpoint = this.getMidpoint(e.touches[0], e.touches[1]);
      this.panOffset = {
        x: this.panOffset.x + (midpoint.x - this.panStart.x),
        y: this.panOffset.y + (midpoint.y - this.panStart.y),
      };
      this.panStart = midpoint;

      // Notify of gesture change
      this.onGestureChange(this.getState());
    }
  };

  /**
   * Handle touch end - finish gesture
   */
  private handleTouchEnd = (e: TouchEvent): void => {
    this.activeTouches = e.touches.length;

    if (e.touches.length < 2) {
      this.isGesturing = false;

      // If single touch remains, update pan start for potential future gesture
      if (e.touches.length === 1) {
        this.panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }
  };

  /**
   * Calculate distance between two touch points
   */
  private getDistance(t1: Touch, t2: Touch): number {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate midpoint between two touch points
   */
  private getMidpoint(t1: Touch, t2: Touch): { x: number; y: number } {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
  }

  /**
   * Get current gesture state
   */
  getState(): GestureState {
    return {
      scale: this.currentScale,
      panX: this.panOffset.x,
      panY: this.panOffset.y,
    };
  }

  /**
   * Check if a gesture is currently active
   */
  isActive(): boolean {
    return this.isGesturing;
  }

  /**
   * Check if there are two fingers touching
   */
  hasTwoFingers(): boolean {
    return this.activeTouches >= 2;
  }

  /**
   * Reset gesture state to defaults
   */
  reset(): void {
    this.currentScale = 1;
    this.panOffset = { x: 0, y: 0 };
    this.initialScale = 1;
    this.initialDistance = 0;
    this.isGesturing = false;

    this.onGestureChange(this.getState());
  }

  /**
   * Set the zoom scale directly
   */
  setScale(scale: number): void {
    this.currentScale = Math.max(this.minScale, Math.min(this.maxScale, scale));
    this.onGestureChange(this.getState());
  }

  /**
   * Set the pan offset directly
   */
  setPan(x: number, y: number): void {
    this.panOffset = { x, y };
    this.onGestureChange(this.getState());
  }

  /**
   * Cleanup gesture listeners
   */
  destroy(): void {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
  }
}
