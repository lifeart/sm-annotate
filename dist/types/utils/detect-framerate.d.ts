type VideoFrameCallbackMetadata = {
    mediaTime: number;
    presentedFrames: number;
};
type VideoElementWithFrameCallback = HTMLVideoElement & {
    requestVideoFrameCallback: (callback: (now: number, metadata: VideoFrameCallbackMetadata) => void) => void;
};
export declare function detectFrameRate(videoElement: VideoElementWithFrameCallback, callback: (fps: number, certainty: number) => void): () => void;
export {};
