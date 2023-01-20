import {decode} from "blurhash";
import {FileMetadata} from "~/types/files";
import {blob2B64} from "~/util/blob-to-b64";

import {
  arrayBufferToBase64,
  blobToArrayBuffer,
} from "@hydrophobefireman/j-utils";
import {_util} from "@hydrophobefireman/kit";
import {useLatestRef} from "@hydrophobefireman/kit/hooks";
import {useEffect, useLayoutEffect, useState} from "@hydrophobefireman/ui-lib";

export interface BlurHashHookProps {
  accKey: string;
  meta: FileMetadata;
}
const BLURHASH_CACHE = new Map<string, string>();

const worker = new Worker("/worker/index.js");
const HAS_OFFSCREEN_CANVAS = typeof OffscreenCanvas !== "undefined";
if (!HAS_OFFSCREEN_CANVAS) worker.terminate();

export function useBlurHashDecode({accKey, meta}: BlurHashHookProps) {
  const [hash, setHash] = useState<string | null>(null);
  const hasBlurHash = Boolean(meta?.previewMetadata?.upload?.hash);
  const latestMeta = useLatestRef(meta);
  const mainThreadDecodeHasher = (bhstring: string, w: number, h: number) =>
    _util.raf(() =>
      _util.raf(() => {
        if (!meta?.previewMetadata?.upload?.hash) return null;
        let res: string;
        try {
          const imgData = decode(bhstring, w, h);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          const d = ctx.createImageData(w, h);
          d.data.set(imgData);
          ctx.putImageData(d, 0, 0);
          res = canvas.toDataURL("image/png");
          BLURHASH_CACHE.set(bhstring, res);
        } catch (e) {
          console.warn(e);
          res = null;
        }
        setHash(res);
      })
    );

  useEffect(() => {
    if (!HAS_OFFSCREEN_CANVAS) return;
    let lMeta = latestMeta.current;
    const bhstring = lMeta.previewMetadata.upload.hash;
    const thumbMeta = lMeta.previewMetadata.upload.mediaMetadata;
    const w = thumbMeta.thumbnailDimensions[0];
    const h = thumbMeta.thumbnailDimensions[1];
    async function listener(e: MessageEvent) {
      if (e.data.hash === bhstring) {
        if (e.data.error) {
          console.log("using main thread decoder");
          return mainThreadDecodeHasher(bhstring, w, h);
        }
        const b64 = await blob2B64(e.data.res);
        BLURHASH_CACHE.set(bhstring, b64);
        setHash(b64);
      }
    }
    worker.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  useEffect(() => {
    setHash(null);
    const bhstring = meta.previewMetadata.upload.hash;
    if (BLURHASH_CACHE.has(bhstring)) {
      return setHash(BLURHASH_CACHE.get(bhstring));
    }
    const thumbMeta = meta.previewMetadata.upload.mediaMetadata;
    const w = thumbMeta.thumbnailDimensions[0];
    const h = thumbMeta.thumbnailDimensions[1];
    if (HAS_OFFSCREEN_CANVAS) {
      worker.postMessage({hash: bhstring, w, h});
    } else {
      mainThreadDecodeHasher(bhstring, w, h);
    }

    return () => {
      setHash(null);
    };
  }, [meta, accKey]);
  return [hash, hasBlurHash] as const;
}
