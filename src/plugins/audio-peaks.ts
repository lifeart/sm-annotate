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
  canvas = document.createElement("canvas");
  drawCtx!: CanvasRenderingContext2D;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  constructor(annotationTool: AnnotationTool) {
    super(annotationTool);
    this.drawCtx = this.canvas.getContext("2d")!;
    annotationTool.setVideoBlob = (blob: Blob) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        this.init(event.target?.result as ArrayBuffer);
      };
      fileReader.onerror = (error) => {
        console.error(error);
      };
      fileReader.readAsArrayBuffer(blob);
    };
  }
  async init(blob: ArrayBuffer) {
    const { AudioContext } = await import("standardized-audio-context");
    const { default: extractPeaks } = await import("webaudio-peaks");
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(
      blob,
      (decodedData) => {
        this.initCanvas();
        const width = this.progressBarCoordinates.width;
        const size = width;
        const perPixel = Math.ceil(decodedData.length / size);

        //calculate peaks from an AudioBuffer
        const peaks = extractPeaks(decodedData, perPixel, true);

        // normalize peaks to bits
        const [min, max] = findMinMaxNumbers(peaks.data[0] as Int8Array);
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
        this.annotationTool.removeGlobalShape("audio-peaks");
        this.annotationTool.addGlobalShape({
          x: 0,
          y: 0,
          strokeStyle: "red",
          fillStyle: "red",
          lineWidth: 1,
          type: "audio-peaks",
        });
        this.clearLocalCanvas();
        this.drawOnCanvas();
      },
      (e) => {
        this.initCanvas();
        this.props.peaks = new Int8Array();
        this.annotationTool.removeGlobalShape("audio-peaks");
        this.clearLocalCanvas();
        console.error(e);
      }
    );
  }
  initCanvas() {
    this.canvas.width = this.progressBarCoordinates.width * this.pixelRatio;
    this.canvas.height = this.props.waveHeight * this.pixelRatio;
    this.drawCtx.scale(this.pixelRatio, this.pixelRatio);
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
    peaks: new Int8Array() as Int8Array | Int16Array | Int32Array,
    theme: {
      // color of the waveform outline
      waveOutlineColor: "rgba(255,192,203,0.7)",
      waveFillColor: "grey",
      waveProgressColor: "orange",
    },
    waveHeight: 40,
    bits: 16,
  };
  draw(_: IAudioPeaks) {
    const maybeVideoElement = this.annotationTool
      .videoElement as HTMLVideoElement;
    if (!maybeVideoElement || maybeVideoElement.tagName !== "VIDEO") {
      return;
    }

    const isMuted = maybeVideoElement.muted;
    if (isMuted || maybeVideoElement.volume === 0) {
      return;
    }

    this.ctx.clearRect(
      0,
      0,
      this.annotationTool.canvasWidth,
      this.annotationTool.canvasHeight
    );

    const { waveHeight, theme } = this.props;
    const cc = this.ctx;

    const h2 = waveHeight / 2;
    let y = this.progressBarCoordinates.y - 40;

    const { x, width } = this.progressBarCoordinates;
    const currentFrame = this.annotationTool.playbackFrame;
    const totalFrames = maybeVideoElement.duration * this.annotationTool.fps;

    const currentFrameCoordinate =
      Math.ceil((currentFrame / totalFrames) * width) + x;

    //call its drawImage() function passing it the source canvas directly
    this.ctx.drawImage(this.canvas, x, y, width, waveHeight);
    cc.fillStyle = theme.waveProgressColor;

    cc.fillRect(currentFrameCoordinate, y + 0, 1, h2 * 2);
  }
  get pixelRatio() {
    return this.annotationTool.pixelRatio;
  }
  get progressBarCoordinates() {
    return this.annotationTool.progressBarCoordinates;
  }
  clearLocalCanvas() {
    this.drawCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawOnCanvas() {
    const { peaks, bits, waveHeight, theme } = this.props;
    const cc = this.drawCtx;
    let offset = 0;
    let shift = 0;

    const h2 = waveHeight / 2;
    const maxValue = 2 ** (bits - 1);
    let y = 0;

    const peakSegmentLength = peaks.length;
    // console.log('peaks.length', peaks.length, this.progressBarCoordinates.width);

    // cc.fillStyle = 'white';
    // theme.waveOutlineColor;
    cc.fillStyle = theme.waveOutlineColor;

    for (let i = 0; i < peakSegmentLength; i += 1) {
      const minPeak = peaks[(i + offset) * 2] / maxValue;
      const maxPeak = peaks[(i + offset) * 2 + 1] / maxValue;

      const min = Math.abs(minPeak * h2);
      const max = Math.abs(maxPeak * h2);

      cc.fillRect(i + shift, y + 0 + h2 - max, 1, max + min);
    }
  }
}
