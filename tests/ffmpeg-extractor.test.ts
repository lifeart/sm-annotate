import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for FFmpeg frame extractor functionality and demo page flow.
 *
 * Since FFmpeg WASM requires actual network loading, these tests focus on:
 * 1. State management logic
 * 2. Log parsing for video metadata
 * 3. Demo page flow patterns (FPS detection, queuing, error handling)
 */

// Mock the parseFFmpegLog logic for testing video info extraction
function parseFFmpegLog(message: string, videoInfo: { fps: number; duration: number; width: number; height: number }) {
  // Parse FPS from input stream info
  const fpsMatch = message.match(/(\d+(?:\.\d+)?)\s*fps/);
  if (fpsMatch) {
    const fps = parseFloat(fpsMatch[1]);
    if (fps > 0 && fps < 1000) {
      videoInfo.fps = fps;
    }
  }

  // Fallback: try to get tbr (time base rate) if fps not found
  if (videoInfo.fps === 25) {
    const tbrMatch = message.match(/(\d+(?:\.\d+)?)\s*tbr/);
    if (tbrMatch) {
      const tbr = parseFloat(tbrMatch[1]);
      if (tbr > 0 && tbr < 1000) {
        videoInfo.fps = tbr;
      }
    }
  }

  // Parse duration
  const durationMatch = message.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d+)/);
  if (durationMatch) {
    const hours = parseInt(durationMatch[1], 10);
    const minutes = parseInt(durationMatch[2], 10);
    const seconds = parseInt(durationMatch[3], 10);
    const centiseconds = parseInt(durationMatch[4], 10);
    videoInfo.duration = hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
  }

  // Parse video dimensions
  const dimensionMatch = message.match(/(\d{2,5})x(\d{2,5})/);
  if (dimensionMatch) {
    const width = parseInt(dimensionMatch[1], 10);
    const height = parseInt(dimensionMatch[2], 10);
    if (width > 0 && height > 0) {
      videoInfo.width = width;
      videoInfo.height = height;
    }
  }
}

describe('FFmpeg Log Parsing', () => {
  it('should parse FPS from stream info', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('Stream #0:0: Video: h264, 1920x1080, 24 fps', videoInfo);

    expect(videoInfo.fps).toBe(24);
  });

  it('should parse decimal FPS values', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('29.97 fps, 29.97 tbr', videoInfo);

    expect(videoInfo.fps).toBeCloseTo(29.97, 2);
  });

  it('should parse FPS from tbr when fps not found', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('30 tbr, 30 tbn', videoInfo);

    expect(videoInfo.fps).toBe(30);
  });

  it('should parse duration from FFmpeg output', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('Duration: 00:01:30.50, start: 0.000000', videoInfo);

    expect(videoInfo.duration).toBe(90.5); // 1 min 30.5 sec
  });

  it('should parse video dimensions', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('Stream #0:0: Video: h264, yuv420p, 1920x1080', videoInfo);

    expect(videoInfo.width).toBe(1920);
    expect(videoInfo.height).toBe(1080);
  });

  it('should handle various dimension formats', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('Video: 3840x2160 [SAR 1:1 DAR 16:9]', videoInfo);

    expect(videoInfo.width).toBe(3840);
    expect(videoInfo.height).toBe(2160);
  });

  it('should ignore invalid FPS values', () => {
    const videoInfo = { fps: 25, duration: 0, width: 0, height: 0 };

    parseFFmpegLog('0 fps', videoInfo);
    expect(videoInfo.fps).toBe(25); // unchanged

    parseFFmpegLog('10000 fps', videoInfo);
    expect(videoInfo.fps).toBe(25); // unchanged, too high
  });
});

describe('Demo Page Flow - FPS Detection', () => {
  /**
   * Tests for the FPS detection and prompt skipping logic.
   * When FFmpeg is loaded and detects FPS > 0, no prompt should be shown.
   */

  interface FlowState {
    ffmpegLoaded: boolean;
    detectedFps: number;
    fpsDetected: boolean;
  }

  function simulateFpsDetection(state: FlowState): { shouldPrompt: boolean; fps: number } {
    if (state.ffmpegLoaded && state.fpsDetected && state.detectedFps > 0) {
      // Use detected FPS without prompting
      return { shouldPrompt: false, fps: state.detectedFps };
    } else {
      // FFmpeg not loaded or FPS not detected, prompt user
      return { shouldPrompt: true, fps: 30 }; // default
    }
  }

  it('should skip prompt when FFmpeg detects FPS', () => {
    const state: FlowState = {
      ffmpegLoaded: true,
      detectedFps: 24,
      fpsDetected: true,
    };

    const result = simulateFpsDetection(state);

    expect(result.shouldPrompt).toBe(false);
    expect(result.fps).toBe(24);
  });

  it('should prompt when FFmpeg is not loaded', () => {
    const state: FlowState = {
      ffmpegLoaded: false,
      detectedFps: 0,
      fpsDetected: false,
    };

    const result = simulateFpsDetection(state);

    expect(result.shouldPrompt).toBe(true);
  });

  it('should prompt when FPS detection fails', () => {
    const state: FlowState = {
      ffmpegLoaded: true,
      detectedFps: 0,
      fpsDetected: false,
    };

    const result = simulateFpsDetection(state);

    expect(result.shouldPrompt).toBe(true);
  });

  it('should use detected decimal FPS values', () => {
    const state: FlowState = {
      ffmpegLoaded: true,
      detectedFps: 29.97,
      fpsDetected: true,
    };

    const result = simulateFpsDetection(state);

    expect(result.shouldPrompt).toBe(false);
    expect(result.fps).toBeCloseTo(29.97, 2);
  });
});

describe('Demo Page Flow - Video Queue', () => {
  /**
   * Tests for queuing video selection while FFmpeg is loading.
   */

  interface QueueState {
    ffmpegLoading: boolean;
    ffmpegLoaded: boolean;
    pendingVideoProcess: (() => Promise<void>) | null;
  }

  function simulateVideoSelection(
    state: QueueState,
    processVideo: () => Promise<void>
  ): { queued: boolean; processedImmediately: boolean } {
    if (state.ffmpegLoading) {
      // Queue for later
      state.pendingVideoProcess = processVideo;
      return { queued: true, processedImmediately: false };
    }
    // Process immediately
    return { queued: false, processedImmediately: true };
  }

  async function simulateFFmpegLoadComplete(state: QueueState): Promise<boolean> {
    state.ffmpegLoading = false;
    state.ffmpegLoaded = true;

    if (state.pendingVideoProcess) {
      const process = state.pendingVideoProcess;
      state.pendingVideoProcess = null;
      await process();
      return true; // processed pending video
    }
    return false;
  }

  it('should queue video when FFmpeg is loading', () => {
    const state: QueueState = {
      ffmpegLoading: true,
      ffmpegLoaded: false,
      pendingVideoProcess: null,
    };

    const mockProcess = vi.fn().mockResolvedValue(undefined);
    const result = simulateVideoSelection(state, mockProcess);

    expect(result.queued).toBe(true);
    expect(result.processedImmediately).toBe(false);
    expect(state.pendingVideoProcess).toBe(mockProcess);
    expect(mockProcess).not.toHaveBeenCalled();
  });

  it('should process video immediately when FFmpeg is ready', () => {
    const state: QueueState = {
      ffmpegLoading: false,
      ffmpegLoaded: true,
      pendingVideoProcess: null,
    };

    const mockProcess = vi.fn().mockResolvedValue(undefined);
    const result = simulateVideoSelection(state, mockProcess);

    expect(result.queued).toBe(false);
    expect(result.processedImmediately).toBe(true);
  });

  it('should process queued video after FFmpeg loads', async () => {
    const state: QueueState = {
      ffmpegLoading: true,
      ffmpegLoaded: false,
      pendingVideoProcess: null,
    };

    const mockProcess = vi.fn().mockResolvedValue(undefined);
    simulateVideoSelection(state, mockProcess);

    expect(mockProcess).not.toHaveBeenCalled();

    const processed = await simulateFFmpegLoadComplete(state);

    expect(processed).toBe(true);
    expect(mockProcess).toHaveBeenCalledOnce();
    expect(state.pendingVideoProcess).toBeNull();
  });

  it('should not call process if no video was queued', async () => {
    const state: QueueState = {
      ffmpegLoading: true,
      ffmpegLoaded: false,
      pendingVideoProcess: null,
    };

    const processed = await simulateFFmpegLoadComplete(state);

    expect(processed).toBe(false);
  });
});

describe('Demo Page Flow - Network Error Handling', () => {
  /**
   * Tests for network error detection and button re-enabling.
   */

  function isNetworkError(error: unknown): boolean {
    return error instanceof TypeError ||
      (error instanceof Error && (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('Failed to load')
      ));
  }

  interface ErrorUIState {
    buttonDisabled: boolean;
    statusText: string;
  }

  function handleFFmpegLoadError(error: unknown, uiState: ErrorUIState): void {
    if (isNetworkError(error)) {
      uiState.statusText = 'Network error - click to retry';
      uiState.buttonDisabled = false;
    } else {
      uiState.statusText = 'Failed to load';
      uiState.buttonDisabled = true;
    }
  }

  it('should detect TypeError as network error', () => {
    expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true);
  });

  it('should detect fetch-related errors', () => {
    expect(isNetworkError(new Error('fetch failed'))).toBe(true);
    expect(isNetworkError(new Error('Failed to fetch resource'))).toBe(true);
  });

  it('should detect network errors', () => {
    expect(isNetworkError(new Error('network error occurred'))).toBe(true);
  });

  it('should detect "Failed to load" errors', () => {
    expect(isNetworkError(new Error('Failed to load WASM module'))).toBe(true);
  });

  it('should not treat other errors as network errors', () => {
    expect(isNetworkError(new Error('Invalid video format'))).toBe(false);
    expect(isNetworkError(new Error('Out of memory'))).toBe(false);
    expect(isNetworkError(new Error('Decoding failed'))).toBe(false);
  });

  it('should re-enable button on network error', () => {
    const uiState: ErrorUIState = { buttonDisabled: true, statusText: '' };

    handleFFmpegLoadError(new TypeError('Failed to fetch'), uiState);

    expect(uiState.buttonDisabled).toBe(false);
    expect(uiState.statusText).toBe('Network error - click to retry');
  });

  it('should keep button disabled on other errors', () => {
    const uiState: ErrorUIState = { buttonDisabled: true, statusText: '' };

    handleFFmpegLoadError(new Error('WASM execution error'), uiState);

    expect(uiState.buttonDisabled).toBe(true);
    expect(uiState.statusText).toBe('Failed to load');
  });
});

describe('Demo Page Flow - Auto Frame Extraction', () => {
  /**
   * Tests for automatic frame extraction after video selection.
   */

  interface ExtractionState {
    ffmpegLoaded: boolean;
    videoBlob: Blob | null;
    extractFramesCalled: boolean;
  }

  function shouldAutoExtract(state: ExtractionState): boolean {
    return state.ffmpegLoaded && state.videoBlob !== null;
  }

  it('should trigger extraction when FFmpeg is loaded and video is set', () => {
    const state: ExtractionState = {
      ffmpegLoaded: true,
      videoBlob: new Blob(['test'], { type: 'video/mp4' }),
      extractFramesCalled: false,
    };

    expect(shouldAutoExtract(state)).toBe(true);
  });

  it('should not trigger extraction when FFmpeg is not loaded', () => {
    const state: ExtractionState = {
      ffmpegLoaded: false,
      videoBlob: new Blob(['test'], { type: 'video/mp4' }),
      extractFramesCalled: false,
    };

    expect(shouldAutoExtract(state)).toBe(false);
  });

  it('should not trigger extraction when no video is set', () => {
    const state: ExtractionState = {
      ffmpegLoaded: true,
      videoBlob: null,
      extractFramesCalled: false,
    };

    expect(shouldAutoExtract(state)).toBe(false);
  });
});

describe('FFmpeg Loading State', () => {
  /**
   * Tests for FFmpeg loading state management to prevent duplicate loads.
   */

  interface LoadingState {
    ffmpegLoaded: boolean;
    ffmpegLoading: boolean;
  }

  function canStartLoad(state: LoadingState): boolean {
    return !state.ffmpegLoaded && !state.ffmpegLoading;
  }

  it('should allow load when not loaded and not loading', () => {
    const state: LoadingState = { ffmpegLoaded: false, ffmpegLoading: false };
    expect(canStartLoad(state)).toBe(true);
  });

  it('should prevent load when already loaded', () => {
    const state: LoadingState = { ffmpegLoaded: true, ffmpegLoading: false };
    expect(canStartLoad(state)).toBe(false);
  });

  it('should prevent load when currently loading', () => {
    const state: LoadingState = { ffmpegLoaded: false, ffmpegLoading: true };
    expect(canStartLoad(state)).toBe(false);
  });

  it('should prevent load when loaded and loading flags both set', () => {
    const state: LoadingState = { ffmpegLoaded: true, ffmpegLoading: true };
    expect(canStartLoad(state)).toBe(false);
  });
});
