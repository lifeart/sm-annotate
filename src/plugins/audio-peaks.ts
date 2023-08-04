import { IShapeBase, BasePlugin, ToolPlugin } from "./base";
import { AnnotationTool } from "../core";

export interface IAudioPeaks extends IShapeBase {
  x: number;
  y: number;
}

function findMinMaxNumbers(array: Int8Array): [number, number] {
    let min = array[0];
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] < min) min = array[i];
        if (array[i] > max) max = array[i];
    }
    return [min, max];
}

export class AudioPeaksPlugin
  extends BasePlugin<IAudioPeaks>
  implements ToolPlugin<IAudioPeaks>
{
  name = "audio-peaks";
  constructor(annotationTool: AnnotationTool) {
    super(annotationTool);
    annotationTool.setVideoBlob = (blob: Blob) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setTimeout(() => {
          this.init(event.target?.result as ArrayBuffer);
        }, 3000);
      };
      fileReader.readAsArrayBuffer(blob);
    };
  }
  async init(blob: ArrayBuffer) {
    const { AudioContext } = await import("standardized-audio-context");
    const { default: extractPeaks } = await import("webaudio-peaks");
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(blob, (decodedData) => {
      const width = this.annotationTool.progressBarCoordinates.width;
      const size = width;
      const perPixel = Math.ceil(decodedData.length / size);
      //calculate peaks from an AudioBuffer
      const peaks = extractPeaks(decodedData, perPixel, true);
      // normalize peaks to bits
      const [min, max] = findMinMaxNumbers(peaks.data[0]);
      const maxNumber = Math.pow(2, peaks.bits - 1) - 1;
      const minNumber = -Math.pow(2, peaks.bits - 1);
      this.props.peaks = peaks.data[0].map((peak) => {
            if (peak < 0) {
                return Math.round((peak / min) * minNumber);
            } else {
                return Math.round((peak / max) * maxNumber);
            }
        });
      this.props.bits = peaks.bits;
      //   peaks.data[0][0]
      this.annotationTool.addGlobalShape({
        x: 0,
        y: 0,
        strokeStyle: "red",
        fillStyle: "red",
        lineWidth: 1,
        type: "audio-peaks",
      });
      console.log(peaks);
    });
  }
  move(shape: IAudioPeaks, dx: number, dy: number) {
    shape.x += dx;
    shape.y += dy;
    return shape;
  }
  normalize(
    shape: IAudioPeaks,
    canvasWidth: number,
    canvasHeight: number
  ): IAudioPeaks {
    return {
      ...shape,
      x: shape.x / canvasWidth,
      y: shape.y / canvasHeight,
    };
  }
  onPointerDown(event: PointerEvent) {
    return;
  }
  onPointerMove(event: PointerEvent) {
    return;
  }
  onPointerUp(event: PointerEvent) {
    return;
  }
  props = {
    scale: 1,
    peaks: new Int8Array() as Int8Array | Int16Array | Int32Array,
    theme: {
      // color of the waveform outline
      waveOutlineColor: 'rgba(255,192,203,0.7)',
      waveFillColor: "grey",
      waveProgressColor: "orange",
    },
    waveHeight: 40,
    bits: 16,
  };
  draw(shape: IAudioPeaks) {
    const maybeVideoElement =  this.annotationTool.videoElement as HTMLVideoElement;
    if (!maybeVideoElement || maybeVideoElement.tagName !== "VIDEO") {
        return;
    }

    const isMuded = maybeVideoElement.muted;
    if (isMuded || maybeVideoElement.volume === 0) {
        return;
    }
    this.ctx.clearRect(0, 0, this.annotationTool.canvasWidth, this.annotationTool.canvasHeight)
    // console.log("draw", shape);
    const { peaks, bits, waveHeight, theme } = this.props;
    const cc = this.ctx;
    let offset = 0;
    let shift = this.annotationTool.progressBarCoordinates.x;

    const h2 = waveHeight / 2;
    const maxValue = 2 ** (bits - 1);
    let y = this.annotationTool.progressBarCoordinates.y - 40;

    cc.fillStyle = theme.waveOutlineColor;

    const peakSegmentLength = this.annotationTool.progressBarCoordinates.width * this.annotationTool.pixelRatio;

    const { x, width } = this.annotationTool.progressBarCoordinates;
    const currentFrame = this.annotationTool.playbackFrame;
    const totalFrames = maybeVideoElement.duration * this.annotationTool.fps;

    const currentFrameCoordinate =
      Math.ceil((currentFrame / totalFrames) * width) + x;
  

    for (let i = 0; i < peakSegmentLength; i += 1) {
      const minPeak = peaks[(i + offset) * 2] / maxValue;
      const maxPeak = peaks[(i + offset) * 2 + 1] / maxValue;

      const min = Math.abs(minPeak * h2);
      const max = Math.abs(maxPeak * h2);
      if (i + shift === currentFrameCoordinate) {
        cc.fillStyle = theme.waveProgressColor;
        cc.fillRect(i + shift, y + 0, 1, h2 * 2);
      } else {
        cc.fillStyle = theme.waveOutlineColor;
        cc.fillRect(i + shift, y + 0 + h2 - max, 1, max + min);

      }

      // inverse this two fill rects:

      // draw max
    //   cc.fillRect(i + shift, 0, 1, h2 - max);
      // draw min
    //   cc.fillRect(i + shift, h2 + min, 1, h2 - min);
      
    }
  }
}
