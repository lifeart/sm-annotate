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
export declare class GestureHandler {
    private canvas;
    private onGestureChange;
    private initialDistance;
    private initialScale;
    private currentScale;
    private panStart;
    private panOffset;
    private isGesturing;
    private activeTouches;
    /** Minimum zoom scale */
    private readonly minScale;
    /** Maximum zoom scale */
    private readonly maxScale;
    constructor(canvas: HTMLCanvasElement, onGestureChange: GestureChangeCallback);
    /**
     * Initialize gesture listeners
     */
    init(): void;
    /**
     * Handle touch start - detect two-finger gesture
     */
    private handleTouchStart;
    /**
     * Handle touch move - process pinch and pan
     */
    private handleTouchMove;
    /**
     * Handle touch end - finish gesture
     */
    private handleTouchEnd;
    /**
     * Calculate distance between two touch points
     */
    private getDistance;
    /**
     * Calculate midpoint between two touch points
     */
    private getMidpoint;
    /**
     * Get current gesture state
     */
    getState(): GestureState;
    /**
     * Check if a gesture is currently active
     */
    isActive(): boolean;
    /**
     * Check if there are two fingers touching
     */
    hasTwoFingers(): boolean;
    /**
     * Reset gesture state to defaults
     */
    reset(): void;
    /**
     * Set the zoom scale directly
     */
    setScale(scale: number): void;
    /**
     * Set the pan offset directly
     */
    setPan(x: number, y: number): void;
    /**
     * Cleanup gesture listeners
     */
    destroy(): void;
}
