/**
 * @module ui/collapse-controller
 * @description Collapsible toolbar controller for mobile optimization.
 *
 * The CollapseController provides a way to hide/show the toolbar to maximize
 * drawing space on mobile devices. It supports:
 * - Manual toggle via collapse button
 * - Auto-collapse when drawing starts
 * - Auto-expand when drawing ends
 * - CSS transition animations
 *
 * @example
 * ```typescript
 * // Initialize on a container
 * const controller = new CollapseController(uiContainer, true);
 * controller.init();
 *
 * // Programmatic control
 * controller.collapse();
 * controller.expand();
 * controller.toggle();
 *
 * // Check state
 * if (controller.collapsed) {
 *   console.log('Toolbar is hidden');
 * }
 *
 * // Cleanup
 * controller.destroy();
 * ```
 */
/**
 * Controls toolbar collapse/expand functionality.
 *
 * Adds a toggle button to the toolbar container and manages the collapsed state.
 * Uses CSS classes for smooth transitions and layout-aware collapse directions.
 */
export declare class CollapseController {
    private container;
    private autoCollapse;
    private isCollapsed;
    private collapseButton;
    private readonly prefix;
    constructor(container: HTMLElement, autoCollapse?: boolean);
    /**
     * Initialize the collapse controller
     */
    init(): void;
    /**
     * Create the collapse/expand toggle button
     */
    private createCollapseButton;
    /**
     * Update the button icon based on collapsed state
     */
    private updateButtonIcon;
    /**
     * Collapse the toolbar
     */
    collapse(): void;
    /**
     * Expand the toolbar
     */
    expand(): void;
    /**
     * Toggle collapse state
     */
    toggle(): void;
    /**
     * Check if toolbar is collapsed
     */
    get collapsed(): boolean;
    /**
     * Check if auto-collapse is enabled
     */
    get autoCollapseEnabled(): boolean;
    /**
     * Set auto-collapse behavior
     */
    setAutoCollapse(enabled: boolean): void;
    /**
     * Cleanup the controller
     */
    destroy(): void;
}
