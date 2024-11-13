import { BasePlugin, IShapeBase, ToolPlugin } from "./base";
import type { ShapeMap } from ".";

export interface IText extends IShapeBase {
  type: "text";
  x: number;
  y: number;
  text: string;
}

export class TextToolPlugin
  extends BasePlugin<IText>
  implements ToolPlugin<IText>
{
  name = "text" as keyof ShapeMap;
  private activePopup: HTMLDivElement | null = null;
  handleKeyDown = (_e: KeyboardEvent) => void(0);

  move(shape: IText, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }
  onActivate() {
    this.annotationTool.canvas.style.cursor = "text";
    this.isDrawing = true;
  }
  onDeactivate() {
    this.destroyPopup();
    this.annotationTool.canvas.style.cursor = "default";
    this.isDrawing = false;
  }

  draw(shape: IText) {
    // support multiline text
    const lines = shape.text.split("\n");
    // draw white background for text area with padding
    // const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b));
    // this.ctx.save();
    // this.ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    // this.ctx.fillRect(
    //   shape.x - 5,
    //   shape.y - 20,
    //   10 + this.ctx.measureText(longestLine).width,
    //   10 + lines.length * 20
    // );
    // this.ctx.restore();
    for (let i = 0; i < lines.length; i++) {
      this.drawText(shape.x, shape.y + i * 20, lines[i]);
    }

  }
  drawText(x: number, y: number, text: string) {
    const fontSize = 16 + this.ctx.lineWidth * 0.5;
    this.ctx.font = `${fontSize}px Helvetica Neue, Arial`;
    this.ctx.fillText(text, x, y);
  }
  onPointerDown(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.startX = x;
    this.startY = y;
  }
  onPointerMove(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);

    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  normalize(shape: IText, canvasWidth: number, canvasHeight: number): IText {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
    };
  }
  private destroyPopup() {
    if (this.activePopup) {
      this.annotationTool.canvas.parentElement?.removeChild(this.activePopup);
      this.activePopup = null;
      // Remove any lingering event listeners
      document.removeEventListener('keydown', this.handleKeyDown);
    }
  }
  private createTextInputPopup(x: number, y: number) {
    // Destroy any existing popup first
    this.destroyPopup();

    // Create popup container
    const popup = document.createElement('div');
    this.activePopup = popup;
    popup.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 280px;
    `;

    // Create text input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter text to draw';
    input.style.cssText = `
      display: block;
      width: 100%;
      padding: 8px 12px;
      margin-bottom: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      line-height: 20px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    `;
    input.addEventListener('focus', () => {
      input.style.borderColor = '#007bff';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#ddd';
    });

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;

    // Common button styles
    const buttonStyles = `
      height: 36px;
      min-width: 80px;
      padding: 0 16px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `;

    // Create Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.cssText = `
      ${buttonStyles}
      background: #f0f0f0;
      color: #333;
    `;
    cancelButton.addEventListener('mouseover', () => {
      cancelButton.style.opacity = '0.8';
    });
    cancelButton.addEventListener('mouseout', () => {
      cancelButton.style.opacity = '1';
    });

    // Create OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.cssText = `
      ${buttonStyles}
      background: #007bff;
      color: white;
    `;
    okButton.addEventListener('mouseover', () => {
      okButton.style.opacity = '0.8';
    });
    okButton.addEventListener('mouseout', () => {
      okButton.style.opacity = '1';
    });

    const closePopup = () => {
      this.destroyPopup();
    };

    const handleSave = () => {
      const inputText = input.value.trim();
      if (inputText) {
        this.save({
          type: "text",
          x,
          y,
          text: inputText,
          strokeStyle: this.ctx.strokeStyle,
          fillStyle: this.ctx.fillStyle,
          lineWidth: this.ctx.lineWidth,
        });
        this.annotationTool.currentTool = null;
      }
      closePopup();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup();
      } else if (e.key === 'Enter') {
        handleSave();
      }
    };
    this.handleKeyDown = handleKeyDown as (e: KeyboardEvent) => undefined;

    okButton.onclick = handleSave;
    cancelButton.onclick = closePopup;
    input.onkeyup = handleKeyDown;

    // Add event listener for ESC key
    document.addEventListener('keydown', handleKeyDown);

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(okButton);
    popup.appendChild(input);
    popup.appendChild(buttonContainer);
    
    // Insert popup after canvas in its container
    this.annotationTool.canvas.parentElement?.appendChild(popup);
    
    requestAnimationFrame(() => {
      input.focus();
    });
  }
  onPointerUp(event: PointerEvent) {
    const { x, y } = this.annotationTool.getRelativeCoords(event);
    this.createTextInputPopup(x, y);
  }
}
