import type { AnnotationTool } from "../core";

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

function iconForOpacity(state: OpacityState) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <style>
      .label {
        font-family: sans-serif;
        font-size: 9px;
      }
    </style>
    <rect x="3" y="3" width="18" height="18" rx="2" opacity="${state.value === 0 ? 0.3 : state.value}"/>
    <text x="12" y="14" text-anchor="middle" class="label" fill="currentColor">${state.label}</text>
  </svg>`;
}

export function createOverlayOpacityButton(tool: AnnotationTool) {
  const button = document.createElement("button");
  button.type = "button";
  button.title = "Overlay opacity";

  // Find initial state index based on tool's current opacity
  let currentIndex = OPACITY_STATES.findIndex(
    (s) => s.value === tool.overlayOpacity
  );
  if (currentIndex === -1) {
    currentIndex = 3; // default to 70%
  }

  button.innerHTML = iconForOpacity(OPACITY_STATES[currentIndex]);
  button.style.margin = "5px";

  tool.addEvent(button, "click", () => {
    currentIndex = (currentIndex + 1) % OPACITY_STATES.length;
    const state = OPACITY_STATES[currentIndex];
    tool.overlayOpacity = state.value;
    button.innerHTML = iconForOpacity(state);
    tool.redrawFullCanvas();
  });

  tool.buttons.push(button);
  tool.uiContainer.appendChild(button);

  return button;
}
