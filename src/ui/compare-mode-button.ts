import type { AnnotationTool } from "../core";
import type { CompareMode } from "../config";
import { applyButtonStyle } from "./theme";

const MODE_LABELS: Record<CompareMode, string> = {
  wipe: "Split view",
  overlay: "Overlay",
  difference: "Difference",
};

function iconForMode(mode: CompareMode) {
  const svg = (body: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  switch (mode) {
    case "overlay":
      // Two stacked, overlapping layers
      return svg(
        '<rect x="3" y="3" width="13" height="13" rx="2"/><rect x="8" y="8" width="13" height="13" rx="2" fill="currentColor" opacity="0.35"/>'
      );
    case "difference":
      // Two intersecting circles, intersection highlighted
      return svg(
        '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/><path d="M12 6.8a6 6 0 0 1 0 10.4a6 6 0 0 1 0-10.4z" fill="currentColor" stroke="none"/>'
      );
    default:
      // Frame split by a vertical divider
      return svg(
        '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><rect x="12" y="3" width="9" height="18" fill="currentColor" opacity="0.35" stroke="none"/>'
      );
  }
}

/**
 * Button that cycles how the reference video is layered in compare mode:
 * split view -> overlay -> difference. Shown and hidden together with the
 * compare button.
 */
export function createCompareModeButton(tool: AnnotationTool) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.linkedTool = "compare";

  const updateButton = () => {
    const mode = tool.compareMode;
    button.innerHTML = iconForMode(mode);
    button.dataset.tooltip = `Compare: ${MODE_LABELS[mode]}`;
    button.dataset.mode = mode;
  };

  updateButton();
  applyButtonStyle(button);

  tool.addEvent(button, "click", () => {
    tool.cycleCompareMode();
    // Show the new mode right away when no comparison is on screen yet
    if (!tool.isCompareActive && tool.referenceVideoElement) {
      tool.removeGlobalShape("compare");
      tool.addGlobalShape({
        type: "compare",
        x: 0.5,
        disabled: false,
        strokeStyle: tool.ctx.strokeStyle,
        fillStyle: tool.ctx.fillStyle,
        lineWidth: tool.ctx.lineWidth,
      } as Parameters<AnnotationTool["addGlobalShape"]>[0]);
      tool.redrawFullCanvas();
    }
  });

  tool.onCompareModeChange(() => {
    updateButton();
  });

  tool.buttons.push(button);
  tool.uiContainer.appendChild(button);

  return button;
}
