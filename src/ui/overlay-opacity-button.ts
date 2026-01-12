import type { AnnotationTool } from "../core";
import { applyButtonStyle } from "./theme";
import type { MoveToolPlugin } from "../plugins/move";

type OpacityState = {
  value: number;
  label: string;
};

const OPACITY_STATES: OpacityState[] = [
  { value: 0, label: "off" },
  { value: 0.25, label: "25%" },
  { value: 0.5, label: "50%" },
  { value: 0.7, label: "70%" },
  { value: 1, label: "100%" },
];

function iconForOpacity(state: OpacityState, isShapeMode: boolean = false) {
  const shapeIndicator = isShapeMode
    ? '<circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.7"/>'
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${state.value === 0 ? 0.3 : state.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${state.label}</text>
    ${shapeIndicator}
  </svg>`;
}

function findStateIndex(opacity: number): number {
  const index = OPACITY_STATES.findIndex((s) => s.value === opacity);
  return index === -1 ? 4 : index; // default to 100% if not found
}

export function createOverlayOpacityButton(tool: AnnotationTool) {
  const button = document.createElement("button");
  button.type = "button";
  button.title = "Opacity (overlay / selected shape)";

  // Track overlay opacity index separately
  let overlayIndex = findStateIndex(tool.overlayOpacity);

  const updateButton = () => {
    const movePlugin = tool.currentTool === 'move'
      ? tool.pluginForTool('move') as MoveToolPlugin
      : null;
    const selectedShape = movePlugin?.getSelectedShape();

    if (selectedShape) {
      // Shape mode: show shape's opacity
      const shapeOpacity = selectedShape.opacity ?? 1;
      const stateIndex = findStateIndex(shapeOpacity);
      button.innerHTML = iconForOpacity(OPACITY_STATES[stateIndex], true);
      button.title = "Shape opacity";
    } else {
      // Overlay mode: show overlay opacity
      button.innerHTML = iconForOpacity(OPACITY_STATES[overlayIndex], false);
      button.title = "Overlay opacity";
    }
  };

  updateButton();
  applyButtonStyle(button);

  tool.addEvent(button, "click", () => {
    const movePlugin = tool.currentTool === 'move'
      ? tool.pluginForTool('move') as MoveToolPlugin
      : null;
    const selectedShape = movePlugin?.getSelectedShape();

    if (selectedShape && movePlugin) {
      // Shape mode: cycle through shape opacity
      const currentOpacity = selectedShape.opacity ?? 1;
      let shapeIndex = findStateIndex(currentOpacity);
      shapeIndex = (shapeIndex + 1) % OPACITY_STATES.length;
      const newOpacity = OPACITY_STATES[shapeIndex].value;
      movePlugin.setSelectedShapeOpacity(newOpacity);
    } else {
      // Overlay mode: cycle through overlay opacity
      overlayIndex = (overlayIndex + 1) % OPACITY_STATES.length;
      tool.overlayOpacity = OPACITY_STATES[overlayIndex].value;
      tool.redrawFullCanvas();
    }
    updateButton();
  });

  // Update button when tool changes or canvas redraws
  const originalRedraw = tool.redrawFullCanvas.bind(tool);
  tool.redrawFullCanvas = () => {
    originalRedraw();
    updateButton();
  };

  tool.buttons.push(button);
  tool.uiContainer.appendChild(button);

  return button;
}
