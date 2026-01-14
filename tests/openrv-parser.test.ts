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
      // OpenRV uses NDC: X and Y both range -1 to +1 (center origin)
      // OpenRV point (-0.8, 0.8) should convert to sm-annotate (0.1, 0.1):
      //   sm_x = (-0.8 + 1) / 2 = 0.1
      //   sm_y = (1 - 0.8) / 2 = 0.1
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
        float width = 0.006
        float[2] points = [ -0.8 0.8 0 0 ]
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
      // OpenRV (-0.8, 0.8) -> sm-annotate (0.1, 0.1)
      expect(shape.points[0].x).toBeCloseTo(0.1, 5);
      expect(shape.points[0].y).toBeCloseTo(0.1, 5);
      // OpenRV (0, 0) -> sm-annotate (0.5, 0.5)
      expect(shape.points[1].x).toBeCloseTo(0.5, 5);
      expect(shape.points[1].y).toBeCloseTo(0.5, 5);
      expect(shape.strokeStyle).toBe('#ff0000');
      // lineWidth = 0.006 * 500 = 3
      expect(shape.lineWidth).toBe(3);
      expect(shape.opacity).toBeCloseTo(0.8, 5);
    });

    it('should parse text component', () => {
      // OpenRV uses NDC: X and Y both range -1 to +1 (center origin)
      // To get sm-annotate (0.1, 0.4):
      //   0.1 = (openrv_x + 1) / 2 => openrv_x = -0.8
      //   0.4 = (1 - openrv_y) / 2 => openrv_y = 0.2
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:10:user
    {
        float[2] position = [ -0.8 0.2 ]
        float[4] color = [ 0.000000 0.000000 0.000000 1.000000 ]
        float size = 0.033
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
      // OpenRV (-0.8, 0.2) -> sm-annotate (0.1, 0.4)
      expect(shape.x).toBeCloseTo(0.1, 5);
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
      // Default dimensions are 1920x1080
      // OpenRV uses -1 to +1 for both X and Y (center origin)
      // OpenRV (0, 0) -> sm-annotate (0.5, 0.5)
      // OpenRV (1, 1) -> sm-annotate (1, 0) (top-right)
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
        float width = 0.00185
        float[2] points = [ 0 0 1 1 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content);

      const shape = result.frames[0].shapes[0] as ICurve;
      // Default dimensions 1920x1080
      // OpenRV (0, 0) -> sm-annotate (0.5, 0.5)
      expect(shape.points[0].x).toBeCloseTo(0.5, 5);
      expect(shape.points[0].y).toBeCloseTo(0.5, 5);
      // OpenRV (1, 1) -> sm-annotate (1, 0) top-right
      // sm_y = (1 - 1) / 2 = 0
      expect(shape.points[1].x).toBeCloseTo(1, 4);
      expect(shape.points[1].y).toBeCloseTo(0, 4);
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
      // For 800x600 dimensions (aspectRatio = 1.333)
      // OpenRV (0, 0) should convert to sm-annotate (0.5, 0.5)
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
        float width = 0.00333
        float[2] points = [ 0 0 1.333 1 ]
        int frame = 1
    }
}
`;
      const result = parseOpenRV(content);

      expect(result.dimensions).toEqual({ width: 800, height: 600 });
      const shape = result.frames[0].shapes[0] as ICurve;
      // OpenRV (0, 0) -> sm-annotate (0.5, 0.5)
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
      expect(importedCurve.lineWidth).toBeCloseTo(4, 4);
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
      expect(importedCurve.lineWidth).toBeCloseTo(3, 4);
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

  describe('full round-trip: parse → export → parse', () => {
    it('should preserve data through full round-trip with real OpenRV format', () => {
      // Real OpenRV format input
      const originalContent = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/path/to/video.mp4"
    }
    proxy
    {
        int[2] size = [ [ 1280 536 ] ]
    }
}

defaultSequence_p_sourceGroup000000 : RVPaint (3)
{
    paint
    {
        int nextId = 3
    }

    "pen:1:15:User"
    {
        float[4] color = [ [ 1 0 0 1 ] ]
        float width = [ 5 5 5 5 5 ]
        string brush = "circle"
        float[2] points = [ [ 100 100 ] [ 200 150 ] [ 300 200 ] [ 400 250 ] [ 500 300 ] ]
        int debug = 0
        int join = 3
        int cap = 1
        int splat = 0
    }

    "text:2:10:User"
    {
        float[2] position = [ [ 640 268 ] ]
        float[4] color = [ [ 0 1 0 1 ] ]
        float spacing = 0.8
        float size = 0.05
        float scale = 1
        float rotation = 0
        string font = ""
        string text = "Hello OpenRV"
        string origin = ""
        int debug = 0
    }

    "frame:15"
    {
        string order = [ "pen:1:15:User" ]
    }

    "frame:10"
    {
        string order = [ "text:2:10:User" ]
    }
}
`;

      const dimensions = { width: 1280, height: 536, fps: 24 };

      // Step 1: Parse the original OpenRV content
      const parsed1 = parseOpenRV(originalContent, dimensions);

      expect(parsed1.frames.length).toBe(2);

      // Find frame 15 with pen stroke
      const frame15 = parsed1.frames.find(f => f.frame === 15);
      expect(frame15).toBeDefined();
      expect(frame15!.shapes.length).toBe(1);
      const pen1 = frame15!.shapes[0] as ICurve;
      expect(pen1.type).toBe('curve');
      expect(pen1.points.length).toBe(5);
      expect(pen1.strokeStyle).toBe('#ff0000'); // Red

      // Find frame 10 with text
      const frame10 = parsed1.frames.find(f => f.frame === 10);
      expect(frame10).toBeDefined();
      expect(frame10!.shapes.length).toBe(1);
      const text1 = frame10!.shapes[0] as IText;
      expect(text1.type).toBe('text');
      expect(text1.text).toBe('Hello OpenRV');

      // Step 2: Export to OpenRV format
      const exported = exportToOpenRV(parsed1.frames, {
        mediaPath: '/path/to/video.mp4',
        width: 1280,
        height: 536,
      });

      // Verify the exported format has the correct structure
      expect(exported).toContain('GTOa (4)');
      // IDs are assigned in export order - text on frame 10 comes first, then pen on frame 15
      expect(exported).toContain('"text:0:10:User"');
      expect(exported).toContain('"pen:1:15:User"');
      expect(exported).toContain('float[4] color = [ [');
      expect(exported).toContain('float width = [');
      expect(exported).toContain('string brush = "circle"');
      expect(exported).toContain('float[2] points = [ [');
      expect(exported).toContain('"frame:15"');
      expect(exported).toContain('"frame:10"');

      // Step 3: Parse the exported content
      const parsed2 = parseOpenRV(exported, dimensions);

      expect(parsed2.frames.length).toBe(2);

      // Verify frame 15 data is preserved
      const frame15_2 = parsed2.frames.find(f => f.frame === 15);
      expect(frame15_2).toBeDefined();
      expect(frame15_2!.shapes.length).toBe(1);
      const pen2 = frame15_2!.shapes[0] as ICurve;
      expect(pen2.type).toBe('curve');
      expect(pen2.points.length).toBe(5);
      expect(pen2.strokeStyle).toBe('#ff0000');

      // Verify points are approximately the same (normalized)
      for (let i = 0; i < pen1.points.length; i++) {
        expect(pen2.points[i].x).toBeCloseTo(pen1.points[i].x, 3);
        expect(pen2.points[i].y).toBeCloseTo(pen1.points[i].y, 3);
      }

      // Verify frame 10 text is preserved
      const frame10_2 = parsed2.frames.find(f => f.frame === 10);
      expect(frame10_2).toBeDefined();
      const text2 = frame10_2!.shapes[0] as IText;
      expect(text2.type).toBe('text');
      expect(text2.text).toBe('Hello OpenRV');
    });

    it('should handle multiple shapes per frame in round-trip', () => {
      const originalContent = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/test.mp4"
    }
    proxy
    {
        int[2] size = [ [ 1000 1000 ] ]
    }
}

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 3
    }

    "pen:0:5:User"
    {
        float[4] color = [ [ 1 0 0 1 ] ]
        float width = [ 2 2 ]
        string brush = "circle"
        float[2] points = [ [ 100 100 ] [ 200 200 ] ]
        int debug = 0
    }

    "pen:1:5:User"
    {
        float[4] color = [ [ 0 1 0 1 ] ]
        float width = [ 3 3 3 ]
        string brush = "circle"
        float[2] points = [ [ 300 300 ] [ 400 400 ] [ 500 500 ] ]
        int debug = 0
    }

    "text:2:5:User"
    {
        float[2] position = [ [ 600 600 ] ]
        float[4] color = [ [ 0 0 1 1 ] ]
        float spacing = 0.8
        float size = 0.03
        string text = "Label"
        int debug = 0
    }

    "frame:5"
    {
        string order = [ "pen:0:5:User" "pen:1:5:User" "text:2:5:User" ]
    }
}
`;

      const dimensions = { width: 1000, height: 1000, fps: 30 };

      // Parse
      const parsed1 = parseOpenRV(originalContent, dimensions);
      expect(parsed1.frames.length).toBe(1);
      expect(parsed1.frames[0].shapes.length).toBe(3);

      // Export
      const exported = exportToOpenRV(parsed1.frames, {
        mediaPath: '/test.mp4',
        width: 1000,
        height: 1000,
      });

      // Parse again
      const parsed2 = parseOpenRV(exported, dimensions);
      expect(parsed2.frames.length).toBe(1);
      expect(parsed2.frames[0].shapes.length).toBe(3);

      // Verify shape types and colors are preserved
      expect(parsed2.frames[0].shapes[0].type).toBe('curve');
      expect((parsed2.frames[0].shapes[0] as ICurve).strokeStyle).toBe('#ff0000');

      expect(parsed2.frames[0].shapes[1].type).toBe('curve');
      expect((parsed2.frames[0].shapes[1] as ICurve).strokeStyle).toBe('#00ff00');

      expect(parsed2.frames[0].shapes[2].type).toBe('text');
      expect((parsed2.frames[0].shapes[2] as IText).text).toBe('Label');
    });

    it('should verify exported format matches OpenRV structure', () => {
      const frames: FrameAnnotationV1[] = [
        {
          frame: 1,
          fps: 24,
          version: 1,
          shapes: [
            {
              type: 'curve',
              points: [{ x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }],
              strokeStyle: '#ff0000',
              fillStyle: '#ff0000',
              lineWidth: 5,
              opacity: 0.8,
            } as ICurve,
          ],
        },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/video.mp4',
        width: 1000,
        height: 1000,
      });

      // Verify OpenRV format structure elements
      // Header
      expect(exported).toContain('GTOa (4)');
      expect(exported).toContain('# Generated by sm-annotate');

      // Session
      expect(exported).toContain('RVSession : RVSession (4)');

      // Source
      expect(exported).toContain('sourceGroup000000_source : RVFileSource (1)');
      expect(exported).toContain('string movie = "/video.mp4"');

      // Paint node
      expect(exported).toContain('sourceGroup000000_paint : RVPaint (3)');
      expect(exported).toContain('int nextId =');
      expect(exported).toContain('int nextAnnotationId = 0');
      expect(exported).toContain('int show = 1');

      // Quoted component names
      expect(exported).toMatch(/"pen:\d+:\d+:User"/);
      expect(exported).toMatch(/"frame:\d+"/);

      // Nested array format for color
      expect(exported).toMatch(/float\[4\] color = \[ \[/);

      // Array format for width
      expect(exported).toMatch(/float width = \[/);

      // Brush as string
      expect(exported).toContain('string brush = "circle"');

      // Nested array format for points
      expect(exported).toMatch(/float\[2\] points = \[ \[/);

      // Additional pen properties
      expect(exported).toContain('int debug = 0');
      expect(exported).toContain('int join = 3');
      expect(exported).toContain('int cap = 1');
      expect(exported).toContain('int splat = 0');

      // Frame order with quoted names
      expect(exported).toMatch(/string order = \[ "pen:\d+:\d+:User"/);
    });

    it('should preserve opacity through round-trip', () => {
      const frames: FrameAnnotationV1[] = [
        {
          frame: 1,
          fps: 24,
          version: 1,
          shapes: [
            {
              type: 'curve',
              points: [{ x: 0.5, y: 0.5 }, { x: 0.6, y: 0.6 }],
              strokeStyle: '#ff0000',
              fillStyle: '#ff0000',
              lineWidth: 2,
              opacity: 0.5,
            } as ICurve,
          ],
        },
      ];

      const exported = exportToOpenRV(frames, {
        mediaPath: '/video.mp4',
        width: 1000,
        height: 1000,
      });

      // Check the color has alpha 0.5
      expect(exported).toContain('0.5');

      const parsed = parseOpenRV(exported, { width: 1000, height: 1000, fps: 24 });
      const shape = parsed.frames[0].shapes[0] as ICurve;
      expect(shape.opacity).toBeCloseTo(0.5, 2);
    });
  });

  describe('parsing real OpenRV format', () => {
    it('should parse OpenRV format with quoted component names and nested arrays', () => {
      // This tests the actual format used by OpenRV with:
      // - Quoted component names like "pen:1:15:User"
      // - Nested array format for points: [ [ x1 y1 ] [ x2 y2 ] ]
      // - Width as an array (one per point)
      // - brush as a string
      const content = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/path/to/video.mp4"
    }
    request
    {
        int width = 1280
        int height = 536
    }
    proxy
    {
        int[2] size = [ [ 1280 536 ] ]
    }
}

defaultSequence_p_sourceGroup000000 : RVPaint (3)
{
    paint
    {
        int nextId = 7
        int nextAnnotationId = 0
        int show = 1
        string exclude = [ ]
        string include = [ ]
    }

    "pen:1:15:User"
    {
        float[4] color = [ [ 1 1 1 1 ] ]
        float width = [ 0.01 0.01 0.01 0.01 0.01 ]
        string brush = "circle"
        float[2] points = [ [ 0.183036849 0.253820688 ] [ 0.158727273 0.233801052 ] [ 0.075788781 0.173742011 ] [ 0.0529091358 0.116543047 ] [ 0.0514791943 0.0750737488 ] ]
        int debug = 0
        int join = 3
        int cap = 1
        int splat = 0
    }

    "pen:3:5:User"
    {
        float[4] color = [ [ 1 0 0.833 1 ] ]
        float width = [ 0.01 0.01 ]
        string brush = "circle"
        float[2] points = [ [ -0.373 0.125 ] [ -0.371 0.125 ] ]
        int debug = 0
        int join = 3
        int cap = 1
        int splat = 0
    }

    "text:6:1:User"
    {
        float[2] position = [ [ -0.979533434 0.291000068 ] ]
        float[4] color = [ [ 1 1 1 1 ] ]
        float spacing = 0.800000012
        float size = 0.00999999978
        float scale = 1
        float rotation = 0
        string font = ""
        string text = "text eng"
        string origin = ""
        int debug = 0
    }

    "frame:15"
    {
        string order = [ "pen:1:15:User" ]
    }

    "frame:5"
    {
        string order = [ "pen:3:5:User" ]
    }

    "frame:1"
    {
        string order = "text:6:1:User"
    }
}
`;

      const parsed = parseOpenRV(content, { width: 1280, height: 536, fps: 24 });

      // Should have 3 frames: 1, 5, and 15
      expect(parsed.frames.length).toBe(3);

      // Find frame 15
      const frame15 = parsed.frames.find(f => f.frame === 15);
      expect(frame15).toBeDefined();
      expect(frame15!.shapes.length).toBe(1);
      expect(frame15!.shapes[0].type).toBe('curve');
      const pen1 = frame15!.shapes[0] as ICurve;
      expect(pen1.points.length).toBe(5);
      expect(pen1.strokeStyle).toBe('#ffffff'); // White color

      // Find frame 5
      const frame5 = parsed.frames.find(f => f.frame === 5);
      expect(frame5).toBeDefined();
      expect(frame5!.shapes.length).toBe(1);
      expect(frame5!.shapes[0].type).toBe('curve');
      const pen3 = frame5!.shapes[0] as ICurve;
      expect(pen3.points.length).toBe(2);

      // Find frame 1 with text
      const frame1 = parsed.frames.find(f => f.frame === 1);
      expect(frame1).toBeDefined();
      expect(frame1!.shapes.length).toBe(1);
      expect(frame1!.shapes[0].type).toBe('text');
      const text = frame1!.shapes[0] as IText;
      expect(text.text).toBe('text eng');
    });

    it('should handle width as array and use first value for lineWidth', () => {
      // Width in OpenRV is normalized relative to height
      // To get lineWidth=5.5, normalized width should be 5.5/1000 = 0.0055
      const content = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/test.mp4"
    }
    proxy
    {
        int[2] size = [ [ 1000 1000 ] ]
    }
}

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }

    "pen:0:1:User"
    {
        float[4] color = [ [ 1 0 0 1 ] ]
        float width = [ 0.0055 0.0055 0.0055 ]
        string brush = "circle"
        float[2] points = [ [ -0.5 0.5 ] [ 0 0 ] [ 0.5 -0.5 ] ]
        int debug = 0
    }
}
`;

      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      // lineWidth = 0.0055 * 1000 = 5.5
      expect(shape.lineWidth).toBeCloseTo(5.5, 4);
    });

    it('should parse annotations from multiple RVPaint blocks', () => {
      // Real OpenRV files can have multiple RVPaint blocks (e.g., defaultLayout_paint
      // and defaultSequence_p_sourceGroup000000). Annotations may be in any of them.
      const content = `GTOa (4)

sourceGroup000000_source : RVFileSource (1)
{
    media
    {
        string movie = "/test.mp4"
    }
    request
    {
        int width = 1000
        int height = 1000
    }
}

defaultLayout_paint : RVPaint (3)
{
    paint
    {
        int nextId = 0
        int show = 1
    }
}

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }

    "pen:0:1:User"
    {
        float[4] color = [ [ 1 0 0 1 ] ]
        float width = [ 0.002 0.002 ]
        string brush = "circle"
        float[2] points = [ [ 0 0 ] [ 0.5 0.5 ] ]
        int debug = 0
    }

    "frame:1"
    {
        string order = [ "pen:0:1:User" ]
    }
}

defaultSequence_p_sourceGroup000000 : RVPaint (3)
{
    paint
    {
        int nextId = 2
    }

    "pen:1:5:User"
    {
        float[4] color = [ [ 0 1 0 1 ] ]
        float width = [ 0.003 0.003 ]
        string brush = "circle"
        float[2] points = [ [ -0.5 -0.5 ] [ 0.5 0.5 ] ]
        int debug = 0
    }

    "text:2:10:User"
    {
        float[2] position = [ [ 0 0 ] ]
        float[4] color = [ [ 0 0 1 1 ] ]
        float size = 0.02
        string text = "Label"
        int debug = 0
    }

    "frame:5"
    {
        string order = [ "pen:1:5:User" ]
    }

    "frame:10"
    {
        string order = [ "text:2:10:User" ]
    }
}
`;

      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      // Should find annotations from both sourceGroup000000_paint and defaultSequence_p_sourceGroup000000
      expect(parsed.frames.length).toBe(3);

      // Frame 1 from sourceGroup000000_paint
      const frame1 = parsed.frames.find(f => f.frame === 1);
      expect(frame1).toBeDefined();
      expect(frame1!.shapes.length).toBe(1);
      expect(frame1!.shapes[0].type).toBe('curve');
      expect((frame1!.shapes[0] as ICurve).strokeStyle).toBe('#ff0000');

      // Frame 5 from defaultSequence_p_sourceGroup000000
      const frame5 = parsed.frames.find(f => f.frame === 5);
      expect(frame5).toBeDefined();
      expect(frame5!.shapes.length).toBe(1);
      expect(frame5!.shapes[0].type).toBe('curve');
      expect((frame5!.shapes[0] as ICurve).strokeStyle).toBe('#00ff00');

      // Frame 10 with text from defaultSequence_p_sourceGroup000000
      const frame10 = parsed.frames.find(f => f.frame === 10);
      expect(frame10).toBeDefined();
      expect(frame10!.shapes.length).toBe(1);
      expect(frame10!.shapes[0].type).toBe('text');
      expect((frame10!.shapes[0] as IText).text).toBe('Label');
    });

    it('should skip empty RVPaint blocks and find annotations in later blocks', () => {
      // This simulates the real test_session.rv format where the first RVPaint block
      // may be empty and annotations are in subsequent blocks
      const content = `GTOa (4)

defaultLayout_paint : RVPaint (3)
{
    paint
    {
        int nextId = 0
        int show = 1
    }
}

defaultStack_paint : RVPaint (3)
{
    paint
    {
        int nextId = 0
        int show = 1
    }
}

actualAnnotations_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }

    "pen:0:1:User"
    {
        float[4] color = [ [ 1 1 1 1 ] ]
        float width = [ 0.005 0.005 ]
        string brush = "circle"
        float[2] points = [ [ 0 0 ] [ 0.5 0.5 ] ]
        int debug = 0
    }
}
`;

      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      // Should find the annotation from the third RVPaint block
      expect(parsed.frames.length).toBe(1);
      expect(parsed.frames[0].frame).toBe(1);
      expect(parsed.frames[0].shapes[0].type).toBe('curve');
    });
  });

  describe('coordinate conversion with various aspect ratios', () => {
    it('should correctly convert coordinates for ultrawide aspect ratio (21:9)', () => {
      // OpenRV uses -1 to +1 for both X and Y (no aspect ratio scaling in stored coordinates)
      const width = 2560;
      const height = 1080;

      // OpenRV center (0, 0) should map to sm-annotate (0.5, 0.5)
      // OpenRV (1, 1) -> (1, 0) top-right
      // OpenRV (-1, -1) -> (0, 1) bottom-left
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1 0 0 1 ]
        float width = 0.002
        float[2] points = [ 0 0 1 1 -1 -1 ]
        int frame = 1
    }
}
`;

      const parsed = parseOpenRV(content, { width, height, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      expect(shape.points.length).toBe(3);

      // OpenRV (0, 0) -> sm-annotate (0.5, 0.5)
      expect(shape.points[0].x).toBeCloseTo(0.5, 4);
      expect(shape.points[0].y).toBeCloseTo(0.5, 4);

      // OpenRV (1, 1) -> sm-annotate (1, 0) top-right
      expect(shape.points[1].x).toBeCloseTo(1, 4);
      expect(shape.points[1].y).toBeCloseTo(0, 4);

      // OpenRV (-1, -1) -> sm-annotate (0, 1) bottom-left
      expect(shape.points[2].x).toBeCloseTo(0, 4);
      expect(shape.points[2].y).toBeCloseTo(1, 4);
    });

    it('should correctly convert coordinates for portrait aspect ratio (9:16)', () => {
      // OpenRV uses -1 to +1 for both X and Y (no aspect ratio scaling in stored coordinates)
      const width = 1080;
      const height = 1920;

      // OpenRV point (-1, 1) maps to sm-annotate (0, 0) (top-left)
      // OpenRV point (1, -1) maps to sm-annotate (1, 1) (bottom-right)
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 0 1 0 1 ]
        float width = 0.001
        float[2] points = [ -1 1 1 -1 ]
        int frame = 1
    }
}
`;

      const parsed = parseOpenRV(content, { width, height, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      expect(shape.points.length).toBe(2);

      // OpenRV (-1, 1) -> sm-annotate (0, 0) (top-left)
      expect(shape.points[0].x).toBeCloseTo(0, 4);
      expect(shape.points[0].y).toBeCloseTo(0, 4);

      // OpenRV (1, -1) -> sm-annotate (1, 1) (bottom-right)
      expect(shape.points[1].x).toBeCloseTo(1, 4);
      expect(shape.points[1].y).toBeCloseTo(1, 4);
    });

    it('should correctly convert coordinates for square aspect ratio (1:1)', () => {
      const width = 1000;
      const height = 1000;

      // For square: aspectRatio = 1, so OpenRV X ranges from -1 to 1
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 0 0 1 1 ]
        float width = 0.002
        float[2] points = [ -1 1 1 -1 ]
        int frame = 1
    }
}
`;

      const parsed = parseOpenRV(content, { width, height, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      expect(shape.points.length).toBe(2);

      // OpenRV (-1, 1) -> sm-annotate (0, 0) (top-left)
      expect(shape.points[0].x).toBeCloseTo(0, 4);
      expect(shape.points[0].y).toBeCloseTo(0, 4);

      // OpenRV (1, -1) -> sm-annotate (1, 1) (bottom-right)
      expect(shape.points[1].x).toBeCloseTo(1, 4);
      expect(shape.points[1].y).toBeCloseTo(1, 4);
    });

    it('should correctly convert text position for various aspect ratios', () => {
      const width = 1920;
      const height = 1080;
      const aspectRatio = width / height;

      // OpenRV center (0, 0) should map to sm-annotate (0.5, 0.5)
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    text:0:1:user
    {
        float[2] position = [ 0 0 ]
        float[4] color = [ 1 1 1 1 ]
        float size = 0.02
        string text = "Center"
        int frame = 1
    }
}
`;

      const parsed = parseOpenRV(content, { width, height, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as IText;
      expect(shape.type).toBe('text');

      // OpenRV (0, 0) -> sm-annotate (0.5, 0.5)
      expect(shape.x).toBeCloseTo(0.5, 4);
      expect(shape.y).toBeCloseTo(0.5, 4);
    });
  });

  describe('width array handling edge cases', () => {
    it('should handle width as a single scalar value', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1 0 0 1 ]
        float width = 0.004
        float[2] points = [ 0 0 0.5 0.5 ]
        int frame = 1
    }
}
`;

      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      // lineWidth = 0.004 * 1000 = 4
      expect(shape.lineWidth).toBe(4);
    });

    it('should handle empty width array and use default', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1 0 0 1 ]
        float width = [ ]
        float[2] points = [ 0 0 0.5 0.5 ]
        int frame = 1
    }
}
`;

      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      // Should use default lineWidth of 2
      expect(shape.lineWidth).toBe(2);
    });

    it('should clamp very large width values to maximum', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1 0 0 1 ]
        float width = 0.1
        float[2] points = [ 0 0 0.5 0.5 ]
        int frame = 1
    }
}
`;

      // width = 0.1 * 1000 = 100, should be clamped to 50
      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      expect(shape.lineWidth).toBe(50);
    });

    it('should clamp very small width values to minimum', () => {
      const content = `GTOa (4)

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
    }
    pen:0:1:user
    {
        float[4] color = [ 1 0 0 1 ]
        float width = 0.0001
        float[2] points = [ 0 0 0.5 0.5 ]
        int frame = 1
    }
}
`;

      // width = 0.0001 * 1000 = 0.1, should be clamped to 1
      const parsed = parseOpenRV(content, { width: 1000, height: 1000, fps: 24 });

      expect(parsed.frames.length).toBe(1);
      const shape = parsed.frames[0].shapes[0] as ICurve;
      expect(shape.lineWidth).toBe(1);
    });
  });
});
