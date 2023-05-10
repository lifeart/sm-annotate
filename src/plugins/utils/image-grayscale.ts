export function vFromRGB(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function grayscale(image: ImageData) {
  let d = image.data;
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];
    let v = vFromRGB(r, g, b)
    d[i] = d[i + 1] = d[i + 2] = v;
  }

  return image;
}
