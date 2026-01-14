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
/**
 * Parse OpenRV GTO file content and convert to sm-annotate format
 */
export declare function parseOpenRV(content: string, options?: {
    width?: number;
    height?: number;
    fps?: number;
}): ParsedOpenRVResult;
/**
 * Parse OpenRV file from File object
 */
export declare function parseOpenRVFile(file: File, options?: {
    width?: number;
    height?: number;
    fps?: number;
}): Promise<ParsedOpenRVResult>;
