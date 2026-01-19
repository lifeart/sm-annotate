/**
 * OpenRV GTO Exporter
 *
 * Exports sm-annotate annotations to OpenRV .rv (GTO text format) files.
 *
 * Uses gto-js library for robust GTO generation with support for:
 * - Text (.rv) and binary (.gto) formats
 * - Proper string table management
 * - Clean builder API
 *
 * OpenRV uses RVPaint nodes to store annotations with components like:
 * - pen:N:frame:F - Freehand strokes (curves)
 * - text:N:frame:F - Text annotations
 * - rect:N:frame:F - Rectangle annotations (approximated as pen strokes)
 *
 * GTO Format Reference: https://aswf-openrv.readthedocs.io/en/latest/rv-manuals/rv-gto.html
 */
import type { FrameAnnotationV1 } from "../core";
/**
 * Ghost mode settings for export
 */
export interface GhostExportSettings {
    enabled: boolean;
    framesBefore: number;
    framesAfter: number;
    opacity: number;
    tintBefore: string | null;
    tintAfter: string | null;
}
export interface OpenRVExportOptions {
    /** Source media path (required by OpenRV) */
    mediaPath: string;
    /** Canvas/media width in pixels */
    width: number;
    /** Canvas/media height in pixels */
    height: number;
    /** Session name for the RV file */
    sessionName?: string;
    /** Ghost mode (onion skinning) settings */
    ghost?: GhostExportSettings;
}
/**
 * Convert hex color string to RGBA float array [r, g, b, a]
 */
export declare function hexToRGBA(hex: string, opacity?: number): [number, number, number, number];
/**
 * Export annotations to OpenRV GTO format string
 */
export declare function exportToOpenRV(frames: FrameAnnotationV1[], options: OpenRVExportOptions): string;
/**
 * Export annotations to OpenRV GTO binary format
 */
export declare function exportToOpenRVBinary(frames: FrameAnnotationV1[], options: OpenRVExportOptions): ArrayBuffer;
/**
 * Download annotations as OpenRV .rv file
 */
export declare function downloadAsOpenRV(frames: FrameAnnotationV1[], options: OpenRVExportOptions, filename?: string): void;
/**
 * Download annotations as OpenRV .gto binary file
 */
export declare function downloadAsOpenRVBinary(frames: FrameAnnotationV1[], options: OpenRVExportOptions, filename?: string): void;
