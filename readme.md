# Video and Image Annotation Tool

This project provides an annotation tool for HTML video and image elements. The tool allows users to draw and annotate over video and images using various drawing tools, including curves, rectangles, ellipses, lines, arrows, and texts. Users can also customize the color and stroke size of their annotations.

Demo: [lifeart.github.io/sm-annotate](https://lifeart.github.io/sm-annotate/)

## Features

* ✍️ Drawing and annotating over video and image elements
* 🛠️ Multiple drawing tools (curve, rectangle, circle, line, arrow, text, eraser)
* 🔲 Selection tool for cropping video frames
* ↔️ Move tool for repositioning and resizing shapes
* 🎨 Customizable color and stroke size for annotations
* ↩️ Undo functionality (Ctrl/Cmd + Z)
* ⌫ Delete selected shapes with Backspace/Delete key (in move tool)
* 🔗 Serialization and deserialization of drawn shapes
* 📏 Scaling shapes to the current canvas size
* 🎞️ Playback of annotated frames as video
* 📊 Progress bar with annotation markers (visible on hover during playback)
* ⏭️ Jump to next/previous annotated frame (long press on frame navigation buttons)
* 💾 Saving the current frame or all frames with annotations
* 🎬 Video overlay comparison mode (split view)
* 🔊 Audio waveform visualization
* 🖼️ Paste images from clipboard

## Additional Benefits

* 🚀 Zero dependencies
* 📱 Support for mobile devices
* 🔌 Powerful plugin system
* 📘 Written in TypeScript
* 🧪 Test coverage with Vitest

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
```

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
| Move | Reposition and resize shapes |
| Selection | Crop and capture video frame area |
| Compare | Split-view video comparison |

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
