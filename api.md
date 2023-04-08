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
