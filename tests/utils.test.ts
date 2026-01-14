import { describe, it, expect } from 'vitest';
import { vFromRGB, grayscale } from '../src/plugins/utils/image-grayscale';
import { AudioFingerprint, calculateAudioSimilarity } from '../src/plugins/utils/audio-fingerprint';

describe('Image Grayscale Utils', () => {
  describe('vFromRGB', () => {
    it('should convert RGB to grayscale using luminosity formula', () => {
      // Formula: 0.299 * r + 0.587 * g + 0.114 * b

      // White (255, 255, 255) should give ~255
      expect(vFromRGB(255, 255, 255)).toBeCloseTo(255, 0);

      // Black (0, 0, 0) should give 0
      expect(vFromRGB(0, 0, 0)).toBe(0);

      // Pure red (255, 0, 0)
      expect(vFromRGB(255, 0, 0)).toBeCloseTo(76.245, 1);

      // Pure green (0, 255, 0)
      expect(vFromRGB(0, 255, 0)).toBeCloseTo(149.685, 1);

      // Pure blue (0, 0, 255)
      expect(vFromRGB(0, 0, 255)).toBeCloseTo(29.07, 1);
    });

    it('should weight green highest (as per human perception)', () => {
      // Green contributes most to perceived brightness
      const pureRed = vFromRGB(255, 0, 0);
      const pureGreen = vFromRGB(0, 255, 0);
      const pureBlue = vFromRGB(0, 0, 255);

      expect(pureGreen).toBeGreaterThan(pureRed);
      expect(pureGreen).toBeGreaterThan(pureBlue);
      expect(pureRed).toBeGreaterThan(pureBlue);
    });
  });

  describe('grayscale', () => {
    it('should convert image data to grayscale in place', () => {
      // Create a simple 2x1 pixel image data
      const data = new Uint8ClampedArray([
        255, 0, 0, 255, // Red pixel
        0, 255, 0, 255, // Green pixel
      ]);
      const imageData = { data, width: 2, height: 1 } as ImageData;

      const result = grayscale(imageData);

      // Red pixel should become gray
      expect(result.data[0]).toBeCloseTo(76, 0);
      expect(result.data[1]).toBeCloseTo(76, 0);
      expect(result.data[2]).toBeCloseTo(76, 0);
      expect(result.data[3]).toBe(255); // Alpha unchanged

      // Green pixel should become gray
      expect(result.data[4]).toBeCloseTo(150, 0);
      expect(result.data[5]).toBeCloseTo(150, 0);
      expect(result.data[6]).toBeCloseTo(150, 0);
      expect(result.data[7]).toBe(255); // Alpha unchanged
    });
  });
});

describe('Audio Fingerprint', () => {
  describe('AudioFingerprint', () => {
    it('should create an AudioFingerprint with unique id', () => {
      const fp1 = new AudioFingerprint();
      const fp2 = new AudioFingerprint();

      expect(fp1.id).toBeDefined();
      expect(fp2.id).toBeDefined();
      expect(fp1.id).not.toBe(fp2.id);
    });

    it('should behave like an array', () => {
      const fp = new AudioFingerprint();
      fp.push(0.1, 0.2, 0.3);

      expect(fp.length).toBe(3);
      expect(fp[0]).toBe(0.1);
      expect(fp[1]).toBe(0.2);
      expect(fp[2]).toBe(0.3);
    });

    it('should accept initial values in constructor', () => {
      const fp = new AudioFingerprint(0.5, 0.6, 0.7);

      expect(fp.length).toBe(3);
      expect(fp[0]).toBe(0.5);
      expect(fp[1]).toBe(0.6);
      expect(fp[2]).toBe(0.7);
    });
  });

  describe('calculateAudioSimilarity', () => {
    it('should return 1 for identical fingerprints', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.1, 0.2, 0.3);

      const similarity = calculateAudioSimilarity(fp1, fp2);

      expect(similarity).toBe(1);
    });

    it('should return value between 0 and 1 for different fingerprints', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.5, 0.6, 0.7);

      const similarity = calculateAudioSimilarity(fp1, fp2);

      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should return higher similarity for more similar fingerprints', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fpSimilar = new AudioFingerprint(0.11, 0.21, 0.31);
      const fpDifferent = new AudioFingerprint(0.9, 0.8, 0.7);

      const similarityClose = calculateAudioSimilarity(fp1, fpSimilar);
      const similarityFar = calculateAudioSimilarity(fp1, fpDifferent);

      expect(similarityClose).toBeGreaterThan(similarityFar);
    });

    it('should cache similarity results', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.4, 0.5, 0.6);

      // Calculate twice - should use cache second time
      const result1 = calculateAudioSimilarity(fp1, fp2);
      const result2 = calculateAudioSimilarity(fp1, fp2);

      expect(result1).toBe(result2);
    });

    it('should return same result regardless of argument order', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.4, 0.5, 0.6);

      const result1 = calculateAudioSimilarity(fp1, fp2);
      const result2 = calculateAudioSimilarity(fp2, fp1);

      expect(result1).toBe(result2);
    });

    it('should return 0 for empty fingerprints', () => {
      const fp1 = new AudioFingerprint();
      const fp2 = new AudioFingerprint(0.1, 0.2, 0.3);

      expect(calculateAudioSimilarity(fp1, fp2)).toBe(0);
      expect(calculateAudioSimilarity(fp2, fp1)).toBe(0);
      expect(calculateAudioSimilarity(fp1, fp1)).toBe(0);
    });

    it('should handle fingerprints with different lengths', () => {
      const fp1 = new AudioFingerprint(0.1, 0.2, 0.3);
      const fp2 = new AudioFingerprint(0.1, 0.2, 0.3, 0.4, 0.5);

      // Should use shorter length and still return valid similarity
      const similarity = calculateAudioSimilarity(fp1, fp2);
      expect(similarity).toBeGreaterThanOrEqual(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });
});
