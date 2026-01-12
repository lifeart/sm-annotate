// https://stackoverflow.com/questions/72997777/how-do-i-get-the-frame-rate-of-an-html-video-with-javascript


type VideoFrameCallbackMetadata = {
  mediaTime: number;
  presentedFrames: number;
};

type VideoElementWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback: (
    callback: (now: number, metadata: VideoFrameCallbackMetadata) => void
  ) => void;
};

export function detectFrameRate(
  videoElement: VideoElementWithFrameCallback,
  callback: (fps: number, certainty: number) => void
): () => void {
  let lastMediaTime: number;
  let lastFrameNum: number;
  let fps: number;
  const fpsRounder: number[] = [];
  let frameNotSeeked = true;
  let isDestroyed = false;

  function ticker(_: number, metadata: VideoFrameCallbackMetadata): void {
    // Stop callback loop if destroyed
    if (isDestroyed) return;

    const mediaTimeDiff = Math.abs(metadata.mediaTime - lastMediaTime);
    const frameNumDiff = Math.abs(metadata.presentedFrames - lastFrameNum);
    const diff = mediaTimeDiff / frameNumDiff;

    if (
      diff &&
      diff < 1 &&
      frameNotSeeked &&
      fpsRounder.length < 50 &&
      videoElement.playbackRate === 1 &&
      document.hasFocus()
    ) {
      fpsRounder.push(diff);
      fps = Math.round(1 / getFpsAverage());
      callback(fps, fpsRounder.length * 2);
    }
    frameNotSeeked = true;
    lastMediaTime = metadata.mediaTime;
    lastFrameNum = metadata.presentedFrames;
    // Only continue callback loop if not destroyed
    if (!isDestroyed) {
      videoElement.requestVideoFrameCallback(ticker);
    }
  }

  videoElement.requestVideoFrameCallback(ticker);

  const onSeeked = () => {
    fpsRounder.pop();
    frameNotSeeked = false;
  }

  videoElement.addEventListener("seeked", onSeeked);

  function getFpsAverage(): number {
    return fpsRounder.reduce((a, b) => a + b) / fpsRounder.length;
  }

  return () => {
    isDestroyed = true;
    videoElement.removeEventListener("seeked", onSeeked);
  };
}
