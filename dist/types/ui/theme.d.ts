import type { AnnotationTool } from "../core";
export type Theme = 'dark' | 'light';
export interface ThemeColors {
    bgPrimary: string;
    bgSecondary: string;
    bgHover: string;
    bgActive: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    borderHover: string;
    accent: string;
    accentHover: string;
    buttonBg: string;
    buttonHover: string;
    buttonActive: string;
}
export declare const themes: Record<Theme, ThemeColors>;
export declare function injectThemeStyles(theme?: Theme): void;
export declare function applyButtonStyle(button: HTMLButtonElement): void;
export declare function setButtonActive(button: HTMLButtonElement, active: boolean): void;
export declare function applyContainerStyle(container: HTMLElement): void;
export declare function applyPlayerControlsStyle(container: HTMLElement): void;
export declare function applyInputStyle(input: HTMLInputElement): void;
export declare function applyColorPickerStyle(input: HTMLInputElement): void;
export declare function applySliderStyle(input: HTMLInputElement): void;
export declare function createDivider(): HTMLDivElement;
export declare function getCSSPrefix(): string;
export declare function createThemeToggleButton(tool: AnnotationTool): HTMLButtonElement;
