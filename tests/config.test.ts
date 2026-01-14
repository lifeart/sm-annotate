import { describe, it, expect } from 'vitest';
import { mergeConfig, defaultConfig, type SmAnnotateConfig } from '../src/config';

describe('config', () => {
  describe('defaultConfig', () => {
    it('should have horizontal layout by default', () => {
      expect(defaultConfig.layout).toBe('horizontal');
    });

    it('should have dark theme by default', () => {
      expect(defaultConfig.theme).toBe('dark');
    });

    it('should have mobile settings enabled by default', () => {
      expect(defaultConfig.mobile.collapsibleToolbars).toBe(true);
      expect(defaultConfig.mobile.gesturesEnabled).toBe(true);
      expect(defaultConfig.mobile.autoCollapse).toBe(true);
      expect(defaultConfig.mobile.breakpoint).toBe(960);
    });

    it('should have toolbar settings by default', () => {
      expect(defaultConfig.toolbar.draggable).toBe(false);
      expect(defaultConfig.toolbar.sidebarPosition).toBe('left');
      expect(defaultConfig.toolbar.defaultTool).toBe('curve');
    });

    it('should have all features enabled by default', () => {
      expect(defaultConfig.features.showThemeToggle).toBe(true);
      expect(defaultConfig.features.showFullscreen).toBe(true);
      expect(defaultConfig.features.showProgressBar).toBe(true);
      expect(defaultConfig.features.showFrameCounter).toBe(true);
    });
  });

  describe('mergeConfig', () => {
    it('should return default config when no partial is provided', () => {
      const result = mergeConfig();
      expect(result).toEqual(defaultConfig);
    });

    it('should return default config when undefined is provided', () => {
      const result = mergeConfig(undefined);
      expect(result).toEqual(defaultConfig);
    });

    it('should override layout when provided', () => {
      const result = mergeConfig({ layout: 'vertical' });
      expect(result.layout).toBe('vertical');
    });

    it('should override theme when provided', () => {
      const result = mergeConfig({ theme: 'light' });
      expect(result.theme).toBe('light');
    });

    it('should merge mobile settings partially', () => {
      const result = mergeConfig({
        mobile: { gesturesEnabled: false },
      } as Partial<SmAnnotateConfig>);

      expect(result.mobile.gesturesEnabled).toBe(false);
      expect(result.mobile.collapsibleToolbars).toBe(true); // default preserved
      expect(result.mobile.autoCollapse).toBe(true); // default preserved
      expect(result.mobile.breakpoint).toBe(960); // default preserved
    });

    it('should merge toolbar settings partially', () => {
      const result = mergeConfig({
        toolbar: { draggable: true },
      } as Partial<SmAnnotateConfig>);

      expect(result.toolbar.draggable).toBe(true);
      expect(result.toolbar.sidebarPosition).toBe('left'); // default preserved
      expect(result.toolbar.defaultTool).toBe('curve'); // default preserved
    });

    it('should allow overriding defaultTool to null', () => {
      const result = mergeConfig({
        toolbar: { defaultTool: null },
      } as Partial<SmAnnotateConfig>);

      expect(result.toolbar.defaultTool).toBe(null);
      expect(result.toolbar.draggable).toBe(false); // default preserved
    });

    it('should allow overriding defaultTool to different tool', () => {
      const result = mergeConfig({
        toolbar: { defaultTool: 'rectangle' },
      } as Partial<SmAnnotateConfig>);

      expect(result.toolbar.defaultTool).toBe('rectangle');
    });

    it('should merge features settings partially', () => {
      const result = mergeConfig({
        features: { showThemeToggle: false },
      } as Partial<SmAnnotateConfig>);

      expect(result.features.showThemeToggle).toBe(false);
      expect(result.features.showFullscreen).toBe(true); // default preserved
      expect(result.features.showProgressBar).toBe(true); // default preserved
    });

    it('should handle complete config override', () => {
      const customConfig: SmAnnotateConfig = {
        layout: 'minimal',
        theme: 'light',
        mobile: {
          collapsibleToolbars: false,
          gesturesEnabled: false,
          autoCollapse: false,
          breakpoint: 768,
        },
        toolbar: {
          draggable: true,
          sidebarPosition: 'right',
          position: { x: 100, y: 50 },
          defaultTool: 'curve',
        },
        features: {
          showThemeToggle: false,
          showFullscreen: false,
          showProgressBar: false,
          showFrameCounter: false,
        },
      };

      const result = mergeConfig(customConfig);
      expect(result).toEqual(customConfig);
    });

    it('should support all layout modes', () => {
      const layouts = ['horizontal', 'vertical', 'minimal', 'bottom-dock'] as const;

      layouts.forEach((layout) => {
        const result = mergeConfig({ layout });
        expect(result.layout).toBe(layout);
      });
    });

    it('should preserve toolbar position when provided', () => {
      const result = mergeConfig({
        toolbar: { position: { x: 200, y: 100 } },
      } as Partial<SmAnnotateConfig>);

      expect(result.toolbar.position).toEqual({ x: 200, y: 100 });
    });

    it('should not mutate the default config', () => {
      const originalLayout = defaultConfig.layout;
      mergeConfig({ layout: 'minimal' });
      expect(defaultConfig.layout).toBe(originalLayout);
    });
  });
});
