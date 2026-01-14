# AnnotationTool

The `AnnotationTool` class provides a feature-rich video and image annotation tool.

## Public API

### Properties

- `selectedColor: string`: The currently selected color for annotations.
- `selectedStrokeSize: number`: The currently selected stroke size for annotations.
- `currentTool: Tool | null`: The currently active tool for annotations.

### Constructor

- `constructor(videoElement: HTMLVideoElement | HTMLImageElement)`: Creates a new instance of the `AnnotationTool` class with the given `videoElement`.

### Methods

- `enableFrameRateDetection()`: Enables frame rate detection for the video element.
- `hide()`: Hides the annotation tool.
- `showControls()`: Shows the annotation tool controls.
- `hideControls()`: Hides the annotation tool controls.
- `showCanvas()`: Shows the canvas for annotations.
- `hideCanvas()`: Hides the canvas for annotations.
- `show()`: Shows the annotation tool and its controls.
- `destroy()`: Destroys the annotation tool and cleans up resources.
- `saveCurrentFrame(): FrameAnnotationV1`: Saves the current frame data.
- `loadAllFrames(frames: FrameAnnotationV1[])`: Loads all frame data from the given array.
- `saveAllFrames(): FrameAnnotationV1[]`: Saves all frame data and returns it as an array.
- `playAnnotationsAsVideo()`: Plays the annotations as a video.
- `stopAnnotationsAsVideo()`: Stops playing the annotations as a video.


## Usage

1. Import the `AnnotationTool` class.
2. Create a new instance of the `AnnotationTool` class with the desired video element.
3. Enable frame rate detection if necessary.
4. Show or hide the annotation tool and its controls as needed.
5. Use the `saveCurrentFrame`, `loadAllFrames`, and `saveAllFrames` methods to save and load frame data.
6. Use the `playAnnotationsAsVideo` and `stopAnnotationsAsVideo` methods to play and stop the annotations as a video.

---

# OpenRV Import/Export

sm-annotate supports importing and exporting annotations in OpenRV's GTO text format (`.rv` files). This allows for seamless integration with the OpenRV media player.

## Exporting to OpenRV

### Functions

- `exportToOpenRV(frames: FrameAnnotationV1[], options: OpenRVExportOptions): string`

  Converts annotation frames to OpenRV GTO text format.

- `downloadAsOpenRV(frames: FrameAnnotationV1[], options: OpenRVExportOptions, filename?: string): void`

  Downloads annotations as an OpenRV `.rv` file.

### OpenRVExportOptions

```typescript
interface OpenRVExportOptions {
  mediaPath: string;      // Path to the media file
  width: number;          // Media width in pixels
  height: number;         // Media height in pixels
  sessionName?: string;   // Optional session name (default: 'sm-annotate-session')
}
```

### Example

```typescript
import { exportToOpenRV, downloadAsOpenRV } from '@lifeart/sm-annotate/exporters';

const frames = annotationTool.saveAllFrames();

// Export to string
const rvContent = exportToOpenRV(frames, {
  mediaPath: '/path/to/video.mp4',
  width: 1920,
  height: 1080,
});

// Or download directly
downloadAsOpenRV(frames, {
  mediaPath: '/path/to/video.mp4',
  width: 1920,
  height: 1080,
}, 'annotations.rv');
```

## Importing from OpenRV

### Functions

- `parseOpenRV(content: string, options?: { width?: number; height?: number; fps?: number }): ParsedOpenRVResult`

  Parses OpenRV GTO text content and returns annotation frames.

- `parseOpenRVFile(file: File, options?: { width?: number; height?: number; fps?: number }): Promise<ParsedOpenRVResult>`

  Parses an OpenRV file and returns annotation frames.

### ParsedOpenRVResult

```typescript
interface ParsedOpenRVResult {
  frames: FrameAnnotationV1[];  // Parsed annotation frames
  mediaPath: string | null;      // Extracted media path (if available)
  dimensions: {                  // Detected or provided dimensions
    width: number;
    height: number;
  };
}
```

### Example

```typescript
import { parseOpenRV, parseOpenRVFile } from '@lifeart/sm-annotate/exporters';

// Parse from string
const rvContent = `GTOa (4)
...
`;
const result = parseOpenRV(rvContent, { width: 1920, height: 1080, fps: 24 });
annotationTool.loadAllFrames(result.frames);

// Or parse from file
const file = document.querySelector('input[type="file"]').files[0];
const result = await parseOpenRVFile(file, { width: 1920, height: 1080, fps: 24 });
annotationTool.loadAllFrames(result.frames);
```

## Supported Features

### Shapes

| Shape Type | Export | Import | Notes |
|------------|--------|--------|-------|
| Curve/Pen  | ✅ | ✅ | Exported as pen strokes |
| Line       | ✅ | ✅ | Converted to 2-point curve |
| Arrow      | ✅ | ✅ | Exported as 3 pen strokes (line + arrowhead) |
| Rectangle  | ✅ | ✅ | Exported as 5-point closed curve |
| Circle     | ✅ | ✅ | Approximated as 33-point polygon |
| Text       | ✅ | ✅ | Full text support with positioning |

### Properties

| Property | Export | Import | Notes |
|----------|--------|--------|-------|
| Color    | ✅ | ✅ | Hex/RGB/RGBA supported |
| Opacity  | ✅ | ✅ | Alpha channel preserved |
| Line Width | ✅ | ✅ | Per-point width array |
| Rotation | ✅ | ✅ | Applied to point coordinates |

## OpenRV Format Structure

The exported format follows OpenRV's GTO text format specification:

```
GTOa (4)

# Generated by sm-annotate OpenRV exporter

RVSession : RVSession (4)
{
    session
    {
        string name = "sm-annotate-session"
        int version = 4
    }
}

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

sourceGroup000000_paint : RVPaint (3)
{
    paint
    {
        int nextId = 1
        int nextAnnotationId = 0
        int show = 1
        string exclude = [ ]
        string include = [ ]
    }
    "pen:0:1:User"
    {
        float[4] color = [ [ 1 0 0 1 ] ]
        float width = [ 2 2 ]
        string brush = "circle"
        float[2] points = [ [ 100 100 ] [ 200 200 ] ]
        int debug = 0
        int join = 3
        int cap = 1
        int splat = 0
    }
    "frame:1"
    {
        string order = [ "pen:0:1:User" ]
    }
}
```

## Round-Trip Conversion

The importer and exporter are designed to support round-trip conversion:

```typescript
// Parse existing .rv file
const parsed = parseOpenRV(originalRvContent, { width: 1920, height: 1080, fps: 24 });

// Load into annotation tool
annotationTool.loadAllFrames(parsed.frames);

// Make modifications...

// Export back to .rv format
const newRvContent = exportToOpenRV(annotationTool.saveAllFrames(), {
  mediaPath: parsed.mediaPath || '/video.mp4',
  width: 1920,
  height: 1080,
});
```

Note: Component IDs may change during re-export, but all shape data and properties are preserved.
