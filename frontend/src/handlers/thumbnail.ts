import {encode} from "blurhash";

export interface ThumbResult {
  blob: Blob;
  hash: string;
  meta: {
    originalDimensions: [number, number];
    thumbnailDimensions: [number, number];
  };
}

class Thumbnail {
  private type: "image" | "video";
  private url: string | null;
  constructor(
    private file: Blob,
    private width: number = 300,
    private height?: number
  ) {
    const type: "image" | "video" | "unknown" = file.type.includes("image")
      ? "image"
      : file.type.includes("video")
      ? "video"
      : "unknown";
    if (type === "unknown") {
      throw new Error("Invalid blob");
    }
    this.type = type;
  }
  private _createObjectURL() {
    const url = URL.createObjectURL(this.file);
    this.url = url;
    return url;
  }
  private _canvas(v: HTMLImageElement | HTMLVideoElement) {
    const canvas = document.createElement("canvas");
    const aspect =
      v instanceof Image
        ? v.naturalHeight / v.naturalWidth
        : v.videoHeight / v.videoWidth;

    canvas.width = this.width || this.height / aspect;
    canvas.height = this.height || this.width * aspect;
    const ctx = canvas.getContext("2d");
    if (ctx == null) throw new Error("");
    return {ctx, canvas};
  }
  private _fromImage() {
    const img = new Image();
    const prom = new Promise<ThumbResult>((resolve, reject) => {
      img.onload = () => {
        const {ctx, canvas} = this._canvas(img);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((b) => {
          if (b == null) return reject(null);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const hash = encode(imgData.data, canvas.width, canvas.height, 4, 3);
          resolve({
            blob: b,
            hash,
            meta: {
              originalDimensions: [img.width, img.height],
              thumbnailDimensions: [canvas.width, canvas.height],
            },
          });
        }, "image/png");
      };
      img.onerror = () => {
        reject(null);
      };
    });
    img.src = this._createObjectURL();
    return prom;
  }

  _getRandomVideoFrame(video: HTMLVideoElement) {
    return Promise.race([
      new Promise<number>((resolve) => {
        video.addEventListener(
          "loadeddata",
          () => resolve(Math.floor(Math.random() * Math.floor(video.duration))),
          false
        );
      }),
      new Promise<number>((r) =>
        setTimeout(() => {
          console.log("timeout");
          r(null);
        }, 10000)
      ),
    ]);
  }
  private async _fromVideo() {
    const video = document.createElement("video");
    const prom = Promise.race([
      new Promise<ThumbResult>((resolve, reject) => {
        video.addEventListener("loadedmetadata", async () => {
          const frame = await this._getRandomVideoFrame(video);
          if (frame == null) return resolve(null);
          const seekedPromise = new Promise((resolve) =>
            video.addEventListener("seeked", resolve, {once: true})
          );
          video.currentTime = frame;
          await seekedPromise;
          const {canvas, ctx} = this._canvas(video);

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((b) => {
            if (b == null) return reject(null);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const hash = encode(
              imgData.data,
              canvas.width,
              canvas.height,
              4,
              3
            );
            resolve({
              blob: b,
              hash,
              meta: {
                originalDimensions: [video.videoWidth, video.videoHeight],
                thumbnailDimensions: [canvas.width, canvas.height],
              },
            });
          }, "image/png");
        });
      }),
      new Promise((r) => {
        setTimeout(() => {
          console.log("timeout");
          r(null);
        }, 10000);
      }),
    ]);
    video.src = this._createObjectURL();
    return prom;
  }
  private collectGarbage() {
    if (!this.url) return;
    URL.revokeObjectURL(this.url);
  }
  async generate(): Promise<ThumbResult> {
    if (this.type === "image") {
      const ret = await this._fromImage();
      this.collectGarbage();
      return ret;
    }
    const ret = await this._fromVideo();
    this.collectGarbage();
    return ret;
  }
}

export function createThumbnail(
  file: Blob,
  {height, width}: {width?: number; height?: number} = {}
) {
  return new Thumbnail(file, width, height).generate();
}
