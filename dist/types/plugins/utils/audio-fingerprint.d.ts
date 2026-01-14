/**
 * @module plugins/utils/audio-fingerprint
 * @description Audio-based frame synchronization for video comparison.
 *
 * This module provides audio fingerprinting for syncing two videos during
 * comparison mode. It extracts audio energy patterns and uses cross-correlation
 * to find matching frames between the main video and reference video.
 *
 * @example
 * ```typescript
 * const extractor = new AudioFingerprintExtractor(videoElement, 30);
 * await extractor.init();
 *
 * // Get fingerprint for a frame
 * const fp = extractor.getFingerprint(frameNumber);
 *
 * // Find best matching frame in another extractor
 * const bestFrame = findBestAudioMatch(fp, referenceExtractor, frameNumber);
 * ```
 */
/**
 * Audio fingerprint data for a frame or frame range.
 * Contains normalized energy values representing the audio signature.
 */
export declare class AudioFingerprint extends Array<number> {
    private static nextId;
    readonly id: number;
    constructor(...items: number[]);
}
/**
 * Calculate normalized cross-correlation between two audio fingerprints.
 * Returns a value between 0 (no correlation) and 1 (perfect match).
 */
export declare function calculateAudioSimilarity(fp1: AudioFingerprint, fp2: AudioFingerprint): number;
/**
 * Extracts and stores audio fingerprints from a video element.
 */
export declare class AudioFingerprintExtractor {
    private video;
    private fps;
    private audioContext;
    private audioBuffer;
    private fingerprints;
    private isInitialized;
    private initPromise;
    constructor(video: HTMLVideoElement, fps: number);
    /**
     * Initialize the audio extractor by decoding video audio.
     * This should be called once before extracting fingerprints.
     */
    init(): Promise<void>;
    private doInit;
    /**
     * Check if audio extraction was successful.
     */
    hasAudio(): boolean;
    /**
     * Get the total number of frames in the video.
     */
    get totalFrames(): number;
    /**
     * Extract audio fingerprint for a specific frame.
     * The fingerprint covers a small window around the frame time.
     */
    extractFingerprint(frameNumber: number): AudioFingerprint | null;
    /**
     * Get fingerprint for a frame, extracting if not cached.
     */
    getFingerprint(frameNumber: number): AudioFingerprint | null;
    /**
     * Pre-extract fingerprints for a range of frames.
     */
    extractRange(startFrame: number, endFrame: number): void;
    /**
     * Set a fingerprint for a specific frame (used when buffering frames).
     */
    setFingerprint(frameNumber: number, fingerprint: AudioFingerprint): void;
    /**
     * Find the best matching frame in this extractor for a given fingerprint.
     * Searches within a window around the reference frame number.
     *
     * @param signature - The audio fingerprint to match
     * @param refFrameNumber - The reference frame number to search around
     * @param windowSize - Number of frames to search in each direction (default: 3)
     * @returns The best matching frame number
     */
    findBestMatch(signature: AudioFingerprint | null, refFrameNumber: number, windowSize?: number): number;
    /**
     * Clean up resources.
     */
    destroy(): void;
}
