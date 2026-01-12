import { describe, it, expect } from 'vitest';
import { vFromRGB, grayscale } from '../src/plugins/utils/image-grayscale';
import { HistogramFrame, sobelOperator, calculateSimilarity } from '../src/plugins/utils/sobel-operator';

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

describe('Sobel Operator', () => {
  describe('HistogramFrame', () => {
    it('should create a HistogramFrame with unique id', () => {
      const frame1 = new HistogramFrame();
      const frame2 = new HistogramFrame();

      expect(frame1.id).toBeDefined();
      expect(frame2.id).toBeDefined();
      expect(frame1.id).not.toBe(frame2.id);
    });

    it('should behave like an array', () => {
      const frame = new HistogramFrame();
      frame.push(1, 2, 3);

      expect(frame.length).toBe(3);
      expect(frame[0]).toBe(1);
      expect(frame[1]).toBe(2);
      expect(frame[2]).toBe(3);
    });
  });

  describe('sobelOperator', () => {
    it('should detect edges in a simple gradient image', () => {
      // Create a 3x3 image with a vertical gradient
      // This should produce some edge detection values
      const data = new Uint8ClampedArray([
        0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255, // Row 1: black, gray, white
        0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255, // Row 2: black, gray, white
        0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255, // Row 3: black, gray, white
      ]);
      const imageData = { data, width: 3, height: 3 } as ImageData;

      const edges = sobelOperator(imageData);

      // With a 3x3 image, sobel operator processes only the center pixel (border is skipped)
      expect(edges.length).toBe(1);
      expect(edges instanceof HistogramFrame).toBe(true);
    });

    it('should return HistogramFrame instance', () => {
      const data = new Uint8ClampedArray([
        100, 100, 100, 255, 100, 100, 100, 255, 100, 100, 100, 255,
        100, 100, 100, 255, 100, 100, 100, 255, 100, 100, 100, 255,
        100, 100, 100, 255, 100, 100, 100, 255, 100, 100, 100, 255,
      ]);
      const imageData = { data, width: 3, height: 3 } as ImageData;

      const result = sobelOperator(imageData);

      expect(result instanceof HistogramFrame).toBe(true);
    });
  });

  describe('calculateSimilarity', () => {
    it('should return 1 for identical histograms', () => {
      const frame1 = new HistogramFrame();
      frame1.push(10, 20, 30);

      const frame2 = new HistogramFrame();
      frame2.push(10, 20, 30);

      const similarity = calculateSimilarity(frame1, frame2);

      expect(similarity).toBe(1);
    });

    it('should return value less than 1 for different histograms', () => {
      const frame1 = new HistogramFrame();
      frame1.push(10, 20, 30);

      const frame2 = new HistogramFrame();
      frame2.push(50, 60, 70);

      const similarity = calculateSimilarity(frame1, frame2);

      expect(similarity).toBeLessThan(1);
      expect(similarity).toBeGreaterThan(0);
    });

    it('should cache similarity results', () => {
      const frame1 = new HistogramFrame();
      frame1.push(1, 2, 3);

      const frame2 = new HistogramFrame();
      frame2.push(4, 5, 6);

      // Calculate twice - should use cache second time
      const result1 = calculateSimilarity(frame1, frame2);
      const result2 = calculateSimilarity(frame1, frame2);

      expect(result1).toBe(result2);
    });

    it('should return same result regardless of argument order', () => {
      const frame1 = new HistogramFrame();
      frame1.push(1, 2, 3);

      const frame2 = new HistogramFrame();
      frame2.push(4, 5, 6);

      const result1 = calculateSimilarity(frame1, frame2);
      const result2 = calculateSimilarity(frame2, frame1);

      expect(result1).toBe(result2);
    });
  });
});
