new EventSource("/esbuild").addEventListener("change", () => location.reload());

import { SmAnnotate } from "../src";

const video = document.querySelector("video") as HTMLVideoElement;

async function initAnnotator() {
  // Video is ready to play


  // preload video as blob


  const blob = await fetch(video.currentSrc).then((r) => r.blob());

  // set it to player 

  const loadPromise = new Promise((resolve) => {

    video.addEventListener("loadeddata", () => {
      resolve(true);
    });
  });

  video.src = URL.createObjectURL(blob);

  await loadPromise;

  const tool = new SmAnnotate(video);

  video.focus();

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

  const saveImageButton = document.getElementById("save-image") as HTMLButtonElement;

  saveImageButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    const imgData = tool.frameToDataUrl();
    if (!imgData) {
      return;
    }
    const currentFrame = tool.activeTimeFrame;
    // download the image
    const a = document.createElement("a");
    a.href = imgData;
    a.download = `frame-${currentFrame}.png`;
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
