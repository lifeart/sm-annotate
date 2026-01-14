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
  let child1: HTMLButtonElement;
  let child2: HTMLButtonElement;

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockPlayerControls = document.createElement('div');

    // Add child elements to player controls
    child1 = document.createElement('button');
    child1.id = 'play-btn';
    child2 = document.createElement('button');
    child2.id = 'pause-btn';
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
    // 3 children: divider + 2 moved elements
    expect(mockContainer.childNodes.length).toBe(3);
  });

  it('should add divider with correct class before player controls', () => {
    layout.apply(mockTool as AnnotationTool);

    const firstChild = mockContainer.firstChild as HTMLElement;
    expect(firstChild.classList.contains('sm-annotate-divider')).toBe(true);
  });

  it('should preserve element references when moving', () => {
    layout.apply(mockTool as AnnotationTool);

    // The original elements should be in the container (not clones)
    expect(mockContainer.querySelector('#play-btn')).toBe(child1);
    expect(mockContainer.querySelector('#pause-btn')).toBe(child2);
  });

  it('should restore player control children on cleanup', () => {
    layout.apply(mockTool as AnnotationTool);
    expect(mockPlayerControls.childNodes.length).toBe(0);

    layout.cleanup();

    // Elements should be moved back to player controls
    expect(mockPlayerControls.childNodes.length).toBe(2);
    // Divider should be removed from container
    expect(mockContainer.childNodes.length).toBe(0);
  });

  it('should restore same element references on cleanup', () => {
    layout.apply(mockTool as AnnotationTool);
    layout.cleanup();

    // The original elements should be back in player controls
    expect(mockPlayerControls.querySelector('#play-btn')).toBe(child1);
    expect(mockPlayerControls.querySelector('#pause-btn')).toBe(child2);
  });

  it('should handle multiple apply/cleanup cycles', () => {
    // First cycle
    layout.apply(mockTool as AnnotationTool);
    expect(mockPlayerControls.childNodes.length).toBe(0);
    expect(mockContainer.childNodes.length).toBe(3);

    layout.cleanup();
    expect(mockPlayerControls.childNodes.length).toBe(2);
    expect(mockContainer.childNodes.length).toBe(0);

    // Second cycle
    layout.apply(mockTool as AnnotationTool);
    expect(mockPlayerControls.childNodes.length).toBe(0);
    expect(mockContainer.childNodes.length).toBe(3);

    layout.cleanup();
    expect(mockPlayerControls.childNodes.length).toBe(2);
    expect(mockContainer.childNodes.length).toBe(0);
  });

  it('should handle cleanup without prior apply', () => {
    // Cleanup without apply should not throw
    expect(() => layout.cleanup()).not.toThrow();
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

describe('Layout switching integration', () => {
  let layoutManager: LayoutManager;
  let mockTool: Partial<AnnotationTool>;
  let mockCanvas: HTMLCanvasElement;
  let mockParent: HTMLDivElement;
  let mockUiContainer: HTMLDivElement;
  let mockPlayerControls: HTMLDivElement;
  let playBtn: HTMLButtonElement;
  let pauseBtn: HTMLButtonElement;

  beforeEach(() => {
    mockParent = document.createElement('div');
    mockCanvas = document.createElement('canvas');
    mockUiContainer = document.createElement('div');
    mockPlayerControls = document.createElement('div');

    // Add buttons to player controls
    playBtn = document.createElement('button');
    playBtn.id = 'play-btn';
    pauseBtn = document.createElement('button');
    pauseBtn.id = 'pause-btn';
    mockPlayerControls.appendChild(playBtn);
    mockPlayerControls.appendChild(pauseBtn);

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

  it('should preserve player controls when switching from bottom-dock to horizontal', () => {
    layoutManager.setLayout('bottom-dock');
    expect(mockPlayerControls.childNodes.length).toBe(0);

    layoutManager.setLayout('horizontal');
    expect(mockPlayerControls.childNodes.length).toBe(2);
    expect(mockPlayerControls.querySelector('#play-btn')).toBe(playBtn);
    expect(mockPlayerControls.querySelector('#pause-btn')).toBe(pauseBtn);
  });

  it('should preserve player controls when switching from bottom-dock to vertical', () => {
    layoutManager.setLayout('bottom-dock');
    layoutManager.setLayout('vertical');

    expect(mockPlayerControls.childNodes.length).toBe(2);
  });

  it('should preserve player controls when switching from bottom-dock to minimal', () => {
    layoutManager.setLayout('bottom-dock');
    layoutManager.setLayout('minimal');

    expect(mockPlayerControls.childNodes.length).toBe(2);
  });

  it('should handle rapid layout switching', () => {
    const layouts: LayoutMode[] = ['horizontal', 'vertical', 'minimal', 'bottom-dock'];

    for (let i = 0; i < 10; i++) {
      const layout = layouts[i % layouts.length];
      layoutManager.setLayout(layout);
      expect(layoutManager.getCurrentLayout()).toBe(layout);
    }

    // After all switching, elements should still be intact
    layoutManager.setLayout('horizontal');
    expect(mockPlayerControls.childNodes.length).toBe(2);
  });

  it('should handle switching to same layout multiple times', () => {
    layoutManager.setLayout('bottom-dock');
    layoutManager.setLayout('bottom-dock');
    layoutManager.setLayout('bottom-dock');

    // Should still work correctly
    layoutManager.setLayout('horizontal');
    expect(mockPlayerControls.childNodes.length).toBe(2);
  });
});
