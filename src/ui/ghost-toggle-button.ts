import type { AnnotationTool } from "../core";
import { applyButtonStyle, setButtonActive } from "./theme";

function ghostIcon(enabled: boolean) {
  // Ghost/onion skinning icon - layers with transparency
  const opacity = enabled ? 1 : 0.4;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
    <!-- Back layer (previous frame) -->
    <rect x="2" y="4" width="12" height="12" rx="1" opacity="0.3" fill="currentColor"/>
    <!-- Middle layer (current frame) -->
    <rect x="6" y="6" width="12" height="12" rx="1" opacity="0.6" fill="currentColor"/>
    <!-- Front layer indicator -->
    <rect x="10" y="8" width="12" height="12" rx="1" fill="none"/>
  </svg>`;
}

export function createGhostToggleButton(tool: AnnotationTool) {
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.tooltip = "Ghost mode (onion skinning)";
  button.dataset.tool = "ghost";

  const updateButton = () => {
    button.innerHTML = ghostIcon(tool.ghostEnabled);
    if (tool.ghostEnabled) {
      setButtonActive(button, true);
    } else {
      setButtonActive(button, false);
    }
  };

  updateButton();
  applyButtonStyle(button);

  tool.addEvent(button, "click", () => {
    tool.toggleGhost();
    // Button update is now handled by the onGhostChange callback
  });

  // Register callback to sync button state when ghost mode changes from any source
  tool.onGhostChange(() => {
    updateButton();
  });

  tool.buttons.push(button);
  tool.uiContainer.appendChild(button);

  return button;
}
