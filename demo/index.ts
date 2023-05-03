new EventSource("/esbuild").addEventListener("change", () => location.reload());

import { SmAnnotate } from "../src";

const video = document.querySelector("video") as HTMLVideoElement;

async function initAnnotator() {
  // resize video to fit window

  const computedVideoElementStyle = window.getComputedStyle(video);

  const videoWidth = parseFloat(computedVideoElementStyle.width);
  const videoHeight = parseFloat(computedVideoElementStyle.height);
  const windowHeight = window.innerHeight - 80;

  if (videoHeight > windowHeight) {
    // change video style to fit window

    const videoRatio = videoWidth / videoHeight;

    const optimalVideoHeight = windowHeight;
    const optimalVideoWidth = optimalVideoHeight * videoRatio;

    video.style.width = `${optimalVideoWidth}px`;
    video.style.height = `${optimalVideoHeight}px`;
  }



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

  const blobs = new Blob([blob], { type: "video/mp4" });

  video.src = window.URL.createObjectURL(blobs);

  await loadPromise;

  const tool = new SmAnnotate(video);

  await tool.addReferenceVideoByURL('./mov_bbb_g.mp4');
  
  tool.setFrameRate(30);

  requestAnimationFrame(() => {
    tool.setCanvasSize();
  });

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

  const saveImageButton = document.getElementById(
    "save-image"
  ) as HTMLButtonElement;

  saveImageButton.addEventListener("click", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const imgData = await tool.frameToDataUrl();
    if (!imgData) {
      return;
    }
    const currentFrame = tool.activeTimeFrame;
    // download the image
    const a = document.createElement("a");
    a.href = imgData;
    a.download = `frame_${String(currentFrame).padStart(3, '0')}.png`;
    a.click();
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
