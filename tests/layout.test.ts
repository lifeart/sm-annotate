import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LayoutManager, HorizontalLayout, VerticalLayout, MinimalLayout, BottomDockLayout } from '../src/ui/layout';
import type { AnnotationTool } from '../src/core';
import type { LayoutMode } from '../src/config';

describe('LayoutManager', () => {
  let mockTool: Partial<AnnotationTool>;
  let mockCanvas: HTMLCanvasElement;
  let mockParent: HTMLDivElement;
  let mockUiContainer: HTMLDivElement;
  let mockPlayerControls: HTMLDivElement;
  let layoutManager: LayoutManager;

  beforeEach(() => {
    // Create DOM elements
    mockParent = document.createElement('div');
    mockCanvas = document.createElement('canvas');
    mockUiContainer = document.createElement('div');
    mockPlayerControls = document.createElement('div');

    mockParent.appendChild(mockCanvas);

    mockTool = {
      canvas: mockCanvas,
      uiContainer: mockUiContainer,
      playerControlsContainer: mockPlayerControls,
      config: {
        layout: 'horizontal',
        theme: 'dark',
        mobile: {
          collapsibleToolbars: true,
          gesturesEnabled: true,
          autoCollapse: true,
          breakpoint: 960,
        },
        toolbar: {
          draggable: false,
          sidebarPosition: 'left',
        },
        features: {
          showThemeToggle: true,
          showFullscreen: true,
          showProgressBar: true,
          showFrameCounter: true,
        },
      },
    };

    layoutManager = new LayoutManager(mockTool as AnnotationTool);
  });

  afterEach(() => {
    layoutManager.destroy();
  });

  describe('setLayout', () => {
    it('should apply horizontal layout class', () => {
      layoutManager.setLayout('horizontal');
      expect(mockParent.classList.contains('sm-annotate-layout-horizontal')).toBe(true);
    });

    it('should apply vertical layout class', () => {
      layoutManager.setLayout('vertical');
      expect(mockParent.classList.contains('sm-annotate-layout-vertical')).toBe(true);
    });

    it('should apply minimal layout class', () => {
      layoutManager.setLayout('minimal');
      expect(mockParent.classList.contains('sm-annotate-layout-minimal')).toBe(true);
    });

    it('should apply bottom-dock layout class', () => {
      layoutManager.setLayout('bottom-dock');
      expect(mockParent.classList.contains('sm-annotate-layout-bottom-dock')).toBe(true);
    });

    it('should remove previous layout class when switching', () => {
      layoutManager.setLayout('horizontal');
      expect(mockParent.classList.contains('sm-annotate-layout-horizontal')).toBe(true);

      layoutManager.setLayout('vertical');
      expect(mockParent.classList.contains('sm-annotate-layout-horizontal')).toBe(false);
      expect(mockParent.classList.contains('sm-annotate-layout-vertical')).toBe(true);
    });

    it('should add sidebar-right class for vertical layout with right position', () => {
      layoutManager.setLayout('vertical', { sidebarPosition: 'right' });
      expect(mockParent.classList.contains('sm-annotate-sidebar-right')).toBe(true);
    });

    it('should not add sidebar-right class for left position', () => {
      layoutManager.setLayout('vertical', { sidebarPosition: 'left' });
      expect(mockParent.classList.contains('sm-annotate-sidebar-right')).toBe(false);
    });

    it('should add root class to parent element', () => {
      layoutManager.setLayout('horizontal');
      expect(mockParent.classList.contains('sm-annotate-root')).toBe(true);
    });
  });

  describe('getCurrentLayout', () => {
    it('should return null before any layout is set', () => {
      expect(layoutManager.getCurrentLayout()).toBe(null);
    });

    it('should return current layout mode', () => {
      layoutManager.setLayout('minimal');
      expect(layoutManager.getCurrentLayout()).toBe('minimal');
    });

    it('should return updated layout after switching', () => {
      layoutManager.setLayout('horizontal');
      expect(layoutManager.getCurrentLayout()).toBe('horizontal');

      layoutManager.setLayout('vertical');
      expect(layoutManager.getCurrentLayout()).toBe('vertical');
    });
  });

  describe('destroy', () => {
    it('should remove all layout classes', () => {
      layoutManager.setLayout('horizontal');
      layoutManager.destroy();

      expect(mockParent.classList.contains('sm-annotate-layout-horizontal')).toBe(false);
      // Note: sm-annotate-root class is kept as it's a persistent marker for the container
    });

    it('should return null for current layout after destroy', () => {
      layoutManager.setLayout('vertical');
      layoutManager.destroy();
      expect(layoutManager.getCurrentLayout()).toBe(null);
    });
  });
});

describe('HorizontalLayout', () => {
  let layout: HorizontalLayout;

  beforeEach(() => {
    layout = new HorizontalLayout();
  });

  it('should have name "horizontal"', () => {
    expect(layout.name).toBe('horizontal');
  });

  it('should not throw on apply', () => {
    expect(() => layout.apply({} as AnnotationTool)).not.toThrow();
  });

  it('should not throw on cleanup', () => {
    expect(() => layout.cleanup()).not.toThrow();
  });
});

describe('VerticalLayout', () => {
  let layout: VerticalLayout;

  beforeEach(() => {
    layout = new VerticalLayout();
  });

  it('should have name "vertical"', () => {
    expect(layout.name).toBe('vertical');
  });

  it('should not throw on apply', () => {
    expect(() => layout.apply({} as AnnotationTool)).not.toThrow();
  });

  it('should not throw on cleanup', () => {
    expect(() => layout.cleanup()).not.toThrow();
  });
});

describe('MinimalLayout', () => {
  let layout: MinimalLayout;
  let mockTool: Partial<AnnotationTool>;
  let mockContainer: HTMLDivElement;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockTool = {
      uiContainer: mockContainer,
      config: {
        layout: 'minimal',
        theme: 'dark',
        mobile: {
          collapsibleToolbars: true,
          gesturesEnabled: true,
          autoCollapse: true,
          breakpoint: 960,
        },
        toolbar: {
          position: { x: 50, y: 100 },
        },
        features: {
          showThemeToggle: true,
          showFullscreen: true,
          showProgressBar: true,
          showFrameCounter: true,
        },
      },
    };

    layout = new MinimalLayout();
  });

  afterEach(() => {
    layout.cleanup();
  });

  it('should have name "minimal"', () => {
    expect(layout.name).toBe('minimal');
  });

  it('should apply initial position from config', () => {
    layout.apply(mockTool as AnnotationTool);
    expect(mockContainer.style.left).toBe('50px');
    expect(mockContainer.style.top).toBe('100px');
  });

  it('should reset container position on cleanup', () => {
    layout.apply(mockTool as AnnotationTool);
    layout.cleanup();
    expect(mockContainer.style.left).toBe('');
    expect(mockContainer.style.top).toBe('');
  });

  it('should handle missing container gracefully', () => {
    const emptyTool = { uiContainer: null } as unknown as AnnotationTool;
    expect(() => layout.apply(emptyTool)).not.toThrow();
  });

  it('should handle missing config position', () => {
    const toolWithoutPosition = {
      uiContainer: mockContainer,
      config: {
        toolbar: {},
      },
    } as unknown as AnnotationTool;

    layout.apply(toolWithoutPosition);
    expect(mockContainer.style.left).toBe('');
    expect(mockContainer.style.top).toBe('');
  });
});

describe('BottomDockLayout', () => {
  let layout: BottomDockLayout;
  let mockTool: Partial<AnnotationTool>;
  let mockContainer: HTMLDivElement;
  let mockPlayerControls: HTMLDivElement;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockPlayerControls = document.createElement('div');

    // Add child elements to player controls
    const child1 = document.createElement('button');
    const child2 = document.createElement('button');
    mockPlayerControls.appendChild(child1);
    mockPlayerControls.appendChild(child2);

    mockTool = {
      uiContainer: mockContainer,
      playerControlsContainer: mockPlayerControls,
    };

    layout = new BottomDockLayout();
  });

  afterEach(() => {
    layout.cleanup();
  });

  it('should have name "bottom-dock"', () => {
    expect(layout.name).toBe('bottom-dock');
  });

  it('should move player control children to main container', () => {
    const initialPlayerChildren = mockPlayerControls.childNodes.length;
    expect(initialPlayerChildren).toBe(2);

    layout.apply(mockTool as AnnotationTool);

    expect(mockPlayerControls.childNodes.length).toBe(0);
    expect(mockContainer.childNodes.length).toBe(2);
  });

  it('should handle missing containers gracefully', () => {
    const emptyTool = {
      uiContainer: null,
      playerControlsContainer: null,
    } as unknown as AnnotationTool;

    expect(() => layout.apply(emptyTool)).not.toThrow();
  });

  it('should not throw on cleanup', () => {
    layout.apply(mockTool as AnnotationTool);
    expect(() => layout.cleanup()).not.toThrow();
  });
});
