import {encrypt} from "~/crypto/encrypt";
import {enc_string} from "~/crypto/string_enc";
import {amzHeaders} from "~/util/amz-headers";
import {blobToArrayBuffer} from "~/util/blob-to-array-buffer";

import {createThumbnail} from "./thumbnail";

const PREVIEW_WIDTH = 300;
export type GeneratedPreviewResult = readonly [ArrayBuffer, object];
export async function previewGenerator(
  file: File,
  keys: string,
): Promise<GeneratedPreviewResult> {
  const thumb = await createThumbnail(file, {width: PREVIEW_WIDTH});
  if (!thumb) return [null, null];
  const {blob, hash, meta} = thumb;
  const buf = await blobToArrayBuffer(blob);
  const {encryptedBuf, meta: encryptedMeta} = await encrypt(buf, keys, {
    mediaMetadata: meta,
    hash: await enc_string(hash, keys),
  });
  return [encryptedBuf, encryptedMeta] as const;
}

function sendToR2(
  url: string,
  data: RequestInit["body"],
  controller: AbortController,
  metadata: Record<string, any> = {},
  headers: Record<string, string> = {},
) {
  return fetch(url, {
    method: "PUT",
    body: data,
    signal: controller.signal,
    headers: {
      ...amzHeaders(url, metadata),
      ...headers,
    },
  });
}

export async function uploadPreview({
  previewResult,
  previewUploadURL,
}: {
  previewResult: GeneratedPreviewResult;
  previewUploadURL: string;
}) {
  const [encryptedBuf, encryptedMeta] = previewResult;
  if (!encryptedBuf) return {};
  const controller = new AbortController();
  const getResult = () =>
    sendToR2(previewUploadURL, encryptedBuf, controller, encryptedMeta);
  return {getResult, controller};
}
