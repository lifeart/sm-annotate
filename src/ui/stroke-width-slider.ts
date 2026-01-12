import type { AnnotationTool } from "../core";

export function createStrokeWidthSlider(tool: AnnotationTool) {
  const strokeWidthSlider = document.createElement("input");
  strokeWidthSlider.type = "number";
  strokeWidthSlider.step = "1";
  strokeWidthSlider.min = "1";
  strokeWidthSlider.max = "10";
  strokeWidthSlider.value = "5";
  strokeWidthSlider.style.margin = "5px";
  strokeWidthSlider.dataset.tooltip = "Stroke width";

  const onStrokeWidthChange = (event: Event) => {
    tool.ctx.lineWidth = (event.target as HTMLInputElement).valueAsNumber;
    tool.focusOnMediaNode();
  };

  tool.addEvent(strokeWidthSlider, "input", onStrokeWidthChange);

  return strokeWidthSlider;
}