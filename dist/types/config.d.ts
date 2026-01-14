/**
 * @module config
 * @description Configuration types and defaults for SmAnnotate embedding.
 *
 * SmAnnotate supports multiple layout modes, mobile optimizations, and
 * customizable features. Pass a partial config to the constructor to
 * customize behavior:
 *
 * @example
 * ```typescript
 * import { SmAnnotate, SmAnnotateConfig } from '@lifeart/sm-annotate';
 *
 * const config: Partial<SmAnnotateConfig> = {
 *   layout: 'vertical',
 *   mobile: { gesturesEnabled: true },
 * };
 *
 * const tool = new SmAnnotate(videoElement, config);
 * ```
 */
import type { Theme } from "./ui/theme";
import type { Tool } from "./plugins";
/**
 * Layout modes for the annotation toolbar.
 *
 * - `horizontal`: Default layout with toolbar at top, player controls at bottom
 * - `vertical`: Tools in a vertical sidebar (configurable left/right)
 * - `minimal`: Compact floating toolbar that can be repositioned
 * - `bottom-dock`: All controls merged into a single bottom bar
 */
export type LayoutMode = 'horizontal' | 'vertical' | 'minimal' | 'bottom-dock';
/**
 * Position for toolbar placement
 */
export interface ToolbarPosition {
    x: number;
    y: number;
}
/**
 * Mobile-specific configuration options
 */
export interface MobileConfig {
    /** Enable collapsible toolbars on mobile */
    collapsibleToolbars: boolean;
    /** Enable pinch-to-zoom and pan gestures */
    gesturesEnabled: boolean;
    /** Auto-collapse toolbar when drawing starts */
    autoCollapse: boolean;
    /** Viewport width breakpoint for mobile mode (default: 960) */
    breakpoint: number;
}
/**
 * Toolbar configuration options
 */
export interface ToolbarConfig {
    /** Initial position for minimal/floating layout */
    position?: ToolbarPosition;
    /** Allow dragging the toolbar (minimal layout) */
    draggable?: boolean;
    /** Sidebar position for vertical layout */
    sidebarPosition?: 'left' | 'right';
    /** Default selected tool on init (null = no tool selected) */
    defaultTool?: Tool | null;
}
/**
 * Feature visibility flags
 */
export interface FeatureFlags {
    /** Show theme toggle button */
    showThemeToggle: boolean;
    /** Show fullscreen button */
    showFullscreen: boolean;
    /** Show progress bar overlay */
    showProgressBar: boolean;
    /** Show frame counter overlay */
    showFrameCounter: boolean;
}
/**
 * Main configuration interface for SmAnnotate
 */
export interface SmAnnotateConfig {
    /** Layout mode for toolbars */
    layout: LayoutMode;
    /** Mobile-specific settings */
    mobile: MobileConfig;
    /** Initial theme */
    theme: Theme;
    /** Toolbar positioning options */
    toolbar: ToolbarConfig;
    /** Feature visibility flags */
    features: FeatureFlags;
}
/**
 * Default configuration values
 */
export declare const defaultConfig: SmAnnotateConfig;
/**
 * Merge partial config with defaults
 */
export declare function mergeConfig(partial?: Partial<SmAnnotateConfig>): SmAnnotateConfig;
