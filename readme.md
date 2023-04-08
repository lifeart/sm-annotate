# Video and Image Annotation Tool

This project provides an annotation tool for HTML video and image elements. The tool allows users to draw and annotate over video and images using various drawing tools, including curves, rectangles, ellipses, and texts. Users can also customize the color and stroke size of their annotations.


Demo: https://codepen.io/lifeart/pen/xxyxKYr


## Features
* ✍️ Drawing and annotating over video and image elements.
* 🛠️ Multiple drawing tools (curve, rectangle, ellipse, and text).
* 🎨 Customizable color and stroke size for the annotations.
* ↩️ Undo functionality.
* 🔗 Serialization and deserialization of drawn shapes.
* 📏 Scaling shapes to the current canvas size.
* ⌨️ Keyboard shortcuts for undo (Ctrl/Cmd + Z).
* 🖱️ Event handling for pointer events (mouse and touch).
* 🎞️ Playback of annotated frames as video.
* 💾 Saving the current frame or all frames with annotations.
* 🗑️ Destroying the annotation tool instance and cleaning up event listeners.

## Additional Benefits

* 🚀 Zero dependencies.
* 📱 Support for mobile devices.
* 🔌 Powerful plugin system.
* 📘 Written in TypeScript.


## Getting Started

Include the annotation-tool.js file in your HTML file and instantiate the AnnotationTool class with the desired HTML video or image element.

## Usage

Users can draw and annotate using the available tools (curve, rectangle, ellipse, and text) and customize the color and stroke size of the annotations. The tool also supports undo functionality and event handling for pointer events (mouse and touch).

To save the current frame or all frames with annotations, use the saveCurrentFrame or saveAllFrames methods, respectively.

## Contributing

We welcome contributions to improve the project. Please feel free to submit issues or pull requests for consideration.

## License
See the LICENSE file for license rights and limitations.

