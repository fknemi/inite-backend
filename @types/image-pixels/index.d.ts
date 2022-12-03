declare module "image-pixels" {
  type pixels = (
    img: string
  ) => Promise<{ data: Uint8ClampedArray; width: number; height: number }>;
  const pixels: pixels;
  export = pixels;
}
