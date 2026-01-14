import { describe, it, expect } from 'vitest';
import {
  parseOpenRV,
  rgbaToHex,
  type ParsedOpenRVResult,
} from '../src/exporters/openrv-parser';
import { exportToOpenRV } from '../src/exporters/openrv';
import type { FrameAnnotationV1 } from '../src/core';
import type { ICurve } from '../src/plugins/curve';
import type { IText } from '../src/plugins/text';
import type { ILine } from '../src/plugins/line';
import type { IArrow } from '../src/plugins/arrow';
import type { IRectangle } from '../src/plugins/rectangle';
import type { ICircle } from '../src/plugins/circle';

describe('OpenRV Parser', () => {
  describe('rgbaToHex', () => {
    it('should convert RGBA to hex', () => {
      expect(rgbaToHex([1, 0, 0, 1])).toBe('#ff0000');
      expect(rgbaToHex([0, 1, 0, 1])).toBe('#00ff00');
      expect(rgbaToHex([0, 0, 1, 1])).toBe('#0000ff');
      expect(rgbaToHex([1, 1, 1, 1])).toBe('#ffffff');
      expect(rgbaToHex([0, 0, 0, 1])).toBe('#000000');
    });

    it('should handle partial values', () => {
      expect(rgbaToHex([0.5, 0.5, 0.5, 1])).toBe('#808080');
    });

    it('should handle arrays with less than 3 elements', () => {
      expect(rgbaToHex([1, 0])).toBe('#000000');
      expect(rgbaToHex([])).toBe('#000000');
    });
  });

  describe('parseOpenRV', () => {
    it('should parse empty GTO file', () => {
      const content = `GTOa (4)

RVSession : RVSession (4)
{
    session
    {
        string name = "test-session"
        int version = 4
    }
}
`;
      const result = parseOpenRV(content);

      expect(result.frames).toHaveLength(0);
      expect(result.sessionName).toBe('test-session');
    });

    it('should parse media path and dimensions', () => {
      const content = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/path/to/video.mp4"
    }
    request
    {
        int width = 1920
        int height = 1080
    }
}
`;
      const result = parseOpenRV(content);

      expect(result.mediaPath).toBe('/path/to/video.mp4');
      expect(result.dimensions).toEqual({ width: 1920, height: 1080 });
    });

    it('should parse pen component as curve', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:5:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 0.800000 ]
        float width = 3
        float[2] points = [ 100.000000 50.000000 200.000000 100.000000 ]
        int frame = 5
        byte brush = 0
        int splat = 0
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].frame).toBe(5);
      expect(result.frames[0].shapes).toHaveLength(1);

      const shape = result.frames[0].shapes[0] as ICurve;
      expect(shape.type).toBe('curve');
      expect(shape.points).toHaveLength(2);
      // Normalized: 100/1000 = 0.1, 50/500 = 0.1
      expect(shape.points[0].x).toBeCloseTo(0.1, 5);
      expect(shape.points[0].y).toBeCloseTo(0.1, 5);
      expect(shape.strokeStyle).toBe('#ff0000');
      expect(shape.lineWidth).toBe(3);
      expect(shape.opacity).toBeCloseTo(0.8, 5);
    });

    it('should parse text component', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:10:user
    {
        float[2] position = [ 300.000000 200.000000 ]
        float[4] color = [ 0.000000 0.000000 0.000000 1.000000 ]
        float size = 0.165
        string text = "Hello World"
        int frame = 10
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].frame).toBe(10);

      const shape = result.frames[0].shapes[0] as IText;
      expect(shape.type).toBe('text');
      expect(shape.x).toBeCloseTo(0.3, 5);
      expect(shape.y).toBeCloseTo(0.4, 5);
      expect(shape.text).toBe('Hello World');
      expect(shape.fillStyle).toBe('#000000');
    });

    it('should handle text with escaped characters', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:1:user
    {
        float[2] position = [ 100.000000 100.000000 ]
        float[4] color = [ 0.000000 0.000000 0.000000 1.000000 ]
        float size = 0.16
        string text = "Line1\\nLine2"
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      const shape = result.frames[0].shapes[0] as IText;
      expect(shape.text).toBe('Line1\nLine2');
    });

    it('should parse multiple frames', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 2
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 1
    }
    pen:1:5:user
    {
        float[4] color = [ 0.000000 1.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 300.000000 300.000000 400.000000 400.000000 ]
        int frame = 5
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(2);
      expect(result.frames[0].frame).toBe(1);
      expect(result.frames[1].frame).toBe(5);
    });

    it('should sort frames by frame number', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 2
    }
    pen:0:10:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 10
    }
    pen:1:3:user
    {
        float[4] color = [ 0.000000 1.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 300.000000 300.000000 400.000000 400.000000 ]
        int frame = 3
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames[0].frame).toBe(3);
      expect(result.frames[1].frame).toBe(10);
    });

    it('should use default dimensions when not provided', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 960.000000 540.000000 1920.000000 1080.000000 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content);

      const shape = result.frames[0].shapes[0] as ICurve;
      // Default dimensions 1920x1080
      expect(shape.points[0].x).toBeCloseTo(0.5, 5);
      expect(shape.points[0].y).toBeCloseTo(0.5, 5);
    });

    it('should skip invalid pen components', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      // Should skip due to insufficient points
      expect(result.frames).toHaveLength(0);
    });

    it('should handle GTO comments', () => {
      const content = `GTOa (4)

# This is a comment
RVSession : RVSession (4)
{
    # Another comment
    session
    {
        string name = "test"
        int version = 4
    }
}
`;
      const result = parseOpenRV(content);

      expect(result.sessionName).toBe('test');
    });

    it('should set fps from options', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { fps: 30 });

      expect(result.fps).toBe(30);
      expect(result.frames[0].fps).toBe(30);
    });
  });

  describe('parseOpenRV edge cases', () => {
    it('should handle text with quotes', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:1:user
    {
        float[2] position = [ 100.000000 100.000000 ]
        float[4] color = [ 0.000000 0.000000 0.000000 1.000000 ]
        float size = 0.16
        string text = "Say \\"Hello\\""
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      const shape = result.frames[0].shapes[0] as IText;
      expect(shape.text).toBe('Say "Hello"');
    });

    it('should handle multiple shapes on same frame', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 3
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 1
    }
    pen:1:1:user
    {
        float[4] color = [ 0.000000 1.000000 0.000000 1.000000 ]
        float width = 3
        float[2] points = [ 300.000000 300.000000 400.000000 400.000000 ]
        int frame = 1
    }
    text:2:1:user
    {
        float[2] position = [ 500.000000 500.000000 ]
        float[4] color = [ 0.000000 0.000000 1.000000 1.000000 ]
        float size = 0.20
        string text = "Label"
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 1000 });

      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].shapes).toHaveLength(3);
      expect(result.frames[0].shapes[0].type).toBe('curve');
      expect(result.frames[0].shapes[1].type).toBe('curve');
      expect(result.frames[0].shapes[2].type).toBe('text');
    });

    it('should handle missing color property', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(1);
      const shape = result.frames[0].shapes[0] as ICurve;
      expect(shape.strokeStyle).toBe('#000000'); // Default color
      expect(shape.opacity).toBe(1); // Default opacity
    });

    it('should handle missing lineWidth property', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(1);
      const shape = result.frames[0].shapes[0] as ICurve;
      expect(shape.lineWidth).toBe(2); // Default lineWidth
    });

    it('should skip text without content', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:1:user
    {
        float[2] position = [ 100.000000 100.000000 ]
        float[4] color = [ 0.000000 0.000000 0.000000 1.000000 ]
        float size = 0.16
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      // Should skip due to missing text content
      expect(result.frames).toHaveLength(0);
    });

    it('should skip text without position', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:1:user
    {
        float[4] color = [ 0.000000 0.000000 0.000000 1.000000 ]
        float size = 0.16
        string text = "Test"
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      // Should skip due to missing position
      expect(result.frames).toHaveLength(0);
    });

    it('should handle very large frame numbers', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:99999:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 99999
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].frame).toBe(99999);
    });

    it('should handle component ID mismatch with frame in component name', () => {
      // Component name has frame 5, but frame property says 10
      // The regex parses from component name, should use component name frame
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:5:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 100.000000 100.000000 200.000000 200.000000 ]
        int frame = 10
    }
}
`;
      const result = parseOpenRV(content, { width: 1000, height: 500 });

      expect(result.frames).toHaveLength(1);
      // Frame is parsed from component name "pen:0:5:user"
      expect(result.frames[0].frame).toBe(5);
    });

    it('should use dimensions from file when not provided in options', () => {
      const content = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/path/to/video.mp4"
    }
    request
    {
        int width = 800
        int height = 600
    }
}

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1.000000 0.000000 0.000000 1.000000 ]
        float width = 2
        float[2] points = [ 400.000000 300.000000 800.000000 600.000000 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content);

      expect(result.dimensions).toEqual({ width: 800, height: 600 });
      const shape = result.frames[0].shapes[0] as ICurve;
      // Points should be normalized based on 800x600 dimensions
      expect(shape.points[0].x).toBeCloseTo(0.5, 5);
      expect(shape.points[0].y).toBeCloseTo(0.5, 5);
    });
  });

  describe('round-trip: export then parse', () => {
    it('should preserve curve shapes through export/import', () => {
      const originalCurve: ICurve = {
        type: 'curve',
        points: [
          { x: 0.1, y: 0.2 },
          { x: 0.3, y: 0.4 },
          { x: 0.5, y: 0.6 },
        ],
        strokeStyle: '#ff0000',
        fillStyle: '#ff0000',
        lineWidth: 3,
        opacity: 0.9,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 5, fps: 25, version: 1, shapes: [originalCurve] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 500,
      });

      const parsed = parseOpenRV(exported, { width: 1000, height: 500, fps: 25 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].frame).toBe(5);

      const importedCurve = parsed.frames[0].shapes[0] as ICurve;
      expect(importedCurve.type).toBe('curve');
      expect(importedCurve.points).toHaveLength(3);

      // Check points are preserved (within floating point tolerance)
      expect(importedCurve.points[0].x).toBeCloseTo(0.1, 4);
      expect(importedCurve.points[0].y).toBeCloseTo(0.2, 4);
      expect(importedCurve.points[1].x).toBeCloseTo(0.3, 4);
      expect(importedCurve.points[1].y).toBeCloseTo(0.4, 4);

      // Check color and lineWidth
      expect(importedCurve.strokeStyle).toBe('#ff0000');
      expect(importedCurve.lineWidth).toBe(3);
      expect(importedCurve.opacity).toBeCloseTo(0.9, 4);
    });

    it('should preserve text shapes through export/import', () => {
      const originalText: IText = {
        type: 'text',
        x: 0.25,
        y: 0.5,
        text: 'Test annotation',
        strokeStyle: '#0000ff',
        fillStyle: '#0000ff',
        lineWidth: 2,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 10, fps: 30, version: 1, shapes: [originalText] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 800,
        height: 600,
      });

      const parsed = parseOpenRV(exported, { width: 800, height: 600, fps: 30 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].frame).toBe(10);

      const importedText = parsed.frames[0].shapes[0] as IText;
      expect(importedText.type).toBe('text');
      expect(importedText.x).toBeCloseTo(0.25, 4);
      expect(importedText.y).toBeCloseTo(0.5, 4);
      expect(importedText.text).toBe('Test annotation');
      expect(importedText.fillStyle).toBe('#0000ff');
    });

    it('should preserve multiple frames and shapes', () => {
      const curve1: ICurve = {
        type: 'curve',
        points: [{ x: 0.1, y: 0.1 }, { x: 0.2, y: 0.2 }],
        strokeStyle: '#ff0000',
        fillStyle: '#ff0000',
        lineWidth: 2,
      };

      const curve2: ICurve = {
        type: 'curve',
        points: [{ x: 0.5, y: 0.5 }, { x: 0.6, y: 0.6 }],
        strokeStyle: '#00ff00',
        fillStyle: '#00ff00',
        lineWidth: 4,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 25, version: 1, shapes: [curve1] },
        { frame: 10, fps: 25, version: 1, shapes: [curve2] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 1000,
      });

      const parsed = parseOpenRV(exported, { width: 1000, height: 1000, fps: 25 });

      expect(parsed.frames).toHaveLength(2);
      expect(parsed.frames[0].frame).toBe(1);
      expect(parsed.frames[1].frame).toBe(10);

      const shape1 = parsed.frames[0].shapes[0] as ICurve;
      expect(shape1.strokeStyle).toBe('#ff0000');

      const shape2 = parsed.frames[1].shapes[0] as ICurve;
      expect(shape2.strokeStyle).toBe('#00ff00');
    });

    it('should preserve line shapes through export/import (as curve)', () => {
      const originalLine: ILine = {
        type: 'line',
        x1: 0.1,
        y1: 0.2,
        x2: 0.8,
        y2: 0.9,
        strokeStyle: '#00ff00',
        fillStyle: '#00ff00',
        lineWidth: 4,
        opacity: 0.75,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 3, fps: 24, version: 1, shapes: [originalLine] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 800,
        height: 600,
      });

      const parsed = parseOpenRV(exported, { width: 800, height: 600, fps: 24 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].frame).toBe(3);

      // Line becomes a 2-point curve when imported
      const importedCurve = parsed.frames[0].shapes[0] as ICurve;
      expect(importedCurve.type).toBe('curve');
      expect(importedCurve.points).toHaveLength(2);

      // Check endpoints are preserved
      expect(importedCurve.points[0].x).toBeCloseTo(0.1, 4);
      expect(importedCurve.points[0].y).toBeCloseTo(0.2, 4);
      expect(importedCurve.points[1].x).toBeCloseTo(0.8, 4);
      expect(importedCurve.points[1].y).toBeCloseTo(0.9, 4);

      expect(importedCurve.strokeStyle).toBe('#00ff00');
      expect(importedCurve.lineWidth).toBe(4);
      expect(importedCurve.opacity).toBeCloseTo(0.75, 4);
    });

    it('should preserve arrow shapes through export/import (as 3 curves)', () => {
      const originalArrow: IArrow = {
        type: 'arrow',
        x1: 0.2,
        y1: 0.3,
        x2: 0.7,
        y2: 0.8,
        strokeStyle: '#0000ff',
        fillStyle: '#0000ff',
        lineWidth: 2,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 7, fps: 30, version: 1, shapes: [originalArrow] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 1000,
      });

      const parsed = parseOpenRV(exported, { width: 1000, height: 1000, fps: 30 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].frame).toBe(7);

      // Arrow becomes 3 curves (main line + 2 arrowhead lines)
      expect(parsed.frames[0].shapes).toHaveLength(3);

      // Main line
      const mainLine = parsed.frames[0].shapes[0] as ICurve;
      expect(mainLine.type).toBe('curve');
      expect(mainLine.points).toHaveLength(2);
      expect(mainLine.points[0].x).toBeCloseTo(0.2, 4);
      expect(mainLine.points[0].y).toBeCloseTo(0.3, 4);
      expect(mainLine.points[1].x).toBeCloseTo(0.7, 4);
      expect(mainLine.points[1].y).toBeCloseTo(0.8, 4);
      expect(mainLine.strokeStyle).toBe('#0000ff');

      // Arrowhead lines should start from the end point
      const arrowHead1 = parsed.frames[0].shapes[1] as ICurve;
      const arrowHead2 = parsed.frames[0].shapes[2] as ICurve;
      expect(arrowHead1.points[0].x).toBeCloseTo(0.7, 4);
      expect(arrowHead1.points[0].y).toBeCloseTo(0.8, 4);
      expect(arrowHead2.points[0].x).toBeCloseTo(0.7, 4);
      expect(arrowHead2.points[0].y).toBeCloseTo(0.8, 4);
    });

    it('should preserve rectangle shapes through export/import (as curve)', () => {
      const originalRect: IRectangle = {
        type: 'rectangle',
        x: 0.1,
        y: 0.2,
        width: 0.3,
        height: 0.4,
        strokeStyle: '#ffff00',
        fillStyle: '#ffff00',
        lineWidth: 3,
        opacity: 0.6,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 15, fps: 25, version: 1, shapes: [originalRect] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1920,
        height: 1080,
      });

      const parsed = parseOpenRV(exported, { width: 1920, height: 1080, fps: 25 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].frame).toBe(15);

      // Rectangle becomes a 5-point curve (closed path)
      const importedCurve = parsed.frames[0].shapes[0] as ICurve;
      expect(importedCurve.type).toBe('curve');
      expect(importedCurve.points).toHaveLength(5);

      // Check corner points
      expect(importedCurve.points[0].x).toBeCloseTo(0.1, 4); // Top-left
      expect(importedCurve.points[0].y).toBeCloseTo(0.2, 4);
      expect(importedCurve.points[1].x).toBeCloseTo(0.4, 4); // Top-right (x + width)
      expect(importedCurve.points[1].y).toBeCloseTo(0.2, 4);
      expect(importedCurve.points[2].x).toBeCloseTo(0.4, 4); // Bottom-right
      expect(importedCurve.points[2].y).toBeCloseTo(0.6, 4); // y + height
      expect(importedCurve.points[3].x).toBeCloseTo(0.1, 4); // Bottom-left
      expect(importedCurve.points[3].y).toBeCloseTo(0.6, 4);
      expect(importedCurve.points[4].x).toBeCloseTo(0.1, 4); // Back to top-left (closed)
      expect(importedCurve.points[4].y).toBeCloseTo(0.2, 4);

      expect(importedCurve.strokeStyle).toBe('#ffff00');
      expect(importedCurve.lineWidth).toBe(3);
      expect(importedCurve.opacity).toBeCloseTo(0.6, 4);
    });

    it('should preserve circle shapes through export/import (as polygon curve)', () => {
      const originalCircle: ICircle = {
        type: 'circle',
        x: 0.5,
        y: 0.5,
        radius: 0.2,
        strokeStyle: '#ff00ff',
        fillStyle: '#ff00ff',
        lineWidth: 2,
        opacity: 0.85,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 20, fps: 30, version: 1, shapes: [originalCircle] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 1000,
      });

      const parsed = parseOpenRV(exported, { width: 1000, height: 1000, fps: 30 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].frame).toBe(20);

      // Circle becomes a 33-point curve (32 segments + 1 to close)
      const importedCurve = parsed.frames[0].shapes[0] as ICurve;
      expect(importedCurve.type).toBe('curve');
      expect(importedCurve.points).toHaveLength(33);

      // Check that first and last points are close to the rightmost point (0 radians)
      expect(importedCurve.points[0].x).toBeCloseTo(0.7, 3); // x + radius at angle 0
      expect(importedCurve.points[0].y).toBeCloseTo(0.5, 3); // y at angle 0
      expect(importedCurve.points[32].x).toBeCloseTo(0.7, 3); // Same as first point
      expect(importedCurve.points[32].y).toBeCloseTo(0.5, 3);

      // Check the topmost point (90 degrees = PI/2)
      expect(importedCurve.points[8].x).toBeCloseTo(0.5, 2); // x at angle PI/2
      expect(importedCurve.points[8].y).toBeCloseTo(0.7, 2); // y + radius at angle PI/2

      expect(importedCurve.strokeStyle).toBe('#ff00ff');
      expect(importedCurve.lineWidth).toBe(2);
      expect(importedCurve.opacity).toBeCloseTo(0.85, 4);
    });

    it('should handle mixed shape types in round-trip', () => {
      const curve: ICurve = {
        type: 'curve',
        points: [{ x: 0.1, y: 0.1 }, { x: 0.2, y: 0.2 }],
        strokeStyle: '#ff0000',
        fillStyle: '#ff0000',
        lineWidth: 2,
      };

      const line: ILine = {
        type: 'line',
        x1: 0.3,
        y1: 0.3,
        x2: 0.4,
        y2: 0.4,
        strokeStyle: '#00ff00',
        fillStyle: '#00ff00',
        lineWidth: 3,
      };

      const text: IText = {
        type: 'text',
        x: 0.5,
        y: 0.5,
        text: 'Test Label',
        strokeStyle: '#0000ff',
        fillStyle: '#0000ff',
        lineWidth: 1,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 25, version: 1, shapes: [curve, line, text] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 1000,
      });

      const parsed = parseOpenRV(exported, { width: 1000, height: 1000, fps: 25 });

      expect(parsed.frames).toHaveLength(1);
      expect(parsed.frames[0].shapes).toHaveLength(3);

      // Curve
      expect(parsed.frames[0].shapes[0].type).toBe('curve');
      expect((parsed.frames[0].shapes[0] as ICurve).strokeStyle).toBe('#ff0000');

      // Line becomes curve
      expect(parsed.frames[0].shapes[1].type).toBe('curve');
      expect((parsed.frames[0].shapes[1] as ICurve).strokeStyle).toBe('#00ff00');

      // Text stays text
      expect(parsed.frames[0].shapes[2].type).toBe('text');
      expect((parsed.frames[0].shapes[2] as IText).text).toBe('Test Label');
      expect((parsed.frames[0].shapes[2] as IText).fillStyle).toBe('#0000ff');
    });

    it('should handle text with special characters in round-trip', () => {
      const text: IText = {
        type: 'text',
        x: 0.25,
        y: 0.25,
        text: 'Line1\nLine2 "quoted" text',
        strokeStyle: '#000000',
        fillStyle: '#000000',
        lineWidth: 1,
      };

      const frames: FrameAnnotationV1[] = [
        { frame: 1, fps: 25, version: 1, shapes: [text] },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 1000,
      });

      const parsed = parseOpenRV(exported, { width: 1000, height: 1000, fps: 25 });

      const importedText = parsed.frames[0].shapes[0] as IText;
      expect(importedText.type).toBe('text');
      expect(importedText.text).toBe('Line1\nLine2 "quoted" text');
    });
  });
});
