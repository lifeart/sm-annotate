/**
 * @module ui/layout
 * @description Layout management system for SmAnnotate.
 *
 * The layout manager controls toolbar positioning and provides four layout modes:
 * - **Horizontal**: Classic layout with top toolbar and bottom player controls
 * - **Vertical**: Sidebar layout for portrait orientations or dense UIs
 * - **Minimal**: Compact, draggable floating toolbar
 * - **Bottom Dock**: Single toolbar at bottom combining all controls
 *
 * @example
 * ```typescript
 * // Change layout at runtime
 * annotationTool.setLayout('vertical');
 *
 * // Use sidebar on right side
 * annotationTool.setLayout('vertical');
 * // Configure in initial config: toolbar.sidebarPosition = 'right'
 * ```
 */
import type { AnnotationTool } from "../../core";
import type { LayoutMode } from "../../config";
/**
 * Interface for layout renderers.
 * Each layout mode implements this interface to provide custom positioning and behavior.
 */
export interface LayoutRenderer {
    /**
     * Apply the layout to the annotation tool.
     * Called when switching to this layout mode.
     * @param tool - The annotation tool instance
     */
    apply(tool: AnnotationTool): void;
    /**
     * Cleanup layout-specific elements and event listeners.
     * Called when switching away from this layout mode.
     */
    cleanup(): void;
    /** The layout mode name identifier */
    readonly name: LayoutMode;
}
/**
 * Manages layout switching for the annotation tool.
 *
 * The LayoutManager handles:
 * - Applying CSS classes for different layout modes
 * - Creating and destroying layout-specific renderers
 * - Managing the root container element
 *
 * @example
 * ```typescript
 * const manager = new LayoutManager(annotationTool);
 * manager.setLayout('minimal', { sidebarPosition: 'right' });
 * console.log(manager.getCurrentLayout()); // 'minimal'
 * manager.destroy();
 * ```
 */
export declare class LayoutManager {
    private tool;
    private currentRenderer;
    private rootElement;
    private readonly prefix;
    constructor(tool: AnnotationTool);
    /**
     * Get the root container element that holds layout classes
     */
    private getRootElement;
    /**
     * Remove all layout classes from root element
     */
    private clearLayoutClasses;
    /**
     * Set the active layout mode
     */
    setLayout(mode: LayoutMode, options?: {
        sidebarPosition?: 'left' | 'right';
    }): void;
    /**
     * Get current layout mode
     */
    getCurrentLayout(): LayoutMode | null;
    /**
     * Create a layout renderer for the given mode
     */
    private createRenderer;
    /**
     * Cleanup the layout manager
     */
    destroy(): void;
}
/**
 * Horizontal layout - default layout with toolbar at top, controls at bottom
 */
declare class HorizontalLayout implements LayoutRenderer {
    readonly name: LayoutMode;
    apply(_tool: AnnotationTool): void;
    cleanup(): void;
}
/**
 * Vertical sidebar layout - tools in a vertical sidebar
 */
declare class VerticalLayout implements LayoutRenderer {
    readonly name: LayoutMode;
    apply(_tool: AnnotationTool): void;
    cleanup(): void;
}
/**
 * Minimal floating layout - compact draggable toolbar
 */
declare class MinimalLayout implements LayoutRenderer {
    readonly name: LayoutMode;
    private dragState;
    private container;
    private boundHandlers;
    private prefix;
    apply(tool: AnnotationTool): void;
    cleanup(): void;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
}
/**
 * Bottom dock layout - all controls in a single bar at bottom
 */
declare class BottomDockLayout implements LayoutRenderer {
    readonly name: LayoutMode;
    private movedElements;
    private playerControls;
    private divider;
    private prefix;
    apply(tool: AnnotationTool): void;
    cleanup(): void;
}
export { HorizontalLayout, VerticalLayout, MinimalLayout, BottomDockLayout };
