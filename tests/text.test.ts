import { describe, it, expect, beforeEach } from 'vitest';
import { IText, TextToolPlugin } from '../src/plugins/text';
import {
  createMockContext,
  createMockAnnotationTool,
  createMockPointerEvent,
  asAnnotationTool,
  MockCanvasContext,
  MockAnnotationTool,
} from './helpers/mock-context';

describe('TextToolPlugin', () => {
  describe('normalize', () => {
    it('should normalize text coordinates relative to canvas size', () => {
      const plugin = Object.create(TextToolPlugin.prototype);

      const shape: IText = {
        type: 'text',
        x: 200,
        y: 100,
        text: 'Hello World',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 2,
      };

      const normalized = plugin.normalize(shape, 400, 200);

      expect(normalized.x).toBe(0.5); // 200 / 400
      expect(normalized.y).toBe(0.5); // 100 / 200
      expect(normalized.text).toBe('Hello World');
    });
  });

  describe('move', () => {
    it('should move text by delta values', () => {
      const plugin = Object.create(TextToolPlugin.prototype);

      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Test',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const moved = plugin.move(shape, 30, -20);

      expect(moved.x).toBe(130);
      expect(moved.y).toBe(80);
      expect(moved.text).toBe('Test');
    });
  });

  describe('isPointerAtShape', () => {
    let plugin: TextToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockCtx.measureText = () => ({ width: 100 } as TextMetrics);
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new TextToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    it('should return true when pointer is on single line text', () => {
      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Hello',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Inside the text bounding box
      expect(plugin.isPointerAtShape(shape, 150, 95)).toBe(true);
    });

    it('should return false when pointer is outside text bounds', () => {
      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Hello',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      expect(plugin.isPointerAtShape(shape, 50, 95)).toBe(false); // left of text
      expect(plugin.isPointerAtShape(shape, 250, 95)).toBe(false); // right of text
    });

    it('should handle multiline text', () => {
      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Line 1\nLine 2',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      // Should be within bounds of multiline text
      expect(plugin.isPointerAtShape(shape, 150, 100)).toBe(true);
    });

    it('should use shape lineWidth for fontSize calculation', () => {
      const thinText: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Hello',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      const thickText: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: 'Hello',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 20,
      };

      // fontSize for thin = 16 + 1 * 0.5 = 16.5, bounds: y >= 100-16.5 = 83.5
      // fontSize for thick = 16 + 20 * 0.5 = 26, bounds: y >= 100-26 = 74
      // thick text will have larger bounds (extends further up)
      expect(plugin.isPointerAtShape(thinText, 150, 80)).toBe(false);
      expect(plugin.isPointerAtShape(thickText, 150, 80)).toBe(true);
    });

    it('should return false for empty text', () => {
      const shape: IText = {
        type: 'text',
        x: 100,
        y: 100,
        text: '',
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      };

      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(false);
    });

    it('should return false for undefined text', () => {
      const shape = {
        type: 'text',
        x: 100,
        y: 100,
        text: undefined,
        strokeStyle: '#000',
        fillStyle: '#fff',
        lineWidth: 1,
      } as unknown as IText;

      expect(plugin.isPointerAtShape(shape, 100, 100)).toBe(false);
    });
  });

  describe('drawing methods', () => {
    let plugin: TextToolPlugin;
    let mockCtx: MockCanvasContext;
    let mockAnnotationTool: MockAnnotationTool;

    beforeEach(() => {
      mockCtx = createMockContext();
      mockAnnotationTool = createMockAnnotationTool(mockCtx);
      plugin = new TextToolPlugin(asAnnotationTool(mockAnnotationTool));
    });

    describe('draw', () => {
      it('should draw single line text', () => {
        const shape: IText = {
          type: 'text',
          x: 100,
          y: 100,
          text: 'Hello',
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.fillText).toHaveBeenCalledWith('Hello', 100, 100);
      });

      it('should draw multiline text with correct spacing', () => {
        const shape: IText = {
          type: 'text',
          x: 100,
          y: 100,
          text: 'Line 1\nLine 2\nLine 3',
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        // fontSize = 16 + 2 * 0.5 = 17
        // lineHeight = 17 * 1.25 = 21.25
        expect(mockCtx.fillText).toHaveBeenCalledTimes(3);
        expect(mockCtx.fillText).toHaveBeenNthCalledWith(1, 'Line 1', 100, 100);
        expect(mockCtx.fillText).toHaveBeenNthCalledWith(2, 'Line 2', 100, 121.25);
        expect(mockCtx.fillText).toHaveBeenNthCalledWith(3, 'Line 3', 100, 142.5);
      });

      it('should not draw empty text', () => {
        const shape: IText = {
          type: 'text',
          x: 100,
          y: 100,
          text: '',
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        };

        plugin.draw(shape);

        expect(mockCtx.fillText).not.toHaveBeenCalled();
      });

      it('should not draw undefined text', () => {
        const shape = {
          type: 'text',
          x: 100,
          y: 100,
          text: undefined,
          strokeStyle: '#000',
          fillStyle: '#fff',
          lineWidth: 2,
        } as unknown as IText;

        plugin.draw(shape);

        expect(mockCtx.fillText).not.toHaveBeenCalled();
      });
    });

    describe('drawText', () => {
      it('should set font and draw text', () => {
        plugin.drawText(50, 75, 'Test');

        expect(mockCtx.fillText).toHaveBeenCalledWith('Test', 50, 75);
      });
    });

    describe('onPointerDown', () => {
      it('should set start coordinates', () => {
        const event = createMockPointerEvent(50, 75);

        plugin.onPointerDown(event);

        expect(plugin.startX).toBe(50);
        expect(plugin.startY).toBe(75);
      });
    });

    describe('onPointerMove', () => {
      it('should draw a small dot at cursor position', () => {
        const event = createMockPointerEvent(100, 150);

        plugin.onPointerMove(event);

        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalledWith(100, 150, 5, 0, 2 * Math.PI);
        expect(mockCtx.fill).toHaveBeenCalled();
      });
    });

    describe('onActivate', () => {
      it('should set cursor to text and enable drawing', () => {
        mockAnnotationTool.canvas = { style: { cursor: 'default' }, parentElement: null };

        plugin.onActivate();

        expect(mockAnnotationTool.canvas.style.cursor).toBe('text');
        expect(plugin.isDrawing).toBe(true);
      });
    });

    describe('onDeactivate', () => {
      it('should reset cursor and disable drawing', () => {
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: null
        };
        plugin.isDrawing = true;

        plugin.onDeactivate();

        expect(mockAnnotationTool.canvas.style.cursor).toBe('default');
        expect(plugin.isDrawing).toBe(false);
      });

      it('should destroy active popup on deactivate', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        // Create popup first
        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);
        expect(mockParent.children.length).toBe(1);

        // Deactivate should destroy it
        plugin.onDeactivate();

        expect(mockParent.children.length).toBe(0);
      });
    });

    describe('onPointerUp', () => {
      it('should create text input popup at coordinates', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        const event = createMockPointerEvent(100, 150);

        plugin.onPointerUp(event);

        // Should have appended a popup to the parent
        expect(mockParent.children.length).toBe(1);
        const popup = mockParent.children[0] as HTMLDivElement;
        expect(popup.tagName).toBe('DIV');
      });

      it('should save text shape when OK is clicked with text', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };
        mockAnnotationTool.currentTool = 'text';
        mockCtx.strokeStyle = '#ff0000';
        mockCtx.fillStyle = '#00ff00';
        mockCtx.lineWidth = 3;

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        const popup = mockParent.children[0] as HTMLDivElement;
        const input = popup.querySelector('input') as HTMLInputElement;
        const okButton = popup.querySelectorAll('button')[1] as HTMLButtonElement;

        input.value = 'Test text';
        okButton.click();

        expect(mockAnnotationTool.addShape).toHaveBeenCalledWith(expect.objectContaining({
          type: 'text',
          x: 100,
          y: 150,
          text: 'Test text'
        }));
        expect(mockAnnotationTool.currentTool).toBeNull();
      });

      it('should close popup when Cancel is clicked', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        const popup = mockParent.children[0] as HTMLDivElement;
        const cancelButton = popup.querySelectorAll('button')[0] as HTMLButtonElement;

        cancelButton.click();

        expect(mockParent.children.length).toBe(0);
      });

      it('should handle Enter key to save', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };
        mockAnnotationTool.currentTool = 'text';

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        const popup = mockParent.children[0] as HTMLDivElement;
        const input = popup.querySelector('input') as HTMLInputElement;

        input.value = 'Enter test';
        const enterEvent = new KeyboardEvent('keyup', { key: 'Enter' });
        input.dispatchEvent(enterEvent);

        expect(mockAnnotationTool.addShape).toHaveBeenCalled();
      });

      it('should handle Escape key to close', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        expect(mockParent.children.length).toBe(1);

        const input = mockParent.querySelector('input') as HTMLInputElement;
        const escEvent = new KeyboardEvent('keyup', { key: 'Escape' });
        input.dispatchEvent(escEvent);

        expect(mockParent.children.length).toBe(0);
      });

      it('should not save when input is empty', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        const popup = mockParent.children[0] as HTMLDivElement;
        const input = popup.querySelector('input') as HTMLInputElement;
        const okButton = popup.querySelectorAll('button')[1] as HTMLButtonElement;

        input.value = '';
        okButton.click();

        expect(mockAnnotationTool.addShape).not.toHaveBeenCalled();
      });

      it('should handle button hover events', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        const popup = mockParent.children[0] as HTMLDivElement;
        const cancelButton = popup.querySelectorAll('button')[0] as HTMLButtonElement;
        const okButton = popup.querySelectorAll('button')[1] as HTMLButtonElement;

        // Test hover events - should not throw
        cancelButton.dispatchEvent(new MouseEvent('mouseover'));
        cancelButton.dispatchEvent(new MouseEvent('mouseout'));
        okButton.dispatchEvent(new MouseEvent('mouseover'));
        okButton.dispatchEvent(new MouseEvent('mouseout'));

        expect(cancelButton.style.opacity).toBe('1');
        expect(okButton.style.opacity).toBe('1');
      });

      it('should handle input focus events', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        const event = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event);

        const input = mockParent.querySelector('input') as HTMLInputElement;

        // Test focus/blur events - colors may be normalized to rgb
        input.dispatchEvent(new FocusEvent('focus'));
        expect(input.style.borderColor).toMatch(/(#007bff|rgb\(0, 123, 255\))/);

        input.dispatchEvent(new FocusEvent('blur'));
        expect(input.style.borderColor).toMatch(/(#ddd|rgb\(221, 221, 221\))/);
      });

      it('should destroy existing popup before creating new one', () => {
        const mockParent = document.createElement('div');
        mockAnnotationTool.canvas = {
          style: { cursor: 'text' },
          parentElement: mockParent
        };

        // Create first popup
        const event1 = createMockPointerEvent(100, 150);
        plugin.onPointerUp(event1);

        expect(mockParent.children.length).toBe(1);

        // Create second popup
        const event2 = createMockPointerEvent(200, 250);
        plugin.onPointerUp(event2);

        // Should still only have one popup (first was destroyed)
        expect(mockParent.children.length).toBe(1);
      });
    });
  });
});
