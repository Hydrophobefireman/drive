import {decode} from "blurhash";
import {FileMetadata} from "~/types/files";

import {_util} from "@hydrophobefireman/kit";
import {useEffect, useLayoutEffect, useState} from "@hydrophobefireman/ui-lib";

export interface BlurHashHookProps {
  accKey: string;
  meta: FileMetadata;
}
export function useBlurHashDecode({accKey, meta}: BlurHashHookProps) {
  const [hash, setHash] = useState<string | null>(null);
  const hasBlurHash = Boolean(meta?.previewMetadata?.upload?.hash);
  useEffect(() => {
    setHash(null);
    _util.raf(() =>
      _util.raf(() => {
        if (!meta?.previewMetadata?.upload?.hash) return null;
        const bhstring = meta.previewMetadata.upload.hash;
        let res: string;
        try {
          const thumbMeta = meta.previewMetadata.upload.mediaMetadata;
          const w = thumbMeta.thumbnailDimensions[0];
          const h = thumbMeta.thumbnailDimensions[1];
          const imgData = decode(bhstring, w, h);
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          const d = ctx.createImageData(w, h);
          d.data.set(imgData);
          ctx.putImageData(d, 0, 0);
          res = canvas.toDataURL("image/png");
        } catch (e) {
          console.warn(e);
          res = null;
        }
        setHash(res);
      })
    );

    return () => {
      setHash(null);
    };
  }, [meta, accKey]);
  return [hash, hasBlurHash] as const;
}
