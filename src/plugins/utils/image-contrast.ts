import { vFromRGB } from "./image-grayscale";

export function contrastImage(imgData: ImageData, refContrast: number) {
  //input range [-100..100]
  const d = imgData.data;
  const contrast = refContrast / 100 + 1; //convert to decimal & shift range: [0..2]
  var intercept = 128 * (1 - contrast);
  for (var i = 0; i < d.length; i += 4) {
    //r,g,b,a
    d[i] = d[i] * contrast + intercept;
    d[i + 1] = d[i + 1] * contrast + intercept;
    d[i + 2] = d[i + 2] * contrast + intercept;
  }
  return imgData;
}


export function normalizeContrast(image: ImageData) {
    const data = image.data;
    let max = 0;
    let min = 255;

    // Find the max and min luminance values
    for (let i = 0; i < data.length; i += 4) {
        let luminance = vFromRGB(data[i], data[i + 1], data[i + 2]);
        max = Math.max(max, luminance);
        min = Math.min(min, luminance);
    }

    // Normalize the contrast
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 * (data[i] - min) / (max - min);     // Red
        data[i + 1] = 255 * (data[i + 1] - min) / (max - min); // Green
        data[i + 2] = 255 * (data[i + 2] - min) / (max - min); // Blue
    }

    return image;
}