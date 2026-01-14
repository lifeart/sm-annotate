# Agent Guidelines

This document provides context for AI agents working on the sm-annotate project.

## Project Overview

sm-annotate is a professional frame-by-frame video annotation tool with zero dependencies. It supports various drawing tools (curve, rectangle, circle, line, arrow, text, eraser) and features like rotation, move/resize, and video comparison mode.

## Key Architecture

- **Core**: `src/core.ts` - Main SmAnnotate class and frame annotation types
- **Plugins**: `src/plugins/` - Drawing tools implemented as plugins (curve, line, arrow, rectangle, circle, text, eraser, move, selection, compare)
- **Exporters**: `src/exporters/` - Format converters (JSON, OpenRV)
- **Tests**: `tests/` - Vitest test files

## OpenRV Format Specification

The project supports import/export of annotations in OpenRV's GTO (Generic Transform Objects) text format.

### Reference Documentation

- **OpenRV Project**: https://github.com/AcademySoftwareFoundation/OpenRV
- **GTO File Format**: https://aswf-openrv.readthedocs.io/en/latest/rv-manuals/rv-gto.html
- **RVPaint Node**: https://aswf-openrv.readthedocs.io/en/latest/rv-manuals/rv-reference-manual.html
- **Mu Programming**: https://aswf-openrv.readthedocs.io/en/latest/rv-manuals/rv-mu-programming.html

### GTO Format Structure

```
GTOa (4)

ObjectName : Protocol (Version)
{
    component_name
    {
        type[dimensions] property = value
    }
}
```

### RVPaint Components

Annotations are stored in RVPaint nodes with components:

- **pen:ID:FRAME:user** - Freehand strokes and shapes
  - `float[4] color` - RGBA float array [r, g, b, a]
  - `float width` - Line width
  - `float[2] points` - Flat array of x,y coordinate pairs
  - `int frame` - Frame number
  - `byte brush` - Brush type (0 = solid)
  - `int splat` - Splat mode

- **text:ID:FRAME:user** - Text annotations
  - `float[2] position` - X,Y position
  - `float[4] color` - RGBA float array
  - `float size` - Font size as percentage
  - `string text` - Text content
  - `int frame` - Frame number

### Shape Mapping

| sm-annotate Shape | OpenRV Export |
|-------------------|---------------|
| curve | pen stroke (n points) |
| line | pen stroke (2 points) |
| arrow | 3 pen strokes (line + arrowhead) |
| rectangle | pen stroke (5 points, closed) |
| circle | pen stroke (33 points polygon) |
| text | text component |

### Coordinate System

- sm-annotate uses normalized coordinates (0-1)
- OpenRV uses pixel coordinates
- Export: multiply by canvas width/height
- Import: divide by canvas width/height

### Rotation Handling

- Rotation is "baked in" to exported coordinates
- Custom rotation centers are supported
- Text rotation only affects anchor position (OpenRV limitation)

## Code Style

- TypeScript with strict typing
- No external runtime dependencies
- Plugin-based architecture
- Normalized coordinates (0-1) for all shapes
- Canvas-based rendering

## Testing

- Framework: Vitest
- Run tests: `npm test`
- Run with coverage: `npm run test:coverage`
- 440+ tests covering all functionality

## Build

- Bundler: esbuild
- Target: ES2015
- Output: `dist/index.js` (ESM)
- Demo: `demo/index.js`
