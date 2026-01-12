import type { AnnotationTool } from "./core";
type Tool = NonNullable<AnnotationTool["currentTool"]>;
export declare class ButtonConstructor {
    tool: AnnotationTool;
    uiContainer: HTMLElement;
    constructor(tool: AnnotationTool, container: HTMLElement);
    get buttons(): HTMLButtonElement[];
    get addEvent(): {
        (node: HTMLDivElement, event: import("./ui/events").DropEventNames, callback: (e: DragEvent) => void): void;
        (node: HTMLInputElement, event: import("./ui/events").InputEventNames, callback: (e: Event) => void): void;
        (node: Document, event: import("./ui/events").ClipboardEventNames, callback: (e: ClipboardEvent) => void): void;
        (node: Document, event: "click", callback: (e: PointerEvent) => void): void;
        (node: HTMLVideoElement, event: import("./ui/events").VideoEventNames, callback: (e: Event) => void): void;
        (node: HTMLVideoElement, event: "keydown", callback: (e: KeyboardEvent) => void): void;
        (node: HTMLButtonElement, event: "click", callback: (e: Event) => void): void;
        (node: HTMLCanvasElement, event: import("./ui/events").PointerEventNames, callback: (e: PointerEvent) => void): void;
        (node: HTMLCanvasElement, event: import("./ui/events").TouchEventNames, callback: (e: TouchEvent) => void): void;
        (node: Document, event: "keydown", callback: (e: KeyboardEvent) => void): void;
        (node: Window & typeof globalThis, event: "resize", callback: (e: Event) => void): void;
    };
    get currentTool(): AnnotationTool["currentTool"];
    set currentTool(value: AnnotationTool["currentTool"]);
    create: (icon: string, tool: Tool | ((e: Event) => void), container?: HTMLElement) => HTMLButtonElement;
}
export declare function addButtons(tool: AnnotationTool, Button: ButtonConstructor): void;
export {};
