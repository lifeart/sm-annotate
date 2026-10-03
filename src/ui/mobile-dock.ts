/**
 * @module ui/mobile-dock
 * @description Touch-first layout used below the mobile breakpoint.
 *
 * Instead of floating toolbars on top of the video, the dock puts the player
 * controls and the drawing tools in the page flow under the video (or in side
 * rails in landscape), so nothing covers the frame being annotated and every
 * control is within thumb reach. Colour and stroke width move into a bottom
 * sheet opened from a single "style" button.
 */

import type { AnnotationTool } from "../core";
import { getCSSPrefix } from "./theme";

/** Colours offered in the style sheet; the last swatch opens the native picker */
export const DOCK_SWATCHES = [
  "#d31a3b",
  "#ffa500",
  "#F3CE32",
  "#15d33b",
  "#00ffff",
  "#0085CA",
  "#ee82ee",
  "#ffffff",
  "#000000",
];

const MIN_STROKE = 1;
const MAX_STROKE = 10;

export class MobileDock {
  private readonly prefix = getCSSPrefix();
  private isActive = false;
  private styleButton: HTMLButtonElement | null = null;
  private sheet: HTMLDivElement | null = null;
  private swatchButtons: HTMLButtonElement[] = [];
  private customColorInput: HTMLInputElement | null = null;
  private sizeInput: HTMLInputElement | null = null;
  private sizePreview: HTMLDivElement | null = null;
  private cleanups: Array<() => void> = [];

  constructor(private tool: AnnotationTool) {}

  get active(): boolean {
    return this.isActive;
  }

  get sheetOpen(): boolean {
    return !!this.sheet && !this.sheet.hidden;
  }

  init(): void {
    // Tooltips don't show on touch screens; expose their text as labels
    this.tool.buttons.forEach((button) => {
      if (button.dataset.tooltip && !button.hasAttribute("aria-label")) {
        button.setAttribute("aria-label", button.dataset.tooltip);
      }
    });
    // Replaced by the style sheet while docked
    this.tool.colorPicker.classList.add(`${this.prefix}-dock-hidden`);
    this.tool.strokeSizePicker.classList.add(`${this.prefix}-dock-hidden`);
    this.tool.strokeSizePicker.parentElement?.classList.add(`${this.prefix}-dock-hidden`);
    this.createStyleButton();
    this.createSheet();

    const onResize = () => this.update();
    window.addEventListener("resize", onResize);
    this.cleanups.push(() => window.removeEventListener("resize", onResize));

    // Docked bars are in the flow: when one changes size (e.g. compare
    // buttons appear) the video can move without a window resize, and the
    // absolutely positioned canvas has to follow it.
    if (typeof ResizeObserver !== "undefined") {
      let scheduled = false;
      const observer = new ResizeObserver(() => {
        if (!this.isActive || scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
          scheduled = false;
          if (this.isActive) this.tool.setCanvasSize();
        });
      });
      observer.observe(this.tool.uiContainer);
      observer.observe(this.tool.playerControlsContainer);
      this.cleanups.push(() => observer.disconnect());
    }

    // Keep the style button in sync with the hidden inputs (keyboard shortcuts
    // and API callers change them directly)
    const sync = () => this.syncFromInputs();
    this.tool.colorPicker.addEventListener("input", sync);
    this.tool.strokeSizePicker.addEventListener("input", sync);
    this.cleanups.push(() => {
      this.tool.colorPicker?.removeEventListener("input", sync);
      this.tool.strokeSizePicker?.removeEventListener("input", sync);
    });

    this.update();
  }

  /**
   * Re-evaluate whether the dock should be shown for the current viewport.
   */
  update(): void {
    const shouldBeActive =
      this.tool.config.mobile.dock !== false && this.tool.isMobile;
    if (shouldBeActive === this.isActive) return;
    this.isActive = shouldBeActive;

    const root = this.getRoot();
    root?.classList.toggle(`${this.prefix}-mobile`, shouldBeActive);
    // Carry "controls hidden during playback" across the switch: floating
    // bars hide with display:none, the dock only dims
    const ui = this.tool.uiContainer;
    const dimmed = `${this.prefix}-dimmed`;
    const canvasShown = this.tool.canvas?.style.display !== "none";
    if (shouldBeActive && ui.style.display === "none" && canvasShown) {
      ui.style.display = "";
      ui.classList.add(dimmed);
    } else if (!shouldBeActive && ui.classList.contains(dimmed)) {
      ui.classList.remove(dimmed);
      ui.style.display = "none";
    }
    if (!shouldBeActive) {
      this.closeSheet();
    }
    // Toolbars switch between overlay and in-flow, so the video may move
    this.tool.setCanvasSize();
  }

  /**
   * Space taken by the docked toolbars, used to fit the video in fullscreen.
   */
  reservedSpace(): { width: number; height: number } {
    const root = this.getRoot();
    const ui = this.tool.uiContainer;
    const controls = this.tool.playerControlsContainer;
    if (!root || !ui || !controls) return { width: 0, height: 0 };
    const isRow = getComputedStyle(root).flexDirection === "row";
    const gap = parseFloat(getComputedStyle(root).rowGap || "0") || 0;
    if (isRow) {
      return { width: ui.offsetWidth + controls.offsetWidth + gap * 2, height: 0 };
    }
    return { width: 0, height: ui.offsetHeight + controls.offsetHeight + gap * 2 };
  }

  openSheet(): void {
    if (!this.sheet) return;
    this.syncFromInputs();
    this.sheet.hidden = false;
    // Next frame so the transition runs from the hidden state
    requestAnimationFrame(() => {
      this.sheet?.classList.add(`${this.prefix}-sheet-open`);
    });
    this.styleButton?.setAttribute("aria-expanded", "true");
  }

  closeSheet(): void {
    if (!this.sheet || this.sheet.hidden) return;
    this.sheet.classList.remove(`${this.prefix}-sheet-open`);
    this.sheet.hidden = true;
    this.styleButton?.setAttribute("aria-expanded", "false");
  }

  destroy(): void {
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    this.getRoot()?.classList.remove(`${this.prefix}-mobile`);
    this.styleButton?.remove();
    this.sheet?.remove();
    this.styleButton = null;
    this.sheet = null;
    this.swatchButtons = [];
    this.isActive = false;
    this.root = null;
  }

  private root: HTMLElement | null = null;

  // Cached: destroy() runs after the canvas has been detached
  private getRoot(): HTMLElement | null {
    if (!this.root) {
      this.root = this.tool.canvas?.parentElement ?? null;
    }
    return this.root;
  }

  private setColor(color: string) {
    const picker = this.tool.colorPicker;
    picker.value = color;
    picker.dispatchEvent(new Event("input", { bubbles: true }));
    this.syncFromInputs();
  }

  private setStrokeSize(size: number) {
    const input = this.tool.strokeSizePicker;
    input.value = String(size);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    this.syncFromInputs();
  }

  private syncFromInputs() {
    const color = this.tool.colorPicker?.value ?? DOCK_SWATCHES[0];
    const rawSize = this.tool.strokeSizePicker?.valueAsNumber;
    const size = Number.isFinite(rawSize)
      ? Math.min(MAX_STROKE, Math.max(MIN_STROKE, rawSize))
      : 5;

    if (this.styleButton) {
      this.styleButton.style.setProperty(`--${this.prefix}-style-color`, color);
      this.styleButton.style.setProperty(
        `--${this.prefix}-style-size`,
        `${6 + size * 1.4}px`
      );
    }
    const normalized = color.toLowerCase();
    let matched = false;
    this.swatchButtons.forEach((button) => {
      const isMatch = button.dataset.color?.toLowerCase() === normalized;
      matched = matched || isMatch;
      button.classList.toggle("active", isMatch);
      button.setAttribute("aria-pressed", String(isMatch));
    });
    if (this.customColorInput) {
      this.customColorInput.value = color;
      this.customColorInput.parentElement?.classList.toggle("active", !matched);
    }
    if (this.sizeInput) {
      this.sizeInput.value = String(size);
    }
    if (this.sizePreview) {
      this.sizePreview.style.height = `${size}px`;
      this.sizePreview.style.background = color;
    }
  }

  private createStyleButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(`${this.prefix}-btn`, `${this.prefix}-style-btn`);
    button.dataset.control = "style";
    button.setAttribute("aria-label", "Color and stroke width");
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = `<span class="${this.prefix}-style-dot"></span>`;
    const onClick = () => {
      if (this.sheetOpen) {
        this.closeSheet();
      } else {
        this.openSheet();
      }
    };
    button.addEventListener("click", onClick);
    this.cleanups.push(() => button.removeEventListener("click", onClick));
    this.tool.uiContainer.appendChild(button);
    this.styleButton = button;
  }

  private createSheet() {
    const p = this.prefix;
    const sheet = document.createElement("div");
    sheet.classList.add(`${p}-sheet`);
    sheet.hidden = true;
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-label", "Stroke style");

    const backdrop = document.createElement("div");
    backdrop.classList.add(`${p}-sheet-backdrop`);

    const panel = document.createElement("div");
    panel.classList.add(`${p}-sheet-panel`);

    const handle = document.createElement("div");
    handle.classList.add(`${p}-sheet-handle`);

    const colorLabel = document.createElement("div");
    colorLabel.classList.add(`${p}-sheet-label`);
    colorLabel.textContent = "Color";

    const swatches = document.createElement("div");
    swatches.classList.add(`${p}-swatches`);
    DOCK_SWATCHES.forEach((color) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.classList.add(`${p}-swatch`);
      swatch.dataset.color = color;
      swatch.style.setProperty(`--${p}-swatch-color`, color);
      swatch.setAttribute("aria-label", `Color ${color}`);
      swatch.addEventListener("click", () => this.setColor(color));
      swatches.appendChild(swatch);
      this.swatchButtons.push(swatch);
    });

    // Native picker for any other colour, styled as a rainbow swatch
    const custom = document.createElement("label");
    custom.classList.add(`${p}-swatch`, `${p}-swatch-custom`);
    custom.setAttribute("aria-label", "Custom color");
    const customInput = document.createElement("input");
    customInput.type = "color";
    customInput.addEventListener("input", () => this.setColor(customInput.value));
    custom.appendChild(customInput);
    swatches.appendChild(custom);
    this.customColorInput = customInput;

    const sizeLabel = document.createElement("div");
    sizeLabel.classList.add(`${p}-sheet-label`);
    sizeLabel.textContent = "Width";

    const sizeRow = document.createElement("div");
    sizeRow.classList.add(`${p}-size-row`);
    const preview = document.createElement("div");
    preview.classList.add(`${p}-size-preview`);
    const previewLine = document.createElement("div");
    previewLine.classList.add(`${p}-size-preview-line`);
    preview.appendChild(previewLine);
    const sizeInput = document.createElement("input");
    sizeInput.type = "range";
    sizeInput.min = String(MIN_STROKE);
    sizeInput.max = String(MAX_STROKE);
    sizeInput.step = "1";
    sizeInput.classList.add(`${p}-size-range`);
    sizeInput.setAttribute("aria-label", "Stroke width");
    sizeInput.addEventListener("input", () =>
      this.setStrokeSize(sizeInput.valueAsNumber)
    );
    sizeRow.appendChild(sizeInput);
    sizeRow.appendChild(preview);
    this.sizeInput = sizeInput;
    this.sizePreview = previewLine;

    const done = document.createElement("button");
    done.type = "button";
    done.classList.add(`${p}-sheet-done`);
    done.textContent = "Done";
    done.addEventListener("click", () => this.closeSheet());
    backdrop.addEventListener("click", () => this.closeSheet());

    panel.append(handle, colorLabel, swatches, sizeLabel, sizeRow, done);
    sheet.append(backdrop, panel);

    // Inside the root so it stays visible when the root goes fullscreen
    this.getRoot()?.appendChild(sheet);
    this.sheet = sheet;
    this.syncFromInputs();
  }
}
