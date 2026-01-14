import { describe, it, expect, beforeEach } from 'vitest';
import {
  AudioFingerprint,
  calculateAudioSimilarity,
  AudioFingerprintExtractor,
} from '../src/plugins/utils/audio-fingerprint';

describe('AudioFingerprint', () => {
  describe('constructor', () => {
    it('should create empty fingerprint', () => {
      const fp = new AudioFingerprint();
      expect(fp.length).toBe(0);
    });

    it('should create fingerprint with initial values', () => {
      const fp = new AudioFingerprint(0.1, 0.2, 0.3, 0.4);
      expect(fp.length).toBe(4);
      expect(fp[0]).toBe(0.1);
      expect(fp[1]).toBe(0.2);
      expect(fp[2]).toBe(0.3);
      expect(fp[3]).toBe(0.4);
    });

    it('should assign unique incrementing IDs', () => {
      const fp1 = new AudioFingerprint();
      const fp2 = new AudioFingerprint();
      const fp3 = new AudioFingerprint();

      expect(fp1.id).toBeDefined();
      expect(fp2.id).toBeDefined();
      expect(fp3.id).toBeDefined();
      expect(fp2.id).toBeGreaterThan(fp1.id);
      expect(fp3.id).toBeGreaterThan(fp2.id);
    });
  });

  describe('array behavior', () => {
    it('should support push', () => {
      const fp = new AudioFingerprint();
      fp.push(0.5);
      fp.push(0.6, 0.7);

      expect(fp.length).toBe(3);
      expect(fp[0]).toBe(0.5);
      expect(fp[1]).toBe(0.6);
      expect(fp[2]).toBe(0.7);
    });

    it('should support indexing', () => {
      const fp = new AudioFingerprint(1, 2, 3);
      expect(fp[0]).toBe(1);
      expect(fp[1]).toBe(2);
      expect(fp[2]).toBe(3);
    });

    it('should support iteration', () => {
      const fp = new AudioFingerprint(1, 2, 3);
      const values: number[] = [];
      for (const v of fp) {
        values.push(v);
      }
      expect(values).toEqual([1, 2, 3]);
    });

    it('should support map', () => {
      const fp = new AudioFingerprint(1, 2, 3);
      const doubled = fp.map(x => x * 2);
      // map returns a regular array, not AudioFingerprint
      expect(Array.from(doubled)).toEqual([2, 4, 6]);
    });

    it('should support reduce', () => {
      const fp = new AudioFingerprint(1, 2, 3, 4);
      const sum = fp.reduce((acc, val) => acc + val, 0);
      expect(sum).toBe(10);
    });

    it('should support slice', () => {
      const fp = new AudioFingerprint(1, 2, 3, 4, 5);
      const sliced = fp.slice(1, 4);
      // slice returns a regular array, not AudioFingerprint
      expect(Array.from(sliced)).toEqual([2, 3, 4]);
    });
  });
});

describe('calculateAudioSimilarity', () => {
  describe('identical fingerprints', () => {
    it('should return 1 for identical fingerprints', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.1, 0.2, 0.3);

      expect(calculateAudioSimilarity(fp1, fp2)).toBe(1);
    });

    it('should return 1 for identical fingerprints with many values', () => {
      const values = Array.from({ length: 128 }, (_, i) => i * 0.01);
      const fp1 = new AudioFingerprint(...values);
      const fp2 = new AudioFingerprint(...values);

      expect(calculateAudioSimilarity(fp1, fp2)).toBe(1);
    });

    it('should handle fingerprints with constant values', () => {
      // When all values are the same, variance is 0, correlation is undefined
      // The function handles this gracefully
      const fp1 = new AudioFingerprint(0.5, 0.5, 0.5, 0.5);
      const fp2 = new AudioFingerprint(0.5, 0.5, 0.5, 0.5);

      const result = calculateAudioSimilarity(fp1, fp2);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe('empty fingerprints', () => {
    it('should return 0 for empty fingerprint vs non-empty', () => {
      const empty = new AudioFingerprint();
      const nonEmpty = new AudioFingerprint(0.1, 0.2, 0.3);

      expect(calculateAudioSimilarity(empty, nonEmpty)).toBe(0);
      expect(calculateAudioSimilarity(nonEmpty, empty)).toBe(0);
    });

    it('should return 0 for both empty fingerprints', () => {
      const fp1 = new AudioFingerprint();
      const fp2 = new AudioFingerprint();

      expect(calculateAudioSimilarity(fp1, fp2)).toBe(0);
    });
  });

  describe('similarity ordering', () => {
    it('should return higher similarity for more similar fingerprints', () => {
      const base = new AudioFingerprint(0.1, 0.2, 0.3, 0.4, 0.5);
      const similar = new AudioFingerprint(0.11, 0.21, 0.31, 0.41, 0.51);
      const different = new AudioFingerprint(0.9, 0.8, 0.7, 0.6, 0.5);

      const simSimilar = calculateAudioSimilarity(base, similar);
      const simDifferent = calculateAudioSimilarity(base, different);

      expect(simSimilar).toBeGreaterThan(simDifferent);
    });

    it('should detect linearly correlated patterns', () => {
      // These have the same pattern, just scaled
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3, 0.4);
      const fp2 = new AudioFingerprint(0.2, 0.4, 0.6, 0.8);

      // Normalized cross-correlation should detect the linear relationship
      const similarity = calculateAudioSimilarity(fp1, fp2);
      expect(similarity).toBe(1); // Perfect correlation
    });

    it('should detect inversely correlated patterns', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3, 0.4);
      const fp2 = new AudioFingerprint(0.4, 0.3, 0.2, 0.1);

      const similarity = calculateAudioSimilarity(fp1, fp2);
      // Inverse correlation should give low similarity (mapped to 0-1 range)
      expect(similarity).toBe(0); // Perfect inverse = 0 in normalized range
    });
  });

  describe('symmetry', () => {
    it('should return same result regardless of argument order', () => {
      const fp1 = new AudioFingerprint(0.1, 0.3, 0.5, 0.7);
      const fp2 = new AudioFingerprint(0.2, 0.4, 0.6, 0.8);

      const sim1 = calculateAudioSimilarity(fp1, fp2);
      const sim2 = calculateAudioSimilarity(fp2, fp1);

      expect(sim1).toBe(sim2);
    });
  });

  describe('caching', () => {
    it('should cache results for same fingerprint pairs', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.4, 0.5, 0.6);

      const result1 = calculateAudioSimilarity(fp1, fp2);
      const result2 = calculateAudioSimilarity(fp1, fp2);
      const result3 = calculateAudioSimilarity(fp2, fp1);

      expect(result1).toBe(result2);
      expect(result1).toBe(result3);
    });
  });

  describe('range', () => {
    it('should always return value between 0 and 1', () => {
      const testCases = [
        // Different patterns with variance
        [new AudioFingerprint(0.1, 0.5, 0.3, 0.8), new AudioFingerprint(0.7, 0.2, 0.9, 0.4)],
        [new AudioFingerprint(0.1, 0.9, 0.1, 0.9), new AudioFingerprint(0.9, 0.1, 0.9, 0.1)],
        [new AudioFingerprint(0.1, 0.5, 0.9, 0.3), new AudioFingerprint(0.2, 0.6, 0.4, 0.8)],
      ];

      for (const [fp1, fp2] of testCases) {
        const sim = calculateAudioSimilarity(fp1, fp2);
        // Allow small floating point errors around 0
        expect(sim).toBeGreaterThanOrEqual(-1e-10);
        expect(sim).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('different lengths', () => {
    it('should handle fingerprints of different lengths', () => {
      const short = new AudioFingerprint(0.1, 0.2, 0.3);
      const long = new AudioFingerprint(0.1, 0.2, 0.3, 0.4, 0.5, 0.6);

      const similarity = calculateAudioSimilarity(short, long);
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should compare using shorter length', () => {
      // First 3 values are identical
      const short = new AudioFingerprint(0.1, 0.2, 0.3);
      const long = new AudioFingerprint(0.1, 0.2, 0.3, 0.9, 0.9, 0.9);

      const similarity = calculateAudioSimilarity(short, long);
      // Should have perfect similarity since compared portion is identical
      expect(similarity).toBe(1);
    });
  });

  describe('constant values', () => {
    it('should handle fingerprints with all same values', () => {
      const fp1 = new AudioFingerprint(0.5, 0.5, 0.5, 0.5);
      const fp2 = new AudioFingerprint(0.3, 0.3, 0.3, 0.3);

      // Both have zero variance, denominator would be 0
      // Should handle gracefully
      const similarity = calculateAudioSimilarity(fp1, fp2);
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('realistic audio patterns', () => {
    it('should detect similar audio energy patterns', () => {
      // Simulating two similar audio frames with slight variations
      const frame1 = new AudioFingerprint(
        0.02, 0.05, 0.08, 0.12, 0.15, 0.12, 0.08, 0.05,
        0.03, 0.06, 0.09, 0.13, 0.16, 0.13, 0.09, 0.06
      );
      const frame2 = new AudioFingerprint(
        0.025, 0.052, 0.082, 0.122, 0.152, 0.122, 0.082, 0.052,
        0.032, 0.062, 0.092, 0.132, 0.162, 0.132, 0.092, 0.062
      );

      const similarity = calculateAudioSimilarity(frame1, frame2);
      expect(similarity).toBeGreaterThan(0.99); // Very similar
    });

    it('should detect different audio energy patterns', () => {
      // Simulating two different audio frames
      const silence = new AudioFingerprint(
        0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001
      );
      const loud = new AudioFingerprint(
        0.8, 0.9, 0.85, 0.95, 0.88, 0.92, 0.87, 0.91
      );

      const similarity = calculateAudioSimilarity(silence, loud);
      expect(similarity).toBeLessThan(0.5); // Very different
    });
  });
});

describe('AudioFingerprintExtractor', () => {
  describe('constructor', () => {
    it('should create extractor with video and fps', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      expect(extractor).toBeDefined();
      expect(extractor.hasAudio()).toBe(false); // Not initialized yet
    });

    it('should accept different fps values', () => {
      const video = document.createElement('video');

      const extractor24 = new AudioFingerprintExtractor(video, 24);
      const extractor30 = new AudioFingerprintExtractor(video, 30);
      const extractor60 = new AudioFingerprintExtractor(video, 60);

      expect(extractor24).toBeDefined();
      expect(extractor30).toBeDefined();
      expect(extractor60).toBeDefined();
    });
  });

  describe('hasAudio', () => {
    it('should return false before initialization', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      expect(extractor.hasAudio()).toBe(false);
    });
  });

  describe('totalFrames', () => {
    it('should calculate total frames based on duration and fps', () => {
      const video = document.createElement('video');
      Object.defineProperty(video, 'duration', { value: 10, configurable: true });

      const extractor30 = new AudioFingerprintExtractor(video, 30);
      expect(extractor30.totalFrames).toBe(300);

      const extractor24 = new AudioFingerprintExtractor(video, 24);
      expect(extractor24.totalFrames).toBe(240);

      const extractor60 = new AudioFingerprintExtractor(video, 60);
      expect(extractor60.totalFrames).toBe(600);
    });

    it('should handle fractional durations', () => {
      const video = document.createElement('video');
      Object.defineProperty(video, 'duration', { value: 5.5, configurable: true });

      const extractor = new AudioFingerprintExtractor(video, 30);
      expect(extractor.totalFrames).toBe(165); // 5.5 * 30 = 165
    });
  });

  describe('getFingerprint without audio', () => {
    it('should return null when no audio is available', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      // Without calling init(), there's no audio buffer
      const fp = extractor.getFingerprint(1);
      expect(fp).toBeNull();
    });
  });

  describe('setFingerprint and getFingerprint', () => {
    it('should store and retrieve fingerprints', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      const fp = new AudioFingerprint(0.1, 0.2, 0.3);
      extractor.setFingerprint(10, fp);

      const retrieved = extractor.getFingerprint(10);
      expect(retrieved).toBe(fp);
    });

    it('should store fingerprints for different frames', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.4, 0.5, 0.6);
      const fp3 = new AudioFingerprint(0.7, 0.8, 0.9);

      extractor.setFingerprint(1, fp1);
      extractor.setFingerprint(2, fp2);
      extractor.setFingerprint(3, fp3);

      expect(extractor.getFingerprint(1)).toBe(fp1);
      expect(extractor.getFingerprint(2)).toBe(fp2);
      expect(extractor.getFingerprint(3)).toBe(fp3);
    });

    it('should overwrite fingerprint for same frame', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.4, 0.5, 0.6);

      extractor.setFingerprint(10, fp1);
      extractor.setFingerprint(10, fp2);

      expect(extractor.getFingerprint(10)).toBe(fp2);
    });
  });

  describe('findBestMatch', () => {
    let video: HTMLVideoElement;
    let extractor: AudioFingerprintExtractor;

    beforeEach(() => {
      video = document.createElement('video');
      Object.defineProperty(video, 'duration', { value: 10, configurable: true });
      extractor = new AudioFingerprintExtractor(video, 30);
    });

    it('should return reference frame when signature is null', () => {
      const result = extractor.findBestMatch(null, 15);
      expect(result).toBe(15);
    });

    it('should return reference frame when no audio available', () => {
      const signature = new AudioFingerprint(0.1, 0.2, 0.3);
      const result = extractor.findBestMatch(signature, 15);
      expect(result).toBe(15);
    });

    it('should find exact match when fingerprints are identical', () => {
      // Set up fingerprints with truly different patterns
      // targetFp has a specific pattern that won't correlate well with other patterns
      const targetFp = new AudioFingerprint(0.1, 0.9, 0.2, 0.8);
      // differentFp has an inverse/different pattern
      const differentFp = new AudioFingerprint(0.9, 0.1, 0.8, 0.2);

      extractor.setFingerprint(12, differentFp);
      extractor.setFingerprint(13, differentFp);
      extractor.setFingerprint(14, differentFp);
      extractor.setFingerprint(15, new AudioFingerprint(0.1, 0.9, 0.2, 0.8)); // Exact match at frame 15
      extractor.setFingerprint(16, differentFp);
      extractor.setFingerprint(17, differentFp);
      extractor.setFingerprint(18, differentFp);

      // Search for matching frame
      const result = extractor.findBestMatch(targetFp, 15);
      expect(result).toBe(15);
    });

    it('should find best match within window', () => {
      // Create fingerprints with one exact match
      const searchFp = new AudioFingerprint(0.1, 0.2, 0.3, 0.4);

      // Frame 14 has exact match to search fingerprint
      extractor.setFingerprint(12, new AudioFingerprint(0.9, 0.1, 0.9, 0.1));
      extractor.setFingerprint(13, new AudioFingerprint(0.8, 0.2, 0.8, 0.2));
      extractor.setFingerprint(14, new AudioFingerprint(0.1, 0.2, 0.3, 0.4)); // Exact match
      extractor.setFingerprint(15, new AudioFingerprint(0.5, 0.6, 0.7, 0.8));
      extractor.setFingerprint(16, new AudioFingerprint(0.6, 0.5, 0.4, 0.3));
      extractor.setFingerprint(17, new AudioFingerprint(0.7, 0.8, 0.9, 0.1));
      extractor.setFingerprint(18, new AudioFingerprint(0.8, 0.9, 0.1, 0.2));

      const result = extractor.findBestMatch(searchFp, 15);
      expect(result).toBe(14); // Should find the exact match
    });

    it('should respect window size parameter', () => {
      // Pattern to search for
      const searchFp = new AudioFingerprint(0.1, 0.8, 0.2, 0.7);

      // Completely different pattern (low correlation)
      const differentFp = new AudioFingerprint(0.8, 0.1, 0.7, 0.2);

      // Set up fingerprints:
      // - Frame 10: exact match (outside window=3 but inside window=5)
      // - Frame 15: different pattern (low correlation)
      // - Frames 12-14, 16-18: different pattern (low correlation)
      extractor.setFingerprint(10, new AudioFingerprint(0.1, 0.8, 0.2, 0.7)); // Exact match
      extractor.setFingerprint(12, differentFp);
      extractor.setFingerprint(13, differentFp);
      extractor.setFingerprint(14, differentFp);
      extractor.setFingerprint(15, differentFp);
      extractor.setFingerprint(16, differentFp);
      extractor.setFingerprint(17, differentFp);
      extractor.setFingerprint(18, differentFp);

      // With window=3 (searches frames 12-18), should not find frame 10
      // Best score among 12-18 is differentFp which has low correlation, so returns ref
      const result1 = extractor.findBestMatch(searchFp, 15, 3);
      expect(result1).toBe(15); // Falls back to reference or picks a low-correlation frame

      // With window=5 (searches frames 10-20), should find frame 10 (exact match)
      const result2 = extractor.findBestMatch(searchFp, 15, 5);
      expect(result2).toBe(10);
    });

    it('should handle boundary conditions at start', () => {
      const searchFp = new AudioFingerprint(0.1, 0.2, 0.3);

      extractor.setFingerprint(1, new AudioFingerprint(0.1, 0.2, 0.3));
      extractor.setFingerprint(2, new AudioFingerprint(0.5, 0.5, 0.5));
      extractor.setFingerprint(3, new AudioFingerprint(0.5, 0.5, 0.5));

      // Search around frame 2, should find frame 1 as best match
      const result = extractor.findBestMatch(searchFp, 2);
      expect(result).toBe(1);
    });

    it('should handle boundary conditions at end', () => {
      // Video has 300 frames (10 seconds at 30fps)
      const searchFp = new AudioFingerprint(0.1, 0.2, 0.3);

      extractor.setFingerprint(298, new AudioFingerprint(0.5, 0.5, 0.5));
      extractor.setFingerprint(299, new AudioFingerprint(0.5, 0.5, 0.5));
      extractor.setFingerprint(300, new AudioFingerprint(0.1, 0.2, 0.3));

      // Search around frame 299, should find frame 300 as best match
      const result = extractor.findBestMatch(searchFp, 299);
      expect(result).toBe(300);
    });
  });

  describe('destroy', () => {
    it('should clear fingerprints on destroy', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      const fp = new AudioFingerprint(0.1, 0.2, 0.3);
      extractor.setFingerprint(10, fp);
      expect(extractor.getFingerprint(10)).toBe(fp);

      extractor.destroy();

      // After destroy, fingerprints should be cleared
      // getFingerprint will return null since there's no audio buffer
      expect(extractor.getFingerprint(10)).toBeNull();
    });

    it('should reset hasAudio to false on destroy', () => {
      const video = document.createElement('video');
      const extractor = new AudioFingerprintExtractor(video, 30);

      extractor.destroy();

      expect(extractor.hasAudio()).toBe(false);
    });
  });
});

describe('Integration: Fingerprint matching workflow', () => {
  it('should correctly match frames between two extractors', () => {
    const video1 = document.createElement('video');
    const video2 = document.createElement('video');
    Object.defineProperty(video1, 'duration', { value: 5, configurable: true });
    Object.defineProperty(video2, 'duration', { value: 5, configurable: true });

    const extractor1 = new AudioFingerprintExtractor(video1, 30);
    const extractor2 = new AudioFingerprintExtractor(video2, 30);

    // Use truly distinct patterns for each frame (non-linear, unique shapes)
    // Video 1 frame 30 has a distinctive pattern
    const targetPattern = new AudioFingerprint(0.1, 0.8, 0.2, 0.7);

    extractor1.setFingerprint(28, new AudioFingerprint(0.9, 0.1, 0.9, 0.1));
    extractor1.setFingerprint(29, new AudioFingerprint(0.3, 0.6, 0.3, 0.6));
    extractor1.setFingerprint(30, targetPattern); // Target
    extractor1.setFingerprint(31, new AudioFingerprint(0.5, 0.5, 0.7, 0.3));
    extractor1.setFingerprint(32, new AudioFingerprint(0.2, 0.9, 0.1, 0.8));

    // Video 2: frame 31 has the same pattern as video1 frame 30
    extractor2.setFingerprint(28, new AudioFingerprint(0.4, 0.4, 0.8, 0.2));
    extractor2.setFingerprint(29, new AudioFingerprint(0.6, 0.3, 0.6, 0.4));
    extractor2.setFingerprint(30, new AudioFingerprint(0.7, 0.2, 0.5, 0.5));
    extractor2.setFingerprint(31, new AudioFingerprint(0.1, 0.8, 0.2, 0.7)); // Exact match for video1 frame 30
    extractor2.setFingerprint(32, new AudioFingerprint(0.8, 0.4, 0.3, 0.6));

    // Get fingerprint from video 1 frame 30
    const signature = extractor1.getFingerprint(30);

    // Find best match in video 2
    const bestMatch = extractor2.findBestMatch(signature, 30);

    expect(bestMatch).toBe(31); // Should find frame 31 as best match
  });

  it('should handle identical audio tracks', () => {
    const video1 = document.createElement('video');
    const video2 = document.createElement('video');
    Object.defineProperty(video1, 'duration', { value: 5, configurable: true });
    Object.defineProperty(video2, 'duration', { value: 5, configurable: true });

    const extractor1 = new AudioFingerprintExtractor(video1, 30);
    const extractor2 = new AudioFingerprintExtractor(video2, 30);

    // Use truly distinct patterns for each frame (so each frame only matches itself)
    const frames = [28, 29, 30, 31, 32];
    const fingerprints = [
      new AudioFingerprint(0.1, 0.9, 0.2, 0.8), // Unique pattern 1
      new AudioFingerprint(0.9, 0.1, 0.8, 0.2), // Unique pattern 2 (inverse of 1)
      new AudioFingerprint(0.3, 0.7, 0.4, 0.6), // Unique pattern 3
      new AudioFingerprint(0.5, 0.2, 0.9, 0.1), // Unique pattern 4
      new AudioFingerprint(0.8, 0.3, 0.5, 0.4), // Unique pattern 5
    ];

    frames.forEach((frame, i) => {
      extractor1.setFingerprint(frame, fingerprints[i]);
      // Copy the values to new fingerprints for extractor2
      extractor2.setFingerprint(frame, new AudioFingerprint(...fingerprints[i]));
    });

    // Each frame should match itself (since patterns are unique)
    for (const frame of frames) {
      const signature = extractor1.getFingerprint(frame);
      const bestMatch = extractor2.findBestMatch(signature, frame);
      expect(bestMatch).toBe(frame);
    }
  });
});
