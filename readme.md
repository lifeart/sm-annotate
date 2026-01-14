# Video and Image Annotation Tool

This project provides an annotation tool for HTML video and image elements. The tool allows users to draw and annotate over video and images using various drawing tools, including curves, rectangles, ellipses, lines, arrows, and texts. Users can also customize the color and stroke size of their annotations.

Demo: [lifeart.github.io/sm-annotate](https://lifeart.github.io/sm-annotate/)

## Features

* ✍️ Drawing and annotating over video and image elements
* 🛠️ Multiple drawing tools (curve, rectangle, circle, line, arrow, text, eraser)
* 🔲 Selection tool for cropping video frames
* ↔️ Move tool for repositioning and resizing shapes
* 🔄 Rotation support for all shapes with adjustable center point
* 📐 Visual resize handles for precise shape scaling
* 📋 Duplicate shapes (Ctrl/Cmd + D)
* 📑 Copy annotations to adjacent frames (Ctrl/Cmd + Shift + Arrow)
* 🎨 Customizable color and stroke size for annotations
* ↩️ Undo functionality (Ctrl/Cmd + Z)
* ⌫ Delete selected shapes with Backspace/Delete key (in move tool)
* 🔗 Serialization and deserialization of drawn shapes
* 📏 Scaling shapes to the current canvas size
* 🎞️ Playback of annotated frames as video
* 📊 Progress bar with annotation markers (visible on hover during playback)
* ⏭️ Jump to next/previous annotated frame (long press on frame navigation buttons)
* 💾 Saving the current frame or all frames with annotations
* 🎬 Video overlay comparison mode (split view with adjustable opacity)
* 🔊 Audio waveform visualization
* 🖼️ Paste images from clipboard
* 🌓 Dark/Light theme toggle
* 💡 Tooltips on all toolbar buttons
* 📦 OpenRV format import/export (.rv files for professional video review)
* 🎛️ Multiple layout modes (horizontal, vertical, minimal, bottom-dock)
* 📐 Collapsible toolbars for mobile
* 🔍 Pinch-to-zoom and pan gestures
* 🎨 CSS custom properties for easy theming

## Additional Benefits

* 🚀 Zero dependencies
* 📱 Support for mobile devices
* 🔌 Powerful plugin system
* 📘 Written in TypeScript
* 🧪 Comprehensive test coverage (619 tests with Vitest)

## Getting Started

Add the package to your project using yarn:

```bash
yarn add https://github.com/lifeart/sm-annotate.git
```

## Usage

```javascript
import { SmAnnotate } from '@lifeart/sm-annotate';

const video = document.getElementById('video');
const annotationTool = new SmAnnotate(video);
```

### Basic Operations

```javascript
// Save current frame annotations
const frameData = annotationTool.saveCurrentFrame();

// Save all frames with annotations
const allFrames = annotationTool.saveAllFrames();

// Load annotations
annotationTool.loadAllFrames(allFrames);

// Set custom frame rate
annotationTool.setFrameRate(30);

// Enforce total frames count (override calculated value)
annotationTool.setTotalFrames(100);

// Clear enforcement and use calculated value
annotationTool.setTotalFrames(null);
```

### Video Blob Support

```javascript
// Load video from blob
await annotationTool.setVideoBlob(videoBlob, fps);

// Load video from URL
await annotationTool.setVideoUrl(videoUrl, fps);

// Add reference video for comparison
await annotationTool.addReferenceVideoByURL(referenceUrl, fps);

// Adjust overlay opacity for compare mode (0 = off, 0.25, 0.5, 0.7, 1)
annotationTool.overlayOpacity = 0.7;

// Shapes can have individual opacity (0 to 1)
// Use the opacity button when a shape is selected in move tool
```

### Embedding & Configuration

SmAnnotate can be customized for different embedding scenarios with layout modes, mobile optimizations, and CSS theming.

#### Configuration Options

```javascript
import { SmAnnotate } from '@lifeart/sm-annotate';

const annotationTool = new SmAnnotate(video, {
  // Layout mode: 'horizontal' | 'vertical' | 'minimal' | 'bottom-dock'
  layout: 'horizontal',

  // Theme: 'dark' | 'light'
  theme: 'dark',

  // Mobile settings
  mobile: {
    collapsibleToolbars: true,  // Enable collapsible toolbar on mobile
    gesturesEnabled: true,      // Enable pinch-to-zoom and pan
    autoCollapse: true,         // Auto-collapse toolbar when drawing
    breakpoint: 960,            // Mobile breakpoint in pixels
  },

  // Toolbar options
  toolbar: {
    sidebarPosition: 'left',    // For vertical layout: 'left' | 'right'
    draggable: false,           // For minimal layout: allow dragging
    position: { x: 10, y: 10 }, // For minimal layout: initial position
  },

  // Feature visibility
  features: {
    showThemeToggle: true,
    showFullscreen: true,
    showProgressBar: true,
    showFrameCounter: true,
  },
});
```

#### Layout Modes

| Mode | Description |
| --- | --- |
| `horizontal` | Default layout with toolbar at top, player controls at bottom |
| `vertical` | Tools in a vertical sidebar (left or right side) |
| `minimal` | Compact floating toolbar that can be dragged around |
| `bottom-dock` | All controls merged into a single bar at the bottom |

```javascript
// Switch layout at runtime
annotationTool.setLayout('vertical');
annotationTool.setLayout('minimal');
annotationTool.setLayout('bottom-dock');

// Get current layout
const currentLayout = annotationTool.getLayout();
```

#### Collapsible Toolbars (Mobile)

On mobile devices, toolbars can be collapsed to maximize drawing space:

```javascript
// Programmatic control
annotationTool.collapseToolbar();
annotationTool.expandToolbar();
annotationTool.toggleToolbar();

// Check state
if (annotationTool.isToolbarCollapsed()) {
  console.log('Toolbar is hidden');
}
```

When `autoCollapse` is enabled, the toolbar automatically hides when drawing starts and reappears when drawing ends.

#### Gesture Support (Mobile)

Enable pinch-to-zoom and two-finger pan for detailed annotation work:

```javascript
// Enable/disable at runtime
annotationTool.setGesturesEnabled(true);

// Reset zoom to default
annotationTool.resetZoom();

// Get current zoom level (0.5x to 3x range)
const scale = annotationTool.getZoomScale();
```

#### CSS Customization

SmAnnotate uses CSS custom properties for styling. Override these in your CSS:

```css
:root {
  /* Colors */
  --sm-annotate-bg-primary: rgba(28, 28, 32, 0.95);
  --sm-annotate-bg-hover: rgba(255, 255, 255, 0.08);
  --sm-annotate-text-primary: #f0f0f2;
  --sm-annotate-accent: #5b9fff;
  --sm-annotate-border: rgba(255, 255, 255, 0.1);

  /* Sizing */
  --sm-annotate-toolbar-radius: 8px;
  --sm-annotate-toolbar-padding: 4px;
  --sm-annotate-toolbar-gap: 2px;
  --sm-annotate-btn-size: 32px;
  --sm-annotate-btn-size-mobile: 44px;
  --sm-annotate-btn-radius: 6px;

  /* Typography */
  --sm-annotate-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Animation */
  --sm-annotate-transition-duration: 0.15s;

  /* Z-index */
  --sm-annotate-z-index-toolbar: 10;
}
```

All CSS classes use the `sm-annotate-` prefix to prevent conflicts with host page styles.

### OpenRV Format Support

Export and import annotations in [OpenRV](https://github.com/AcademySoftwareFoundation/OpenRV) .rv format (GTO text format):

```javascript
import {
  exportToOpenRV,
  downloadAsOpenRV,
  parseOpenRV,
  parseOpenRVFile
} from '@lifeart/sm-annotate';

// Export annotations to OpenRV format
const rvContent = exportToOpenRV(annotationTool.saveAllFrames(), {
  mediaPath: '/path/to/video.mp4',
  width: 1920,
  height: 1080,
  sessionName: 'my-session', // optional
});

// Download as .rv file
downloadAsOpenRV(annotationTool.saveAllFrames(), {
  mediaPath: '/path/to/video.mp4',
  width: 1920,
  height: 1080,
}, 'annotations.rv');

// Parse OpenRV file content
const result = parseOpenRV(rvFileContent, {
  width: 1920,  // optional, defaults to file dimensions or 1920
  height: 1080, // optional, defaults to file dimensions or 1080
  fps: 25,      // optional, defaults to 25
});

// Load parsed annotations
annotationTool.loadAllFrames(result.frames);

// Access parsed metadata
console.log(result.mediaPath);    // original media path
console.log(result.dimensions);   // { width, height }
console.log(result.sessionName);  // session name

// Parse from File object (e.g., from file input)
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const result = await parseOpenRVFile(file, { fps: 30 });
  annotationTool.loadAllFrames(result.frames);
});
```

**Supported shapes for OpenRV export:**
- Curves (freehand drawings) → pen strokes
- Lines → pen strokes (2-point)
- Arrows → pen strokes (3 components: line + arrowhead)
- Rectangles → pen strokes (closed 5-point path)
- Circles → pen strokes (approximated as 33-point polygon)
- Text → text annotations

**Rotation support:** Shapes with rotation are fully supported. The rotation is "baked in" to the exported coordinates, including support for custom rotation centers. Text rotation only affects the anchor position since OpenRV text doesn't natively support rotation.

**Coordinate system:** OpenRV uses Normalized Device Coordinates (NDC) centered at the image center, while sm-annotate uses 0-1 normalized coordinates with origin at top-left. The converter handles this automatically, including proper aspect ratio scaling for non-square images (ultrawide, portrait, etc.).

**Note:** When importing from OpenRV, all pen strokes are converted to curves since OpenRV doesn't distinguish between shape types. Non-visual shapes (eraser, selection, compare, audio-peaks, image) are not exported. Files with multiple RVPaint blocks (common in real OpenRV sessions) are fully supported.

### Frame Navigation

```javascript
// Navigate frames
annotationTool.nextFrame();
annotationTool.prevFrame();

// Jump to annotated frames
annotationTool.nextAnnotatedFrame();
annotationTool.prevAnnotatedFrame();

// Get list of frames with annotations
const annotatedFrames = annotationTool.getAnnotatedFrames();
```

## Hotkeys

### General

| Key | Action |
| --- | --- |
| `Ctrl/Cmd + Z` | Undo last action |
| `Backspace` / `Delete` | Delete selected shape (in move tool) |
| `←` / `→` | Previous / Next frame |
| `Space` | Play / Pause video |

### Move Tool

| Key | Action |
| --- | --- |
| `Ctrl/Cmd + D` | Duplicate selected shape |
| `Ctrl/Cmd + Shift + →` | Copy all annotations to next frame |
| `Ctrl/Cmd + Shift + ←` | Copy all annotations to previous frame |
| `Backspace` / `Delete` | Delete selected shape |
| `Shift` + drag handle | Resize while keeping aspect ratio |
| `Shift` + drag rotation handle | Snap rotation to 15° increments |

### Curve Tool

| Key | Action |
| --- | --- |
| `Shift` | Magnifier x2 |
| `r` | Red color |
| `g` | Green color |
| `b` | Blue color |
| `y` | Yellow color |
| `1` - `9` | Tool size |

## Mouse/Touch Actions

| Action | Result |
| --- | --- |
| Click on progress bar | Jump to frame |
| Drag on progress bar | Scrub through frames |
| Click on annotation marker | Jump to annotated frame |
| Long press frame buttons | Jump to next/previous annotation |
| Pinch (two fingers) | Zoom in/out (0.5x to 3x) |
| Two-finger drag | Pan the canvas |
| Tap collapse button | Toggle toolbar visibility |

## Tools

| Tool | Description |
| --- | --- |
| Rectangle | Draw rectangular shapes |
| Circle | Draw circular/elliptical shapes |
| Line | Draw straight lines |
| Arrow | Draw arrows |
| Curve | Freehand drawing |
| Text | Add text annotations |
| Eraser | Remove annotations |
| Move | Reposition, resize, and rotate shapes; drag rotation handle to rotate, drag center point to change rotation pivot |
| Selection | Crop and capture video frame area |
| Compare | Split-view video comparison |
| Opacity | Adjust overlay or selected shape opacity (off/25%/50%/70%/100%) |
| Theme | Toggle between dark and light mode |

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage

# Type check
yarn typecheck

# Build
yarn build
```

## Contributing

We welcome contributions to improve the project. Please feel free to submit issues or pull requests for consideration.

## License

This code is allowed for non-commercial use. For commercial use, users must contact the author.
