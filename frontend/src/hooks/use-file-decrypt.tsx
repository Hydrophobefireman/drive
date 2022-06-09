import {decode} from "blurhash";

import {decrypt} from "@/crypto/decrypt";
import {dec} from "@/crypto/string_enc";
import {requests} from "@/util/bridge";
import {_util} from "@hydrophobefireman/kit";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "@hydrophobefireman/ui-lib";

export const NEEDS_BLUR_HASH = null;
export const previewCache = new Map<string, Blob>();
export interface BlurHashHookProps {
  meta?: string;
  accKey?: string;
}
export function useCreateBlurHashIfNeeded({
  accKey,
  meta,
  url,
}: BlurHashHookProps & {url: string}) {
  const parsed = useMemo(() => JSON.parse(meta), [meta]);
  const hasHash = !!parsed.hash;
}

export function useBlurHashDecode({accKey, meta}: BlurHashHookProps) {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    setHash(() => {
      if (!meta) return null;
      const parsedMeta = JSON.parse(meta);
      const bhstring = parsedMeta.hash;
      if (!bhstring) return NEEDS_BLUR_HASH;
      try {
        const decr = dec(accKey);
        const thumbMeta = JSON.parse(decr(parsedMeta.thumbMeta));
        const w = thumbMeta.thumbnailDimensions[0];
        const h = thumbMeta.thumbnailDimensions[1];
        const imgData = decode(decr(bhstring), w, h);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        const d = ctx.createImageData(w, h);
        d.data.set(imgData);
        ctx.putImageData(d, 0, 0);

        return canvas.toDataURL("image/png");
      } catch (e) {
        console.warn(e);
        return null;
      }
    });
  }, [meta, accKey]);
  return hash;
}
export function useFileDecrypt({
  accKey,
  meta,
  url,
  cache,
}: {
  url: string;
  meta: string;
  accKey: string;
  cache?: boolean;
}) {
  const {show} = useAlerts();
  const [blob, setBlob] = useState<Blob>();
  const [progress, setProgress] = useState(0);

  const download = useCallback(
    (url: string) =>
      requests.getBinaryStram(url, {}, {}, ({received, total}) =>
        setProgress(received / total)
      ),
    [url]
  );

  useEffect(() => {
    const key = `${url}::${meta}::${accKey}`;
    if (cache && previewCache.has(key)) {
      setBlob(previewCache.get(key));
      return;
    }
    setBlob(null);

    const {controller, result} = download(url);

    (async () => {
      const ret = await result;
      if ("error" in ret) {
        return show({
          content: ret.error || "An error occured",
          type: "error",
        });
      }
      if (!(ret instanceof ArrayBuffer)) return;
      const parsed = JSON.parse(meta);
      const res = await decrypt({meta, encryptedBuf: ret}, accKey);
      if (res.error) {
        setProgress(0);
        return show({content: res.error, type: "error"});
      }
      const decryptedData = new Blob([res], {type: dec(accKey)(parsed.type)});
      if (cache) {
        previewCache.set(key, decryptedData);
      }
      setProgress(0);
      setBlob(decryptedData);
    })().catch((e) => {});

    return () => controller.abort();
  }, [url, meta]);
  return {blob, progress};
}
