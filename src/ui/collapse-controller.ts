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

import { getCSSPrefix } from "./theme";

/**
 * Controls toolbar collapse/expand functionality.
 *
 * Adds a toggle button to the toolbar container and manages the collapsed state.
 * Uses CSS classes for smooth transitions and layout-aware collapse directions.
 */
export class CollapseController {
  private isCollapsed = false;
  private collapseButton: HTMLButtonElement | null = null;
  private readonly prefix = getCSSPrefix();

  constructor(
    private container: HTMLElement,
    private autoCollapse: boolean = true
  ) {}

  /**
   * Initialize the collapse controller
   */
  init(): void {
    this.container.classList.add(`${this.prefix}-collapsible`);
    this.createCollapseButton();
  }

  /**
   * Create the collapse/expand toggle button
   */
  private createCollapseButton(): void {
    this.collapseButton = document.createElement('button');
    this.collapseButton.type = 'button';
    this.collapseButton.classList.add(`${this.prefix}-collapse-btn`);
    this.collapseButton.setAttribute('aria-label', 'Toggle toolbar');
    this.collapseButton.setAttribute('data-tooltip', 'Toggle toolbar');

    this.updateButtonIcon();

    this.collapseButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Insert button after container
    this.container.parentElement?.insertBefore(
      this.collapseButton,
      this.container.nextSibling
    );
  }

  /**
   * Update the button icon based on collapsed state
   */
  private updateButtonIcon(): void {
    if (!this.collapseButton) return;

    // Chevron icon that rotates based on state
    this.collapseButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
  }

  /**
   * Collapse the toolbar
   */
  collapse(): void {
    if (this.isCollapsed) return;

    this.isCollapsed = true;
    this.container.classList.add(`${this.prefix}-collapsed`);
  }

  /**
   * Expand the toolbar
   */
  expand(): void {
    if (!this.isCollapsed) return;

    this.isCollapsed = false;
    this.container.classList.remove(`${this.prefix}-collapsed`);
  }

  /**
   * Toggle collapse state
   */
  toggle(): void {
    if (this.isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  /**
   * Check if toolbar is collapsed
   */
  get collapsed(): boolean {
    return this.isCollapsed;
  }

  /**
   * Check if auto-collapse is enabled
   */
  get autoCollapseEnabled(): boolean {
    return this.autoCollapse;
  }

  /**
   * Set auto-collapse behavior
   */
  setAutoCollapse(enabled: boolean): void {
    this.autoCollapse = enabled;
  }

  /**
   * Cleanup the controller
   */
  destroy(): void {
    if (this.collapseButton) {
      this.collapseButton.remove();
      this.collapseButton = null;
    }

    this.container.classList.remove(
      `${this.prefix}-collapsible`,
      `${this.prefix}-collapsed`
    );
  }
}
