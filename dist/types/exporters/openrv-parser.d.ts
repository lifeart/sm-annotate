/**
 * OpenRV GTO Parser
 *
 * Parses OpenRV .rv (GTO text format) files and converts annotations
 * to sm-annotate FrameAnnotationV1 format.
 *
 * Supported component types:
 * - pen:N:F:user - Freehand strokes (curves) and shapes
 * - text:N:F:user - Text annotations
 */
import type { FrameAnnotationV1 } from "../core";
export interface ParsedOpenRVResult {
    /** Parsed frame annotations */
    frames: FrameAnnotationV1[];
    /** Media path from the file (if found) */
    mediaPath?: string;
    /** Media dimensions (if found) */
    dimensions?: {
        width: number;
        height: number;
    };
    /** Session name (if found) */
    sessionName?: string;
    /** FPS from file (if determinable) */
    fps?: number;
}
/**
 * Convert RGBA float array [r, g, b, a] to hex color string
 */
export declare function rgbaToHex(rgba: number[]): string;
export interface OpenRVParseOptions {
    /** Override width (uses file dimensions if available) */
    width?: number;
    /** Override height (uses file dimensions if available) */
    height?: number;
    /** Target height for scaling calculations */
    targetHeight?: number;
    /** Frames per second */
    fps?: number;
    /**
     * Scale factor for coordinates (0.85 = 15% smaller toward center).
     * Applied after coordinate conversion.
     */
    coordinateScale?: number;
    /**
     * Offset to apply to coordinates after scaling.
     * Positive values move shapes left (x) and up (y).
     * Example: { x: 0.07, y: 0.07 } shifts 7% left and up.
     */
    coordinateOffset?: {
        x: number;
        y: number;
    };
    /** Enable debug logging */
    debug?: boolean;
}
/**
 * Parse OpenRV GTO file content and convert to sm-annotate format
 */
export declare function parseOpenRV(content: string, options?: OpenRVParseOptions): ParsedOpenRVResult;
/**
 * Parse OpenRV file from File object
 */
export declare function parseOpenRVFile(file: File, options?: OpenRVParseOptions): Promise<ParsedOpenRVResult>;
