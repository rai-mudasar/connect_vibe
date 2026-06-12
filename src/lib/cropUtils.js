/**
 * cropUtils.js
 * Converts a cropped pixel area from react-easy-crop into a Blob
 * using an off-screen HTML5 Canvas. The original image is never sent anywhere.
 */

/**
 * Loads an image URL into an HTMLImageElement.
 * @param {string} url - Object URL created from the selected File
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = url;
  });
}

/**
 * Takes the pixel-level crop data from react-easy-crop and draws only
 * that region onto a canvas, then exports it as a Blob.
 *
 * @param {string}  imageSrc   - Object URL of the original file (from URL.createObjectURL)
 * @param {object}  pixelCrop  - { x, y, width, height } in actual image pixels
 * @param {string}  [mimeType] - Output mime type, default "image/jpeg"
 * @param {number}  [quality]  - JPEG quality 0–1, default 0.92
 * @returns {Promise<Blob>}
 */
export async function getCroppedBlob(
  imageSrc,
  pixelCrop,
  mimeType = "image/jpeg",
  quality = 0.92
) {
  const image = await loadImage(imageSrc);

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");

  // Draw only the cropped region — the rest of the original is never rendered
  ctx.drawImage(
    image,
    pixelCrop.x,      // source x
    pixelCrop.y,      // source y
    pixelCrop.width,  // source width
    pixelCrop.height, // source height
    0,                // dest x
    0,                // dest y
    pixelCrop.width,  // dest width
    pixelCrop.height  // dest height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob returned null."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

/**
 * Convenience wrapper: crops and returns a ready-to-upload File object.
 *
 * @param {string} imageSrc
 * @param {object} pixelCrop
 * @param {string} [fileName]
 * @param {string} [mimeType]
 * @returns {Promise<File>}
 */
export async function getCroppedFile(
  imageSrc,
  pixelCrop,
  fileName = "cropped.jpg",
  mimeType = "image/jpeg"
) {
  const blob = await getCroppedBlob(imageSrc, pixelCrop, mimeType);
  return new File([blob], fileName, { type: mimeType });
}
