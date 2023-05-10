import { vFromRGB } from "./image-grayscale";

let fId = 0;
export class HistogramFrame extends Array<number> {
  id: number;
  constructor() {
    super(...arguments);
    this.id = fId++;
  }
}

export function sobelOperator(imgData: ImageData) {
  let width = imgData.width;
  let height = imgData.height;
  let grayscale = new Array(width * height);
  let edges = new HistogramFrame();

  // convert to grayscale
  let ii = 0;
  for (let i = 0; i < imgData.data.length; i += 4) {
    grayscale[ii] = vFromRGB(
      imgData.data[i],
      imgData.data[i + 1],
      imgData.data[i + 2]
    );
    ii++;
  }

  // apply sobel operator
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let i = y * width + x;
      let gx =
        -grayscale[i - width - 1] +
        grayscale[i - width + 1] -
        2 * grayscale[i - 1] +
        2 * grayscale[i + 1] -
        grayscale[i + width - 1] +
        grayscale[i + width + 1];
      let gy =
        grayscale[i - width - 1] +
        2 * grayscale[i - width] +
        grayscale[i - width + 1] -
        grayscale[i + width - 1] -
        2 * grayscale[i + width] -
        grayscale[i + width + 1];
      let magnitude = Math.sqrt(gx * gx + gy * gy);
      edges.push(magnitude);
    }
  }

  return edges;
}

const simCache = new Map<string, number>();
const cacheKeyForArrays = (arr1: HistogramFrame, arr2: HistogramFrame) => {
  return Math.max(arr1.id, arr2.id) + "-" + Math.min(arr1.id, arr2.id);
};
export function calculateSimilarity(
  edges1: HistogramFrame,
  edges2: HistogramFrame
) {
  const key = cacheKeyForArrays(edges1, edges2);
  if (simCache.has(key)) {
    return simCache.get(key)!;
  }
  let score = 0;
  for (let i = 0; i < edges1.length; i++) {
    score += (edges1[i] - edges2[i]) * (edges1[i] - edges2[i]);
  }
  let result = 1 / (1 + Math.sqrt(score));
  simCache.set(key, result);
  return result;
}
