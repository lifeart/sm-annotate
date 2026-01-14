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
export class AudioFingerprint extends Array<number> {
  private static nextId = 0;
  readonly id: number;

  constructor(...items: number[]) {
    super(...items);
    this.id = AudioFingerprint.nextId++;
  }
}

/**
 * Cache for similarity calculations to avoid redundant computation.
 */
const similarityCache = new Map<string, number>();

/**
 * Generate cache key for two fingerprints.
 */
function getCacheKey(fp1: AudioFingerprint, fp2: AudioFingerprint): string {
  return `${Math.min(fp1.id, fp2.id)}-${Math.max(fp1.id, fp2.id)}`;
}

/**
 * Calculate normalized cross-correlation between two audio fingerprints.
 * Returns a value between 0 (no correlation) and 1 (perfect match).
 */
export function calculateAudioSimilarity(
  fp1: AudioFingerprint,
  fp2: AudioFingerprint
): number {
  const key = getCacheKey(fp1, fp2);
  const cached = similarityCache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  if (fp1.length === 0 || fp2.length === 0) {
    return 0;
  }

  // Use the shorter length to compare
  const len = Math.min(fp1.length, fp2.length);

  // Calculate means
  let mean1 = 0;
  let mean2 = 0;
  for (let i = 0; i < len; i++) {
    mean1 += fp1[i];
    mean2 += fp2[i];
  }
  mean1 /= len;
  mean2 /= len;

  // Calculate normalized cross-correlation
  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;

  for (let i = 0; i < len; i++) {
    const diff1 = fp1[i] - mean1;
    const diff2 = fp2[i] - mean2;
    numerator += diff1 * diff2;
    denom1 += diff1 * diff1;
    denom2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(denom1 * denom2);
  // Avoid division by zero and convert to 0-1 range
  const correlation = denominator === 0 ? 0 : (numerator / denominator + 1) / 2;

  similarityCache.set(key, correlation);
  return correlation;
}

/**
 * Number of audio samples per fingerprint segment.
 * Higher values give more accurate matching but use more memory.
 */
const SAMPLES_PER_FINGERPRINT = 128;

/**
 * Extracts and stores audio fingerprints from a video element.
 */
export class AudioFingerprintExtractor {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private fingerprints: Map<number, AudioFingerprint> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(
    private video: HTMLVideoElement,
    private fps: number
  ) {}

  /**
   * Initialize the audio extractor by decoding video audio.
   * This should be called once before extracting fingerprints.
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    try {
      // Fetch the video as a blob to extract audio
      const response = await fetch(this.video.currentSrc || this.video.src);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      this.audioContext = new AudioContext();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.isInitialized = true;
    } catch (error) {
      // Video might not have audio track - this is okay
      console.warn('Could not extract audio for fingerprinting:', error);
      this.isInitialized = true;
      this.audioBuffer = null;
    }
  }

  /**
   * Check if audio extraction was successful.
   */
  hasAudio(): boolean {
    return this.audioBuffer !== null;
  }

  /**
   * Get the total number of frames in the video.
   */
  get totalFrames(): number {
    return Math.round(this.video.duration * this.fps);
  }

  /**
   * Extract audio fingerprint for a specific frame.
   * The fingerprint covers a small window around the frame time.
   */
  extractFingerprint(frameNumber: number): AudioFingerprint | null {
    if (!this.audioBuffer) {
      return null;
    }

    // Calculate time window for this frame
    const frameTime = (frameNumber - 1) / this.fps;
    const windowDuration = 1 / this.fps; // One frame duration

    // Get samples for this time window
    const sampleRate = this.audioBuffer.sampleRate;
    const startSample = Math.floor(frameTime * sampleRate);
    const endSample = Math.floor((frameTime + windowDuration) * sampleRate);
    const numSamples = endSample - startSample;

    if (numSamples <= 0 || startSample >= this.audioBuffer.length) {
      return null;
    }

    // Get channel data (use first channel)
    const channelData = this.audioBuffer.getChannelData(0);

    // Calculate energy in segments
    const fingerprint = new AudioFingerprint();
    const samplesPerSegment = Math.max(1, Math.floor(numSamples / SAMPLES_PER_FINGERPRINT));

    for (let i = 0; i < SAMPLES_PER_FINGERPRINT; i++) {
      const segmentStart = startSample + i * samplesPerSegment;
      const segmentEnd = Math.min(segmentStart + samplesPerSegment, this.audioBuffer.length);

      // Calculate RMS energy for this segment
      let energy = 0;
      let count = 0;
      for (let j = segmentStart; j < segmentEnd; j++) {
        if (j < channelData.length) {
          energy += channelData[j] * channelData[j];
          count++;
        }
      }

      const rms = count > 0 ? Math.sqrt(energy / count) : 0;
      fingerprint.push(rms);
    }

    return fingerprint;
  }

  /**
   * Get fingerprint for a frame, extracting if not cached.
   */
  getFingerprint(frameNumber: number): AudioFingerprint | null {
    if (this.fingerprints.has(frameNumber)) {
      return this.fingerprints.get(frameNumber)!;
    }

    const fp = this.extractFingerprint(frameNumber);
    if (fp) {
      this.fingerprints.set(frameNumber, fp);
    }
    return fp;
  }

  /**
   * Pre-extract fingerprints for a range of frames.
   */
  extractRange(startFrame: number, endFrame: number): void {
    for (let i = startFrame; i <= endFrame; i++) {
      this.getFingerprint(i);
    }
  }

  /**
   * Set a fingerprint for a specific frame (used when buffering frames).
   */
  setFingerprint(frameNumber: number, fingerprint: AudioFingerprint): void {
    this.fingerprints.set(frameNumber, fingerprint);
  }

  /**
   * Find the best matching frame in this extractor for a given fingerprint.
   * Searches within a window around the reference frame number.
   *
   * @param signature - The audio fingerprint to match
   * @param refFrameNumber - The reference frame number to search around
   * @param windowSize - Number of frames to search in each direction (default: 3)
   * @returns The best matching frame number
   */
  findBestMatch(
    signature: AudioFingerprint | null,
    refFrameNumber: number,
    windowSize = 3
  ): number {
    if (!signature) {
      return refFrameNumber;
    }

    // Check if we have any fingerprints to search (either cached or from audio)
    const hasCachedFingerprints = this.fingerprints.size > 0;
    if (!hasCachedFingerprints && !this.hasAudio()) {
      return refFrameNumber;
    }

    let bestScore = 0;
    let bestFrame = refFrameNumber;

    // Search in a window around the reference frame
    const startFrame = Math.max(1, refFrameNumber - windowSize);
    const endFrame = Math.min(this.totalFrames, refFrameNumber + windowSize);

    for (let frame = startFrame; frame <= endFrame; frame++) {
      const fp = this.getFingerprint(frame);
      if (fp) {
        const score = calculateAudioSimilarity(signature, fp);
        if (score > bestScore) {
          bestScore = score;
          bestFrame = frame;
        }
      }
    }

    return bestFrame;
  }

  /**
   * Clean up resources.
   */
  destroy(): void {
    this.fingerprints.clear();
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.audioBuffer = null;
    this.isInitialized = false;
    this.initPromise = null;
  }
}
