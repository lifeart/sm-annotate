import { vFromRGB } from "./image-grayscale";

/**
 * Colored difference of two RGBA pixel buffers of the same size.
 *
 * Pixels whose summed RGB difference is within `threshold` are written as the
 * grayscale of `a`, so unchanged areas keep their context. Differing pixels are
 * written red where `a` is brighter and blue where `b` is brighter.
 *
 * `threshold` is in the 0-765 range (|dr| + |dg| + |db|); 0 marks every change,
 * a small positive value hides video compression noise.
 *
 * Returns the number of differing pixels.
 */
export function computeDifferenceImage(
  a: Uint8ClampedArray,
  b: Uint8ClampedArray,
  out: Uint8ClampedArray,
  threshold = 0
): number {
  const length = Math.min(a.length, b.length, out.length);
  let changed = 0;
  for (let i = 0; i < length; i += 4) {
    const r1 = a[i];
    const g1 = a[i + 1];
    const b1 = a[i + 2];
    const r2 = b[i];
    const g2 = b[i + 1];
    const b2 = b[i + 2];

    const diff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);

    if (diff <= threshold) {
      const v = vFromRGB(r1, g1, b1);
      out[i] = v;
      out[i + 1] = v;
      out[i + 2] = v;
    } else {
      changed++;
      const brighterInA = vFromRGB(r1, g1, b1) >= vFromRGB(r2, g2, b2);
      out[i] = brighterInA ? 255 : 0;
      out[i + 1] = 0;
      out[i + 2] = brighterInA ? 0 : 255;
    }
    out[i + 3] = 255;
  }
  return changed;
}

/**
 * Rectangle that fits a source of `srcWidth`x`srcHeight` inside the
 * destination while keeping its aspect ratio, centered (letterbox/pillarbox).
 * Aspect ratios within 1% are treated as equal and fill the destination.
 */
export function fitRect(
  srcWidth: number,
  srcHeight: number,
  dstWidth: number,
  dstHeight: number
): { x: number; y: number; width: number; height: number } {
  if (!srcWidth || !srcHeight || !dstWidth || !dstHeight) {
    return { x: 0, y: 0, width: dstWidth, height: dstHeight };
  }
  const srcRatio = srcWidth / srcHeight;
  const dstRatio = dstWidth / dstHeight;
  if (Math.abs(srcRatio - dstRatio) / dstRatio < 0.01) {
    return { x: 0, y: 0, width: dstWidth, height: dstHeight };
  }
  if (srcRatio > dstRatio) {
    const height = dstWidth / srcRatio;
    return { x: 0, y: (dstHeight - height) / 2, width: dstWidth, height };
  }
  const width = dstHeight * srcRatio;
  return { x: (dstWidth - width) / 2, y: 0, width, height: dstHeight };
}
