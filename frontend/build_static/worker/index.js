self.importScripts("/blurhash/index.js");
/**
 * @type {import("blurhash")}
 */
const blurhash = self.blurHash;
self.addEventListener("message", async (e) => {
  const {hash, w, h} = e.data;
  const canvas = new OffscreenCanvas(w, h);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return self.postMessage({hash, error: true});
  }
  const imgData = blurhash.decode(hash, w, h);

  const d = ctx.createImageData(w, h);
  d.data.set(imgData);
  ctx.putImageData(d, 0, 0);
  const res = await canvas.convertToBlob();

  return self.postMessage({hash, res});
});
