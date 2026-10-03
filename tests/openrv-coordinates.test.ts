import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { exportToOpenRV, convertSmAnnotateToOpenRV, hexToRGBA } from '../src/exporters/openrv';
import { parseOpenRV, convertOpenRVToSmAnnotate } from '../src/exporters/openrv-parser';
import type { FrameAnnotationV1 } from '../src/core';
import type { ICircle } from '../src/plugins/circle';
import type { ILine } from '../src/plugins/line';
import type { IText } from '../src/plugins/text';
import type { ICurve } from '../src/plugins/curve';

// RV paint space is normalized by image height: x in [-aspect/2, aspect/2], y in [-0.5, 0.5]
function pointsOf(gto: string): number[][] {
  const m = gto.match(/float\[2\] points = \[([\s\S]*?)\]\s*\n\s*(?:\w|\})/);
  if (!m) return [];
  return [...m[1].matchAll(/\[ (\S+) (\S+) \]/g)].map((p) => [Number(p[1]), Number(p[2])]);
}

describe('OpenRV paint coordinates', () => {
  it('maps image corners to height-normalized RV space and back', () => {
    const aspect = 1920 / 1080;
    expect(convertSmAnnotateToOpenRV(0, 0, aspect)).toEqual({ x: -aspect / 2, y: 0.5 });
    expect(convertSmAnnotateToOpenRV(1, 1, aspect)).toEqual({ x: aspect / 2, y: -0.5 });
    const back = convertOpenRVToSmAnnotate(-aspect / 2, 0.5, aspect);
    expect(back.x).toBeCloseTo(0, 10);
    expect(back.y).toBeCloseTo(0, 10);
  });

  it('exports a circle as round in RV space on a 16:9 frame', () => {
    const circle: ICircle = {
      type: 'circle', x: 0.5, y: 0.5, radius: 0.1,
      strokeStyle: '#ff0000', fillStyle: '#ff0000', lineWidth: 2,
    };
    const frames: FrameAnnotationV1[] = [{ frame: 1, fps: 25, version: 1, shapes: [circle] }];
    const pts = pointsOf(exportToOpenRV(frames, { mediaPath: '/a.mp4', width: 1920, height: 1080 }));
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    // radius 0.1 of width = 192px -> 192/1080 in RV units on both axes
    expect(spanX).toBeCloseTo((2 * 192) / 1080, 4);
    expect(spanY).toBeCloseTo((2 * 192) / 1080, 4);
  });

  it('rotates in pixel space so a rotated line keeps its length on a 16:9 frame', () => {
    const line: ILine = {
      type: 'line', x1: 0.4, y1: 0.5, x2: 0.6, y2: 0.5,
      strokeStyle: '#ff0000', fillStyle: '#ff0000', lineWidth: 2,
      rotation: Math.PI / 2,
    };
    const frames: FrameAnnotationV1[] = [{ frame: 1, fps: 25, version: 1, shapes: [line] }];
    const [a, b] = pointsOf(exportToOpenRV(frames, { mediaPath: '/a.mp4', width: 1920, height: 1080 }));
    // 0.2 of width = 384px long; vertical after rotation
    expect(Math.abs(a[0] - b[0])).toBeLessThan(1e-6);
    expect(Math.abs(a[1] - b[1])).toBeCloseTo(384 / 1080, 4);
  });

  it('round-trips curve and text positions through export and parse', () => {
    const curve: ICurve = {
      type: 'curve', points: [{ x: 0.1, y: 0.2 }, { x: 0.8, y: 0.9 }],
      strokeStyle: '#00ff00', fillStyle: '#00ff00', lineWidth: 3,
    };
    const text: IText = {
      type: 'text', x: 0.25, y: 0.75, text: 'hi',
      strokeStyle: '#ffffff', fillStyle: '#ffffff', lineWidth: 1,
    };
    const frames: FrameAnnotationV1[] = [{ frame: 3, fps: 24, version: 1, shapes: [curve, text] }];
    const gto = exportToOpenRV(frames, { mediaPath: '/a.mp4', width: 2048, height: 858 });
    const parsed = parseOpenRV(gto, { width: 2048, height: 858, fps: 24 });
    const shapes = parsed.frames[0].shapes;
    const c = shapes.find((s) => s.type === 'curve') as ICurve;
    const t = shapes.find((s) => s.type === 'text') as IText;
    expect(c.points[0].x).toBeCloseTo(0.1, 4);
    expect(c.points[1].y).toBeCloseTo(0.9, 4);
    expect(t.x).toBeCloseTo(0.25, 4);
    expect(t.y).toBeCloseTo(0.75, 4);
  });

  it('places the demo RV session strokes inside the frame without a scale fudge', () => {
    const content = readFileSync(resolve(__dirname, '../demo/test_session.rv'), 'utf8');
    const parsed = parseOpenRV(content, { width: 1280, height: 536, fps: 24 });
    const all = parsed.frames.flatMap((f) => f.shapes);
    expect(all.length).toBeGreaterThan(0);
    for (const s of all) {
      const pts = s.type === 'curve' ? (s as ICurve).points : s.type === 'text' ? [s as IText] : [];
      for (const p of pts) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(1);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('hexToRGBA', () => {
  it('never returns NaN for unparseable colors', () => {
    expect(hexToRGBA('red').every(Number.isFinite)).toBe(true);
  });

  it('multiplies #RRGGBBAA alpha with shape opacity', () => {
    expect(hexToRGBA('#ff000080', 0.5)[3]).toBeCloseTo(0.25, 2);
  });
});

describe('GTO header', () => {
  it('keeps the file parseable when the media path contains a newline', () => {
    const frames: FrameAnnotationV1[] = [{ frame: 1, fps: 25, version: 1, shapes: [] }];
    const gto = exportToOpenRV(frames, { mediaPath: '/a\nb.mp4', width: 100, height: 100 });
    expect(() => parseOpenRV(gto)).not.toThrow();
  });
});
