// Shrinks a picked photo in the browser before it's committed, so phone photos
// (often 4000px / 5MB) land in the repo at web size.

const MAX_SIZE = 1600;
const JPEG_QUALITY = 0.82;

export type PreparedImage = {
  base64: string;
  ext: "jpg" | "png";
  width: number;
  height: number;
  previewUrl: string;
};

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file couldn't be read as an image."));
    img.src = url;
  });

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export const prepareImage = async (file: File): Promise<PreparedImage> => {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(sourceUrl);
    const scale = Math.min(1, MAX_SIZE / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser couldn't process this image.");

    // PNGs (e.g. CAD renders) keep their transparency; everything else becomes JPEG.
    const keepPng = file.type === "image/png";
    if (!keepPng) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, keepPng ? "image/png" : "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("Your browser couldn't process this image.");

    return {
      base64: await blobToBase64(blob),
      ext: keepPng ? "png" : "jpg",
      width,
      height,
      previewUrl: URL.createObjectURL(blob),
    };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "photo";
