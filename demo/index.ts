new EventSource("/esbuild").addEventListener("change", () => location.reload());

import { SmAnnotate, downloadAsOpenRV, parseOpenRV, parseOpenRVFile, LayoutMode, FFmpegFrameExtractor } from "../src";

// Global FFmpeg extractor instance
let ffmpegExtractor: FFmpegFrameExtractor | null = null;
let currentVideoBlob: Blob | null = null;

const video = document.querySelector("video") as HTMLVideoElement;

async function initAnnotator() {
  // Video sizing is now handled by CSS flexbox layout

  // Video is ready to play

  // preload video as blob

  const blob = await fetch(video.currentSrc).then((r) => r.blob());

  // set it to player

  const loadPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 250);
    video.addEventListener(
      "loadeddata",
      () => {
        resolve(true);
      },
      {
        once: true,
      }
    );
  });

  const imageFrame = await fetch("./frame_29.png").then(async (r) => {
    const blob = await r.blob();
    const blobs = new Blob([blob], { type: "image/png" });

    const img = new Image();
    const imageLoadPromise = new Promise((resolve) => {
      img.addEventListener(
        "load",
        () => {
          resolve(true);
        },
        {
          once: true,
        }
      );
    });
    img.src = window.URL.createObjectURL(blobs);
    await imageLoadPromise;
    return img;
  });

  if (!video.paused) {
    video.pause();
  }

  const bl = new Blob([blob], { type: "video/mp4" });

  const tool = new SmAnnotate(video, {
    toolbar: { defaultTool: null },
  });

  await tool.setVideoBlob(bl, 30);

  await loadPromise;

  await tool.addReferenceVideoByURL("./mov_bbb_g.mp4");

  requestAnimationFrame(() => {
    tool.setCanvasSize();
  });

  tool.enableVideoFrameBuffer();

  console.log({ tool });

  tool.addShapesToFrame(29, [
    {
      type: "image",
      image: imageFrame,
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      strokeStyle: "red",
      lineWidth: 2,
      fillStyle: "red",
    },
  ]);

  if (!video.paused) {
    video.pause();
  }

  setInterval(() => {
    tool.destroy();
    tool.init(video);
  }, 100000000);

  setInterval(() => {
    console.log(tool.saveAllFrames());
  }, 100000);

  // setInterval(() => {
  //   const img = tool.imageForCapture();
  //   if (img) {
  //     document.body.appendChild(img);
  //   }
  // }, 10000);

  const fileInput = document.getElementById("file") as HTMLInputElement;
  const downloadButton = document.getElementById(
    "download"
  ) as HTMLButtonElement;
  const sampleButton = document.getElementById("sample") as HTMLButtonElement;
  const videoInput = document.getElementById("video") as HTMLInputElement;
  const refVideoInput = document.getElementById(
    "ref-video"
  ) as HTMLInputElement;

  videoInput.addEventListener("change", async (e) => {
    if (!videoInput.files || videoInput.files.length === 0) {
      return;
    }
    const file = videoInput.files[0];
    const blobs = new Blob([file], { type: file.type });

    // Update the current video blob for FFmpeg
    currentVideoBlob = blobs;

    // Reset FFmpeg UI elements
    const ffmpegExtractBtnEl = document.getElementById("ffmpeg-extract") as HTMLButtonElement;
    const ffmpegInfoEl = document.getElementById("ffmpeg-info") as HTMLDivElement;
    const ffmpegFpsEl = document.getElementById("ffmpeg-fps") as HTMLSpanElement;
    const ffmpegFramesEl = document.getElementById("ffmpeg-frames") as HTMLSpanElement;
    const ffmpegStatusEl = document.getElementById("ffmpeg-status") as HTMLDivElement;

    // Reset extract button (preserve icon)
    ffmpegExtractBtnEl.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="2" width="20" height="20" rx="2"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      Extract Frames
    `;

    // Clear previously extracted frames and disconnect from tool
    if (ffmpegExtractor?.isLoaded()) {
      ffmpegExtractor.clearFrames();
    }
    // Disconnect FFmpeg extractor from tool (will use video element frames)
    tool.setFFmpegFrameExtractor(null);

    // If FFmpeg is loaded, probe the video to get FPS
    let detectedFps = 30;
    if (ffmpegExtractor?.isLoaded()) {
      try {
        ffmpegStatusEl.className = "ffmpeg-status loading";
        ffmpegStatusEl.querySelector(".status-text")!.textContent = "Probing video...";

        const info = await ffmpegExtractor.probe(blobs);
        detectedFps = info.fps;

        ffmpegInfoEl.style.display = "flex";
        ffmpegFpsEl.textContent = `FPS: ${info.fps.toFixed(2)}`;
        ffmpegFramesEl.textContent = `Frames: ${info.totalFrames}`;

        ffmpegStatusEl.className = "ffmpeg-status ready";
        ffmpegStatusEl.querySelector(".status-text")!.textContent = "FFmpeg ready";

        console.log("Detected video info:", info);
      } catch (err) {
        console.error("Failed to probe video:", err);
        ffmpegStatusEl.className = "ffmpeg-status error";
        ffmpegStatusEl.querySelector(".status-text")!.textContent = "Probe failed";
      }
    }

    const fps = prompt("Enter FPS (detected: " + detectedFps + ")", String(detectedFps));
    if (!fps) {
      return;
    }

    await tool.setVideoBlob(blobs, parseInt(fps, 10));
  });

  refVideoInput.addEventListener("change", async (e) => {
    if (!refVideoInput.files || refVideoInput.files.length === 0) {
      return;
    }
    const fps = prompt("Enter FPS", "30");
    if (!fps) {
      return;
    }
    const file = refVideoInput.files[0];
    const blobs = new Blob([file], { type: file.type });
    const url = window.URL.createObjectURL(blobs);
    await tool.addReferenceVideoByURL(url, parseInt(fps, 10), file.type);
  });

  sampleButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    // we need to download annotations-sample.json from the server using fetch
    // and then load it into the tool
    fetch("./annotations-sample.json")
      .then((response) => response.json())
      .then((data) => {
        tool.loadAllFrames(data);
        tool.updateActiveTimeFrame();
        tool.redrawFullCanvas();
      });
  });
  fileInput.addEventListener("change", (e) => {
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target) {
        return;
      }
      const data = e.target.result as string;
      const dataObj = JSON.parse(data);
      const append = confirm("Append to existing annotations?");
      if (!append) {
        tool.loadAllFrames(dataObj);
      } else {
        tool.appendFrames(dataObj);
      }

      tool.updateActiveTimeFrame();
      tool.redrawFullCanvas();
    };
    reader.readAsText(file);
  });

  downloadButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const data = tool.saveAllFrames();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    const prettyDate = new Date().toISOString().replace(/:/g, "-");
    a.download = `annotations-${prettyDate}.json`;
    a.click();
  });

  // OpenRV format support
  const rvFileInput = document.getElementById("rv-file") as HTMLInputElement;
  const downloadRvButton = document.getElementById("download-rv") as HTMLButtonElement;

  // OpenRV transform controls
  const rvScaleInput = document.getElementById("rv-scale") as HTMLInputElement;
  const rvScaleValue = document.getElementById("rv-scale-value") as HTMLSpanElement;
  const rvOffsetXInput = document.getElementById("rv-offset-x") as HTMLInputElement;
  const rvOffsetXValue = document.getElementById("rv-offset-x-value") as HTMLSpanElement;
  const rvOffsetYInput = document.getElementById("rv-offset-y") as HTMLInputElement;
  const rvOffsetYValue = document.getElementById("rv-offset-y-value") as HTMLSpanElement;
  const rvResetButton = document.getElementById("rv-reset-transform") as HTMLButtonElement;

  // Store last loaded .rv file content for live re-parsing
  let lastRvFileContent: string | null = null;

  // Function to re-parse and update annotations with current slider values
  function reloadRvAnnotations() {
    if (!lastRvFileContent) return;

    const scale = parseFloat(rvScaleInput.value);
    const offsetX = parseFloat(rvOffsetXInput.value);
    const offsetY = parseFloat(rvOffsetYInput.value);

    const result = parseOpenRV(lastRvFileContent, {
      fps: tool.fps,
      targetHeight: tool.canvasHeight,
      coordinateScale: scale,
      // Invert offset so positive slider values move shapes right/down
      coordinateOffset: { x: -offsetX, y: -offsetY },
    });

    tool.loadAllFrames(result.frames);
    tool.updateActiveTimeFrame();
    tool.redrawFullCanvas();
  }

  // Update display values and reload annotations when sliders change
  rvScaleInput.addEventListener("input", () => {
    rvScaleValue.textContent = rvScaleInput.value;
    reloadRvAnnotations();
  });
  rvOffsetXInput.addEventListener("input", () => {
    rvOffsetXValue.textContent = rvOffsetXInput.value;
    reloadRvAnnotations();
  });
  rvOffsetYInput.addEventListener("input", () => {
    rvOffsetYValue.textContent = rvOffsetYInput.value;
    reloadRvAnnotations();
  });

  // Reset button handler
  rvResetButton.addEventListener("click", () => {
    rvScaleInput.value = "0.85";
    rvScaleValue.textContent = "0.85";
    rvOffsetXInput.value = "0";
    rvOffsetXValue.textContent = "0";
    rvOffsetYInput.value = "0";
    rvOffsetYValue.textContent = "0";
    reloadRvAnnotations();
  });

  rvFileInput.addEventListener("change", async (e) => {
    if (!rvFileInput.files || rvFileInput.files.length === 0) {
      return;
    }
    const file = rvFileInput.files[0];
    try {
      // Store file content for live re-parsing
      lastRvFileContent = await file.text();

      // Get transform values from sliders
      const scale = parseFloat(rvScaleInput.value);
      const offsetX = parseFloat(rvOffsetXInput.value);
      const offsetY = parseFloat(rvOffsetYInput.value);

      // Parse with coordinate adjustments for OpenRV compatibility
      const result = parseOpenRV(lastRvFileContent, {
        fps: tool.fps,
        targetHeight: tool.canvasHeight,
        coordinateScale: scale,
        // Invert offset so positive slider values move shapes right/down
        coordinateOffset: { x: -offsetX, y: -offsetY },
        debug: true,
      });

      // Debug: log dimensions used
      console.log("RV file dimensions:", result.dimensions);
      console.log("Demo video dimensions:", video.videoWidth, "x", video.videoHeight);
      console.log("Canvas dimensions:", tool.canvasWidth, "x", tool.canvasHeight);

      const append = confirm("Append to existing annotations?");
      if (!append) {
        tool.loadAllFrames(result.frames);
      } else {
        tool.appendFrames(result.frames);
      }

      // Sync activeTimeFrame with current video position before redrawing
      tool.updateActiveTimeFrame();
      tool.redrawFullCanvas();

      // Log loaded annotations info
      const annotatedFrames = result.frames.map(f => f.frame);
      console.log(`Loaded ${result.frames.length} annotated frames:`, annotatedFrames);
      if (result.frames.length > 0) {
        console.log("First frame shapes:", result.frames[0].shapes);
      }

      if (result.mediaPath) {
        console.log("OpenRV media path:", result.mediaPath);
      }
    } catch (err) {
      console.error("Failed to parse OpenRV file:", err);
      alert("Failed to parse OpenRV file. Check console for details.");
    }
  });

  downloadRvButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const frames = tool.saveAllFrames();
    if (frames.length === 0) {
      alert("No annotations to export.");
      return;
    }

    const prettyDate = new Date().toISOString().replace(/:/g, "-");
    downloadAsOpenRV(
      frames,
      {
        mediaPath: video.currentSrc || "video.mp4",
        width: tool.canvasWidth || 1920,
        height: tool.canvasHeight || 1080,
        sessionName: `sm-annotate-${prettyDate}`,
      },
      `annotations-${prettyDate}.rv`
    );
  });

  // Layout switching
  const layoutButtons = document.querySelectorAll(".layout-btn");
  const layoutLabel = document.getElementById("layout-label");

  const layoutLabels: Record<LayoutMode, string> = {
    horizontal: "Horizontal (default)",
    vertical: "Vertical Sidebar",
    minimal: "Minimal / Floating",
    "bottom-dock": "Bottom Dock",
  };

  layoutButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const button = e.currentTarget as HTMLButtonElement;
      const layout = button.dataset.layout as LayoutMode;

      // Update active state
      layoutButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      // Update label
      if (layoutLabel) {
        layoutLabel.textContent = layoutLabels[layout];
      }

      // Apply layout
      tool.setLayout(layout);

      // Resize canvas after layout change
      requestAnimationFrame(() => {
        tool.setCanvasSize();
      });
    });
  });

  // FFmpeg Frame Extraction
  const ffmpegLoadBtn = document.getElementById("ffmpeg-load") as HTMLButtonElement;
  const ffmpegExtractBtn = document.getElementById("ffmpeg-extract") as HTMLButtonElement;
  const ffmpegStatus = document.getElementById("ffmpeg-status") as HTMLDivElement;
  const ffmpegProgress = document.getElementById("ffmpeg-progress") as HTMLDivElement;
  const ffmpegProgressFill = document.getElementById("ffmpeg-progress-fill") as HTMLDivElement;
  const ffmpegProgressText = document.getElementById("ffmpeg-progress-text") as HTMLSpanElement;
  const ffmpegInfo = document.getElementById("ffmpeg-info") as HTMLDivElement;
  const ffmpegFps = document.getElementById("ffmpeg-fps") as HTMLSpanElement;
  const ffmpegFrames = document.getElementById("ffmpeg-frames") as HTMLSpanElement;

  function updateFFmpegStatus(status: "idle" | "loading" | "ready" | "extracting" | "error", text: string) {
    ffmpegStatus.className = `ffmpeg-status ${status}`;
    ffmpegStatus.querySelector(".status-text")!.textContent = text;
  }

  function updateProgress(percent: number) {
    ffmpegProgress.style.display = "flex";
    ffmpegProgressFill.style.width = `${percent}%`;
    ffmpegProgressText.textContent = `${Math.round(percent)}%`;
  }

  function hideProgress() {
    ffmpegProgress.style.display = "none";
  }

  // Store the current video blob for FFmpeg extraction
  currentVideoBlob = bl;

  ffmpegLoadBtn.addEventListener("click", async () => {
    if (ffmpegExtractor?.isLoaded()) {
      return;
    }

    ffmpegLoadBtn.disabled = true;
    updateFFmpegStatus("loading", "Loading FFmpeg...");
    updateProgress(0);

    try {
      ffmpegExtractor = new FFmpegFrameExtractor();
      await ffmpegExtractor.load((progress) => {
        if (progress.phase === "loading") {
          updateProgress(progress.loaded * 100);
        }
      });

      updateFFmpegStatus("ready", "FFmpeg ready");
      hideProgress();
      ffmpegExtractBtn.disabled = false;
      ffmpegLoadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        FFmpeg Loaded
      `;

      // If we have a video, probe it for info
      if (currentVideoBlob) {
        const info = await ffmpegExtractor.probe(currentVideoBlob);
        ffmpegInfo.style.display = "flex";
        ffmpegFps.textContent = `FPS: ${info.fps.toFixed(2)}`;
        ffmpegFrames.textContent = `Frames: ${info.totalFrames}`;
        console.log("Video info from FFmpeg:", info);
      }
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
      updateFFmpegStatus("error", "Failed to load");
      hideProgress();
      ffmpegLoadBtn.disabled = false;
    }
  });

  ffmpegExtractBtn.addEventListener("click", async () => {
    if (!ffmpegExtractor?.isLoaded() || !currentVideoBlob) {
      alert("Please load FFmpeg first and ensure a video is loaded.");
      return;
    }

    ffmpegExtractBtn.disabled = true;
    updateFFmpegStatus("extracting", "Extracting frames...");
    updateProgress(0);

    try {
      const startTime = performance.now();

      const frames = await ffmpegExtractor.extractFrames(currentVideoBlob, {
        format: "png",
        onProgress: (progress) => {
          const percent = progress.total > 0
            ? (progress.loaded / progress.total) * 100
            : 0;
          updateProgress(percent);
          updateFFmpegStatus("extracting", `Extracting frame ${progress.loaded}...`);
        }
      });

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      console.log(`Extracted ${frames.size} frames in ${elapsed}s`);

      updateFFmpegStatus("ready", `${frames.size} frames extracted`);
      hideProgress();
      ffmpegExtractBtn.disabled = false;
      ffmpegExtractBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Re-extract (${frames.size} frames)
      `;

      // Update info display
      const info = ffmpegExtractor.getVideoInfo();
      if (info) {
        ffmpegFps.textContent = `FPS: ${info.fps.toFixed(2)}`;
        ffmpegFrames.textContent = `Frames: ${frames.size}`;
      }

      // Connect FFmpeg extractor to annotation tool for rendering
      tool.setFFmpegFrameExtractor(ffmpegExtractor);
      console.log("FFmpeg frames connected to annotation tool");

      // Log first few frames for debugging
      console.log("FFmpeg extracted frames:", frames);
      console.log("Frame 1:", frames.get(1));

    } catch (error) {
      console.error("Failed to extract frames:", error);
      updateFFmpegStatus("error", "Extraction failed");
      hideProgress();
      ffmpegExtractBtn.disabled = false;
    }
  });

  // Window resize handling
  let resizeTimeout: number | undefined;
  window.addEventListener("resize", () => {
    // Debounce resize events
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = window.setTimeout(() => {
      tool.setCanvasSize();
    }, 100);
  });
}

if (video.readyState === 0) {
  // readyState
  video.addEventListener(
    "loadedmetadata",
    () => {
      // "The duration and dimensions of the media and tracks are now known."

      requestAnimationFrame(() => {
        initAnnotator();
      });
    },
    { once: true }
  );
} else {
  initAnnotator();
}
