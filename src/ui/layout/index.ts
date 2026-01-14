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
import { getCSSPrefix } from "../theme";

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
export class LayoutManager {
  private currentRenderer: LayoutRenderer | null = null;
  private rootElement: HTMLElement | null = null;
  private readonly prefix = getCSSPrefix();

  constructor(private tool: AnnotationTool) {}

  /**
   * Get the root container element that holds layout classes
   */
  private getRootElement(): HTMLElement | null {
    if (!this.rootElement) {
      // Find or create root container - it should be the parent of the canvas
      const canvas = this.tool.canvas;
      if (canvas?.parentElement) {
        this.rootElement = canvas.parentElement;
        this.rootElement.classList.add(`${this.prefix}-root`);
      }
    }
    return this.rootElement;
  }

  /**
   * Remove all layout classes from root element
   */
  private clearLayoutClasses(): void {
    const root = this.getRootElement();
    if (root) {
      root.classList.remove(
        `${this.prefix}-layout-horizontal`,
        `${this.prefix}-layout-vertical`,
        `${this.prefix}-layout-minimal`,
        `${this.prefix}-layout-bottom-dock`,
        `${this.prefix}-sidebar-right`
      );
    }
  }

  /**
   * Set the active layout mode
   */
  setLayout(mode: LayoutMode, options?: { sidebarPosition?: 'left' | 'right' }): void {
    // Cleanup previous layout
    if (this.currentRenderer) {
      this.currentRenderer.cleanup();
    }

    // Clear existing layout classes
    this.clearLayoutClasses();

    // Apply new layout class
    const root = this.getRootElement();
    if (root) {
      root.classList.add(`${this.prefix}-layout-${mode}`);

      // Add sidebar position class for vertical layout
      if (mode === 'vertical' && options?.sidebarPosition === 'right') {
        root.classList.add(`${this.prefix}-sidebar-right`);
      }
    }

    // Create and apply the new layout renderer
    this.currentRenderer = this.createRenderer(mode);
    this.currentRenderer.apply(this.tool);
  }

  /**
   * Get current layout mode
   */
  getCurrentLayout(): LayoutMode | null {
    return this.currentRenderer?.name ?? null;
  }

  /**
   * Create a layout renderer for the given mode
   */
  private createRenderer(mode: LayoutMode): LayoutRenderer {
    switch (mode) {
      case 'horizontal':
        return new HorizontalLayout();
      case 'vertical':
        return new VerticalLayout();
      case 'minimal':
        return new MinimalLayout();
      case 'bottom-dock':
        return new BottomDockLayout();
    }
  }

  /**
   * Cleanup the layout manager
   */
  destroy(): void {
    if (this.currentRenderer) {
      this.currentRenderer.cleanup();
      this.currentRenderer = null;
    }
    this.clearLayoutClasses();
    this.rootElement = null;
  }
}

/**
 * Horizontal layout - default layout with toolbar at top, controls at bottom
 */
class HorizontalLayout implements LayoutRenderer {
  readonly name: LayoutMode = 'horizontal';

  apply(_tool: AnnotationTool): void {
    // Default layout - CSS handles positioning
  }

  cleanup(): void {
    // No cleanup needed for default layout
  }
}

/**
 * Vertical sidebar layout - tools in a vertical sidebar
 */
class VerticalLayout implements LayoutRenderer {
  readonly name: LayoutMode = 'vertical';

  apply(_tool: AnnotationTool): void {
    // CSS handles vertical positioning
  }

  cleanup(): void {
    // No cleanup needed
  }
}

/**
 * Minimal floating layout - compact draggable toolbar
 */
class MinimalLayout implements LayoutRenderer {
  readonly name: LayoutMode = 'minimal';
  private dragState: { isDragging: boolean; startX: number; startY: number; offsetX: number; offsetY: number } = {
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  };
  private container: HTMLElement | null = null;
  private boundHandlers: {
    mousedown?: (e: MouseEvent) => void;
    mousemove?: (e: MouseEvent) => void;
    mouseup?: (e: MouseEvent) => void;
  } = {};
  private prefix = getCSSPrefix();

  apply(tool: AnnotationTool): void {
    this.container = tool.uiContainer;
    if (!this.container) return;

    // Setup drag handlers
    this.boundHandlers.mousedown = this.handleMouseDown.bind(this);
    this.boundHandlers.mousemove = this.handleMouseMove.bind(this);
    this.boundHandlers.mouseup = this.handleMouseUp.bind(this);

    this.container.addEventListener('mousedown', this.boundHandlers.mousedown);
    document.addEventListener('mousemove', this.boundHandlers.mousemove);
    document.addEventListener('mouseup', this.boundHandlers.mouseup);

    // Apply initial position from config if available
    const config = tool.config;
    if (config?.toolbar?.position) {
      this.container.style.left = `${config.toolbar.position.x}px`;
      this.container.style.top = `${config.toolbar.position.y}px`;
    }
  }

  cleanup(): void {
    if (this.container && this.boundHandlers.mousedown) {
      this.container.removeEventListener('mousedown', this.boundHandlers.mousedown);
    }
    if (this.boundHandlers.mousemove) {
      document.removeEventListener('mousemove', this.boundHandlers.mousemove);
    }
    if (this.boundHandlers.mouseup) {
      document.removeEventListener('mouseup', this.boundHandlers.mouseup);
    }

    // Reset container position
    if (this.container) {
      this.container.style.left = '';
      this.container.style.top = '';
    }

    this.container = null;
    this.boundHandlers = {};
  }

  private handleMouseDown(e: MouseEvent): void {
    if (!this.container) return;

    // Only start drag from container background, not buttons
    if ((e.target as HTMLElement).closest('button, input')) return;

    this.dragState.isDragging = true;
    this.dragState.startX = e.clientX;
    this.dragState.startY = e.clientY;

    const rect = this.container.getBoundingClientRect();
    this.dragState.offsetX = rect.left;
    this.dragState.offsetY = rect.top;

    this.container.classList.add(`${this.prefix}-dragging`);
    e.preventDefault();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.dragState.isDragging || !this.container) return;

    const dx = e.clientX - this.dragState.startX;
    const dy = e.clientY - this.dragState.startY;

    this.container.style.left = `${this.dragState.offsetX + dx}px`;
    this.container.style.top = `${this.dragState.offsetY + dy}px`;
  }

  private handleMouseUp(): void {
    if (!this.container) return;

    this.dragState.isDragging = false;
    this.container.classList.remove(`${this.prefix}-dragging`);
  }
}

/**
 * Bottom dock layout - all controls in a single bar at bottom
 */
class BottomDockLayout implements LayoutRenderer {
  readonly name: LayoutMode = 'bottom-dock';
  private movedElements: HTMLElement[] = [];
  private playerControls: HTMLElement | null = null;
  private divider: HTMLElement | null = null;
  private prefix = getCSSPrefix();

  apply(tool: AnnotationTool): void {
    // Move player controls children into main container
    const container = tool.uiContainer;
    const playerControls = tool.playerControlsContainer;

    if (container && playerControls) {
      this.playerControls = playerControls;

      // Add a divider before player controls elements
      this.divider = document.createElement('div');
      this.divider.classList.add(`${this.prefix}-divider`);
      container.appendChild(this.divider);

      // Move each child from player controls to main container
      while (playerControls.firstChild) {
        const child = playerControls.firstChild as HTMLElement;
        this.movedElements.push(child);
        container.appendChild(child);
      }
    }
  }

  cleanup(): void {
    // Move elements back to player controls
    if (this.playerControls) {
      for (const element of this.movedElements) {
        this.playerControls.appendChild(element);
      }
    }

    // Remove the divider we added
    if (this.divider && this.divider.parentNode) {
      this.divider.parentNode.removeChild(this.divider);
    }

    this.movedElements = [];
    this.playerControls = null;
    this.divider = null;
  }
}

export { HorizontalLayout, VerticalLayout, MinimalLayout, BottomDockLayout };
