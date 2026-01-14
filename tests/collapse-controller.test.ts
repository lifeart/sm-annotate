import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CollapseController } from '../src/ui/collapse-controller';

describe('CollapseController', () => {
  let controller: CollapseController;
  let container: HTMLDivElement;
  let parentElement: HTMLDivElement;

  beforeEach(() => {
    // Create DOM structure
    parentElement = document.createElement('div');
    container = document.createElement('div');
    parentElement.appendChild(container);
    document.body.appendChild(parentElement);
  });

  afterEach(() => {
    controller?.destroy();
    parentElement.remove();
  });

  describe('init', () => {
    it('should add collapsible class to container', () => {
      controller = new CollapseController(container);
      controller.init();

      expect(container.classList.contains('sm-annotate-collapsible')).toBe(true);
    });

    it('should create collapse button', () => {
      controller = new CollapseController(container);
      controller.init();

      const button = parentElement.querySelector('.sm-annotate-collapse-btn');
      expect(button).not.toBeNull();
    });

    it('should insert button after container', () => {
      controller = new CollapseController(container);
      controller.init();

      const button = parentElement.querySelector('.sm-annotate-collapse-btn');
      expect(container.nextSibling).toBe(button);
    });

    it('should set aria-label on button', () => {
      controller = new CollapseController(container);
      controller.init();

      const button = parentElement.querySelector('.sm-annotate-collapse-btn');
      expect(button?.getAttribute('aria-label')).toBe('Toggle toolbar');
    });

    it('should set data-tooltip on button', () => {
      controller = new CollapseController(container);
      controller.init();

      const button = parentElement.querySelector('.sm-annotate-collapse-btn');
      expect(button?.getAttribute('data-tooltip')).toBe('Toggle toolbar');
    });

    it('should contain SVG icon in button', () => {
      controller = new CollapseController(container);
      controller.init();

      const button = parentElement.querySelector('.sm-annotate-collapse-btn');
      const svg = button?.querySelector('svg');
      expect(svg).not.toBeNull();
    });
  });

  describe('collapse', () => {
    beforeEach(() => {
      controller = new CollapseController(container);
      controller.init();
    });

    it('should add collapsed class to container', () => {
      controller.collapse();
      expect(container.classList.contains('sm-annotate-collapsed')).toBe(true);
    });

    it('should set collapsed state to true', () => {
      controller.collapse();
      expect(controller.collapsed).toBe(true);
    });

    it('should not add class twice if already collapsed', () => {
      controller.collapse();
      controller.collapse();
      expect(container.classList.contains('sm-annotate-collapsed')).toBe(true);
    });
  });

  describe('expand', () => {
    beforeEach(() => {
      controller = new CollapseController(container);
      controller.init();
    });

    it('should remove collapsed class from container', () => {
      controller.collapse();
      controller.expand();
      expect(container.classList.contains('sm-annotate-collapsed')).toBe(false);
    });

    it('should set collapsed state to false', () => {
      controller.collapse();
      controller.expand();
      expect(controller.collapsed).toBe(false);
    });

    it('should do nothing if already expanded', () => {
      controller.expand();
      expect(container.classList.contains('sm-annotate-collapsed')).toBe(false);
      expect(controller.collapsed).toBe(false);
    });
  });

  describe('toggle', () => {
    beforeEach(() => {
      controller = new CollapseController(container);
      controller.init();
    });

    it('should collapse when expanded', () => {
      controller.toggle();
      expect(controller.collapsed).toBe(true);
    });

    it('should expand when collapsed', () => {
      controller.collapse();
      controller.toggle();
      expect(controller.collapsed).toBe(false);
    });

    it('should toggle multiple times correctly', () => {
      controller.toggle(); // collapse
      expect(controller.collapsed).toBe(true);

      controller.toggle(); // expand
      expect(controller.collapsed).toBe(false);

      controller.toggle(); // collapse
      expect(controller.collapsed).toBe(true);
    });
  });

  describe('button click', () => {
    beforeEach(() => {
      controller = new CollapseController(container);
      controller.init();
    });

    it('should toggle on button click', () => {
      const button = parentElement.querySelector('.sm-annotate-collapse-btn') as HTMLButtonElement;
      button.click();
      expect(controller.collapsed).toBe(true);

      button.click();
      expect(controller.collapsed).toBe(false);
    });

    it('should stop event propagation', () => {
      const button = parentElement.querySelector('.sm-annotate-collapse-btn') as HTMLButtonElement;
      const clickHandler = vi.fn();
      parentElement.addEventListener('click', clickHandler);

      button.click();

      expect(clickHandler).not.toHaveBeenCalled();
    });
  });

  describe('collapsed getter', () => {
    it('should return false initially', () => {
      controller = new CollapseController(container);
      controller.init();
      expect(controller.collapsed).toBe(false);
    });

    it('should return true after collapse', () => {
      controller = new CollapseController(container);
      controller.init();
      controller.collapse();
      expect(controller.collapsed).toBe(true);
    });
  });

  describe('autoCollapseEnabled', () => {
    it('should return true by default', () => {
      controller = new CollapseController(container);
      expect(controller.autoCollapseEnabled).toBe(true);
    });

    it('should return false when initialized with false', () => {
      controller = new CollapseController(container, false);
      expect(controller.autoCollapseEnabled).toBe(false);
    });
  });

  describe('setAutoCollapse', () => {
    it('should update autoCollapse setting', () => {
      controller = new CollapseController(container);
      expect(controller.autoCollapseEnabled).toBe(true);

      controller.setAutoCollapse(false);
      expect(controller.autoCollapseEnabled).toBe(false);

      controller.setAutoCollapse(true);
      expect(controller.autoCollapseEnabled).toBe(true);
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      controller = new CollapseController(container);
      controller.init();
    });

    it('should remove collapse button', () => {
      controller.destroy();
      const button = parentElement.querySelector('.sm-annotate-collapse-btn');
      expect(button).toBeNull();
    });

    it('should remove collapsible class', () => {
      controller.destroy();
      expect(container.classList.contains('sm-annotate-collapsible')).toBe(false);
    });

    it('should remove collapsed class', () => {
      controller.collapse();
      controller.destroy();
      expect(container.classList.contains('sm-annotate-collapsed')).toBe(false);
    });

    it('should handle multiple destroy calls safely', () => {
      controller.destroy();
      expect(() => controller.destroy()).not.toThrow();
    });
  });
});
