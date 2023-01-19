import {css} from "catom";
import {Img} from "~/components/Img";
import {decrypt} from "~/crypto/decrypt";
import {previewFileURL} from "~/handlers/routes";
import {useObjectUrl} from "~/hooks/use-object-url";
import {PreviewEncryptionMetadata} from "~/types/files";
import {PreviewInit} from "~/types/preview";
import {requests} from "~/util/bridge";

import {useResource} from "@hydrophobefireman/kit/hooks";

import {previewImg} from "./preview.style";
import {useBlurHashDecode} from "./use-blurhash";

const cache = new Map<string, Blob>();
const DEFAULT_RES = {
  controller: new AbortController(),
  headers: Promise.resolve(new Headers()),
};

const ENABLE_CACHE = true;
function downloadPreview(
  url: string,
  keys: string,
  meta: PreviewEncryptionMetadata
) {
  if (cache.has(url) && ENABLE_CACHE) {
    // console.log("[cache] hit for:", url);
    return {
      ...DEFAULT_RES,
      result: Promise.resolve({data: cache.get(url)}),
    };
  }

  const {controller, headers, result} = requests.getBinary(url);
  return {
    controller,
    headers,
    result: result.then(async (x) => {
      if ("error" in x) {
        return {error: x.error, data: null as Blob};
      }
      const ab: ArrayBuffer = x as any;
      const res = await decrypt({encryptedBuf: ab, meta}, keys);
      if (!("error" in res)) {
        cache.set(url, new Blob([res]));
        return {data: cache.get(url)};
      }
      return {data: res};
    }),
  };
}
function $PreviewDecrypt({
  decryptionKeys,
  file,
  blurHash,
  className,
}: PreviewInit) {
  // file.key = null;
  const {resp} = useResource(
    downloadPreview,
    [
      file?.key && file.previewMetadata ? previewFileURL(file.key) : null,
      decryptionKeys,
      file.previewMetadata.upload,
    ],
    null,
    [file?.key, decryptionKeys]
  );
  const [previewURL] = useObjectUrl(resp instanceof Blob ? resp : null);
  const showHash = !resp || "error" in resp;
  return (
    <Img
      remount
      src={showHash ? blurHash : previewURL}
      class={className ?? previewImg}
    />
  );
}

export function PreviewDecrypt(props: PreviewInit) {
  const [blurHash, needsHash] = useBlurHashDecode({
    accKey: props.decryptionKeys,
    meta: props.file,
  });
  if (needsHash && !blurHash) return <></>;
  return <$PreviewDecrypt {...props} blurHash={blurHash} />;
}
