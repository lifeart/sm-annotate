import type { AnnotationTool } from "../core";

export type Theme = 'dark' | 'light';

export interface ThemeColors {
  // Background colors
  bgPrimary: string;
  bgSecondary: string;
  bgHover: string;
  bgActive: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;

  // Border colors
  border: string;
  borderHover: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Button colors
  buttonBg: string;
  buttonHover: string;
  buttonActive: string;
}

const darkTheme: ThemeColors = {
  bgPrimary: '#1a1a1a',
  bgSecondary: '#2d2d2d',
  bgHover: '#3d3d3d',
  bgActive: '#4d4d4d',
  textPrimary: '#e0e0e0',
  textSecondary: '#a0a0a0',
  border: '#404040',
  borderHover: '#505050',
  accent: '#4a9eff',
  accentHover: '#6bb3ff',
  buttonBg: '#333333',
  buttonHover: '#444444',
  buttonActive: '#4a9eff',
};

const lightTheme: ThemeColors = {
  bgPrimary: '#f5f5f5',
  bgSecondary: '#ffffff',
  bgHover: '#e8e8e8',
  bgActive: '#d0d0d0',
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  border: '#d0d0d0',
  borderHover: '#b0b0b0',
  accent: '#0066cc',
  accentHover: '#0077ee',
  buttonBg: '#e0e0e0',
  buttonHover: '#d0d0d0',
  buttonActive: '#0066cc',
};

export const themes: Record<Theme, ThemeColors> = {
  dark: darkTheme,
  light: lightTheme,
};

// CSS class name prefix
const PREFIX = 'sm-annotate';

// Generate CSS for a theme
function generateThemeCSS(theme: ThemeColors): string {
  return `
    --${PREFIX}-bg-primary: ${theme.bgPrimary};
    --${PREFIX}-bg-secondary: ${theme.bgSecondary};
    --${PREFIX}-bg-hover: ${theme.bgHover};
    --${PREFIX}-bg-active: ${theme.bgActive};
    --${PREFIX}-text-primary: ${theme.textPrimary};
    --${PREFIX}-text-secondary: ${theme.textSecondary};
    --${PREFIX}-border: ${theme.border};
    --${PREFIX}-border-hover: ${theme.borderHover};
    --${PREFIX}-accent: ${theme.accent};
    --${PREFIX}-accent-hover: ${theme.accentHover};
    --${PREFIX}-button-bg: ${theme.buttonBg};
    --${PREFIX}-button-hover: ${theme.buttonHover};
    --${PREFIX}-button-active: ${theme.buttonActive};
  `;
}

// Generate button styles
function generateButtonStyles(): string {
  return `
    .${PREFIX}-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin: 2px;
      padding: 4px;
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 4px;
      background: var(--${PREFIX}-button-bg);
      color: var(--${PREFIX}-text-primary);
      cursor: pointer;
      transition: all 0.15s ease;
      outline: none;
    }

    .${PREFIX}-btn:hover {
      background: var(--${PREFIX}-button-hover);
      border-color: var(--${PREFIX}-border-hover);
    }

    .${PREFIX}-btn:active {
      background: var(--${PREFIX}-bg-active);
    }

    .${PREFIX}-btn.active {
      background: var(--${PREFIX}-button-active);
      border-color: var(--${PREFIX}-accent);
      color: #ffffff;
    }

    .${PREFIX}-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .${PREFIX}-btn svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
    }

    .${PREFIX}-container {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
      padding: 4px 6px;
      background: var(--${PREFIX}-bg-primary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .${PREFIX}-player-controls {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 4px 6px;
      background: var(--${PREFIX}-bg-primary);
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .${PREFIX}-divider {
      width: 1px;
      height: 24px;
      margin: 0 4px;
      background: var(--${PREFIX}-border);
    }

    .${PREFIX}-input {
      height: 28px;
      padding: 4px 8px;
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 4px;
      background: var(--${PREFIX}-bg-secondary);
      color: var(--${PREFIX}-text-primary);
      font-size: 12px;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .${PREFIX}-input:hover {
      border-color: var(--${PREFIX}-border-hover);
    }

    .${PREFIX}-input:focus {
      border-color: var(--${PREFIX}-accent);
    }

    .${PREFIX}-color-picker {
      width: 32px;
      height: 28px;
      padding: 2px;
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 4px;
      background: var(--${PREFIX}-bg-secondary);
      cursor: pointer;
    }

    .${PREFIX}-color-picker::-webkit-color-swatch-wrapper {
      padding: 2px;
    }

    .${PREFIX}-color-picker::-webkit-color-swatch {
      border: none;
      border-radius: 2px;
    }

    .${PREFIX}-slider {
      width: 50px;
      height: 28px;
      padding: 4px 8px;
      border: 1px solid var(--${PREFIX}-border);
      border-radius: 4px;
      background: var(--${PREFIX}-bg-secondary);
      color: var(--${PREFIX}-text-primary);
      font-size: 12px;
      text-align: center;
    }

    .${PREFIX}-label {
      font-size: 11px;
      color: var(--${PREFIX}-text-secondary);
      margin-right: 4px;
    }
  `;
}

// Inject theme styles into document
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
    ${generateButtonStyles()}
  `;
}

// Apply theme class to button
export function applyButtonStyle(button: HTMLButtonElement): void {
  button.classList.add(`${PREFIX}-btn`);
  // Remove inline styles that conflict with CSS
  button.style.margin = '';
}

// Apply active state to button
export function setButtonActive(button: HTMLButtonElement, active: boolean): void {
  if (active) {
    button.classList.add('active');
  } else {
    button.classList.remove('active');
  }
}

// Apply container style
export function applyContainerStyle(container: HTMLElement): void {
  container.classList.add(`${PREFIX}-container`);
}

// Apply player controls style
export function applyPlayerControlsStyle(container: HTMLElement): void {
  container.classList.add(`${PREFIX}-player-controls`);
}

// Apply input style
export function applyInputStyle(input: HTMLInputElement): void {
  input.classList.add(`${PREFIX}-input`);
  input.style.margin = '';
}

// Apply color picker style
export function applyColorPickerStyle(input: HTMLInputElement): void {
  input.classList.add(`${PREFIX}-color-picker`);
  input.style.margin = '';
}

// Apply slider style
export function applySliderStyle(input: HTMLInputElement): void {
  input.classList.add(`${PREFIX}-slider`);
  input.style.margin = '';
}

// Create divider element
export function createDivider(): HTMLDivElement {
  const divider = document.createElement('div');
  divider.classList.add(`${PREFIX}-divider`);
  return divider;
}

// Get CSS prefix for external use
export function getCSSPrefix(): string {
  return PREFIX;
}

// Theme toggle button
export function createThemeToggleButton(tool: AnnotationTool): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.title = 'Toggle theme';
  applyButtonStyle(button);

  const updateIcon = () => {
    const isDark = tool.theme === 'dark';
    button.innerHTML = isDark
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
