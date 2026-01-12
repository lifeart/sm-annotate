import type { AnnotationTool } from "../core";

export type Theme = 'dark' | 'light';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgHover: string;
  bgActive: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderHover: string;
  accent: string;
  accentHover: string;
  shadow: string;
}

const darkTheme: ThemeColors = {
  bgPrimary: 'rgba(28, 28, 32, 0.95)',
  bgSecondary: 'rgba(42, 42, 48, 0.98)',
  bgTertiary: '#35353d',
  bgHover: 'rgba(255, 255, 255, 0.08)',
  bgActive: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#f0f0f2',
  textSecondary: '#a8a8b0',
  textMuted: '#68687a',
  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  accent: '#5b9fff',
  accentHover: '#7db3ff',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

const lightTheme: ThemeColors = {
  bgPrimary: 'rgba(250, 250, 252, 0.95)',
  bgSecondary: 'rgba(255, 255, 255, 0.98)',
  bgTertiary: '#f0f0f5',
  bgHover: 'rgba(0, 0, 0, 0.04)',
  bgActive: 'rgba(0, 0, 0, 0.08)',
  textPrimary: '#1a1a24',
  textSecondary: '#5a5a6e',
  textMuted: '#9090a0',
  border: 'rgba(0, 0, 0, 0.1)',
  borderHover: 'rgba(0, 0, 0, 0.2)',
  accent: '#2563eb',
  accentHover: '#3b82f6',
  shadow: 'rgba(0, 0, 0, 0.15)',
};

export const themes: Record<Theme, ThemeColors> = {
  dark: darkTheme,
  light: lightTheme,
};

const PREFIX = 'sm-annotate';

function generateThemeCSS(theme: ThemeColors): string {
  return `
    --${PREFIX}-bg-primary: ${theme.bgPrimary};
    --${PREFIX}-bg-secondary: ${theme.bgSecondary};
    --${PREFIX}-bg-tertiary: ${theme.bgTertiary};
    --${PREFIX}-bg-hover: ${theme.bgHover};
    --${PREFIX}-bg-active: ${theme.bgActive};
    --${PREFIX}-text-primary: ${theme.textPrimary};
    --${PREFIX}-text-secondary: ${theme.textSecondary};
    --${PREFIX}-text-muted: ${theme.textMuted};
    --${PREFIX}-border: ${theme.border};
    --${PREFIX}-border-hover: ${theme.borderHover};
    --${PREFIX}-accent: ${theme.accent};
    --${PREFIX}-accent-hover: ${theme.accentHover};
    --${PREFIX}-shadow: ${theme.shadow};
  `;
}

function generateStyles(): string {
  return `
    .${PREFIX}-container {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 2px;
      padding: 4px;
      background: var(--${PREFIX}-bg-primary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 8px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${PREFIX}-shadow);
      white-space: nowrap;
      z-index: 10;
      margin-top: 8px;
    }

    .${PREFIX}-player-controls {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-flex;
      align-items: center;
      flex-wrap: nowrap;
      gap: 2px;
      padding: 4px;
      background: var(--${PREFIX}-bg-primary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 8px;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 16px var(--${PREFIX}-shadow);
      white-space: nowrap;
      z-index: 10;
      margin-bottom: 8px;
    }

    /* Fullscreen mode - toolbars inside the fullscreen container */
    :fullscreen .${PREFIX}-container,
    :-webkit-full-screen .${PREFIX}-container {
      position: fixed;
      top: 0;
      margin-top: 8px;
    }

    :fullscreen .${PREFIX}-player-controls,
    :-webkit-full-screen .${PREFIX}-player-controls {
      position: fixed;
      bottom: 0;
      margin-bottom: 8px;
    }

    .${PREFIX}-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${PREFIX}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${PREFIX}-btn:hover {
      background: var(--${PREFIX}-bg-hover);
      color: var(--${PREFIX}-text-primary);
    }

    .${PREFIX}-btn:active {
      background: var(--${PREFIX}-bg-active);
    }

    .${PREFIX}-btn.active {
      background: var(--${PREFIX}-accent);
      color: #ffffff;
    }

    .${PREFIX}-btn.active:hover {
      background: var(--${PREFIX}-accent-hover);
    }

    .${PREFIX}-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .${PREFIX}-btn svg {
      width: 18px;
      height: 18px;
    }

    .${PREFIX}-divider {
      width: 1px;
      height: 20px;
      margin: 0 4px;
      background: var(--${PREFIX}-border);
    }

    .${PREFIX}-color-picker {
      width: 32px;
      height: 32px;
      padding: 4px;
      border: none;
      border-radius: 6px;
      background: transparent;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .${PREFIX}-color-picker:hover {
      background: var(--${PREFIX}-bg-hover);
    }

    .${PREFIX}-color-picker::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .${PREFIX}-color-picker::-webkit-color-swatch {
      border: 2px solid var(--${PREFIX}-border);
      border-radius: 4px;
    }

    .${PREFIX}-color-picker:hover::-webkit-color-swatch {
      border-color: var(--${PREFIX}-border-hover);
    }

    .${PREFIX}-slider {
      width: 48px;
      height: 28px;
      padding: 0 8px;
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 6px;
      background: var(--${PREFIX}-bg-secondary);
      color: var(--${PREFIX}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      transition: border-color 0.15s ease;
    }

    .${PREFIX}-slider:hover {
      border-color: var(--${PREFIX}-border-hover);
    }

    .${PREFIX}-slider:focus {
      outline: none;
      border-color: var(--${PREFIX}-accent);
    }

    .${PREFIX}-group {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .${PREFIX}-fullscreen-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--${PREFIX}-text-secondary);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .${PREFIX}-fullscreen-btn:hover {
      background: var(--${PREFIX}-bg-hover);
      color: var(--${PREFIX}-text-primary);
    }

    .${PREFIX}-fullscreen-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Tooltip styles using modern CSS */
    [data-tooltip] {
      position: relative;
    }

    [data-tooltip]::before,
    [data-tooltip]::after {
      position: absolute;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.2s ease, visibility 0.2s ease, translate 0.2s ease;
      z-index: 1000;
    }

    /* Tooltip text bubble */
    [data-tooltip]::after {
      content: attr(data-tooltip);
      inset-block-end: calc(100% + 8px);
      inset-inline-start: 50%;
      translate: -50% 4px;
      padding: 6px 10px;
      background: var(--${PREFIX}-bg-secondary);
      color: var(--${PREFIX}-text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.3;
      white-space: nowrap;
      border-radius: 6px;
      border: 1px solid var(--${PREFIX}-border);
      box-shadow: 0 4px 12px var(--${PREFIX}-shadow);
    }

    /* Tooltip arrow */
    [data-tooltip]::before {
      content: '';
      inset-block-end: calc(100% + 2px);
      inset-inline-start: 50%;
      translate: -50% 4px;
      border: 6px solid transparent;
      border-block-start-color: var(--${PREFIX}-bg-secondary);
    }

    /* Show tooltip on hover/focus */
    [data-tooltip]:hover::before,
    [data-tooltip]:hover::after,
    [data-tooltip]:focus-visible::before,
    [data-tooltip]:focus-visible::after {
      opacity: 1;
      visibility: visible;
      translate: -50% 0;
    }

    /* Bottom tooltip variant */
    [data-tooltip-position="bottom"]::after {
      inset-block-end: auto;
      inset-block-start: calc(100% + 8px);
      translate: -50% -4px;
    }

    [data-tooltip-position="bottom"]::before {
      inset-block-end: auto;
      inset-block-start: calc(100% + 2px);
      translate: -50% -4px;
      border-block-start-color: transparent;
      border-block-end-color: var(--${PREFIX}-bg-secondary);
    }

    [data-tooltip-position="bottom"]:hover::before,
    [data-tooltip-position="bottom"]:hover::after,
    [data-tooltip-position="bottom"]:focus-visible::before,
    [data-tooltip-position="bottom"]:focus-visible::after {
      translate: -50% 0;
    }

    /* Hide tooltip on disabled buttons */
    [data-tooltip]:disabled::before,
    [data-tooltip]:disabled::after {
      display: none;
    }
  `;
}

let styleElement: HTMLStyleElement | null = null;

export function injectThemeStyles(theme: Theme = 'dark'): void {
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = `${PREFIX}-theme-styles`;
    document.head.appendChild(styleElement);
  }

  const themeColors = themes[theme];
  styleElement.textContent = `
    :root {
      ${generateThemeCSS(themeColors)}
    }
    ${generateStyles()}
  `;
}

export function applyButtonStyle(button: HTMLButtonElement): void {
  button.classList.add(`${PREFIX}-btn`);
}

export function setButtonActive(button: HTMLButtonElement, active: boolean): void {
  button.classList.toggle('active', active);
}

export function applyContainerStyle(container: HTMLElement): void {
  container.classList.add(`${PREFIX}-container`);
}

export function applyPlayerControlsStyle(container: HTMLElement): void {
  container.classList.add(`${PREFIX}-player-controls`);
}

export function applyColorPickerStyle(input: HTMLInputElement): void {
  input.classList.add(`${PREFIX}-color-picker`);
}

export function applySliderStyle(input: HTMLInputElement): void {
  input.classList.add(`${PREFIX}-slider`);
}

export function applyFullscreenButtonStyle(button: HTMLButtonElement): void {
  button.classList.add(`${PREFIX}-fullscreen-btn`);
}

export function applyGroupStyle(element: HTMLElement): void {
  element.classList.add(`${PREFIX}-group`);
}

export function createDivider(): HTMLDivElement {
  const divider = document.createElement('div');
  divider.classList.add(`${PREFIX}-divider`);
  return divider;
}

export function getCSSPrefix(): string {
  return PREFIX;
}

export function createThemeToggleButton(tool: AnnotationTool): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.tooltip = 'Toggle theme';
  applyButtonStyle(button);

  const updateIcon = () => {
    const isDark = tool.theme === 'dark';
    button.innerHTML = isDark
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`;
  };

  updateIcon();

  tool.addEvent(button, 'click', () => {
    tool.setTheme(tool.theme === 'dark' ? 'light' : 'dark');
    updateIcon();
  });

  return button;
}
