import type { AnnotationTool } from "../core";

export function createColorPicker(defaultColor: string, tool: AnnotationTool) {
  // Create the color picker
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = defaultColor;
  colorPicker.dataset.tooltip = "Stroke color";


  const onColorChange = (event: Event) => {
    tool.ctx.strokeStyle = (event.target as HTMLInputElement).value;
    tool.ctx.fillStyle = (event.target as HTMLInputElement).value;
    tool.focusOnMediaNode();
  };

  tool.addEvent(colorPicker, "input", onColorChange);

  return colorPicker;
}