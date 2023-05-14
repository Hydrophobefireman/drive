import {decrypt} from "~/crypto/decrypt";
import {publicFileURL} from "~/handlers/routes";
import {FileMetadata} from "~/types/files";

import {requests} from "./bridge";

export interface Callbacks {
  onBuf?(obj: {received: number; total: number; chunk: Uint8Array}): void;
  onReceivedAbortController?(a: AbortController): void;
  onError?(error: {error: any}): void;
  onDecryptStart?(): void;
  onResult?(blob: Blob): void;
}

export async function decryptionDownloader(
  file: FileMetadata,
  keys: string,
  callbacks: Callbacks
) {
  const {onBuf, onDecryptStart, onError, onReceivedAbortController, onResult} =
    callbacks;
  const {unencryptedUpload} = file.customMetadata.upload;
  const {controller, result} = requests.getBinaryStream(
    publicFileURL(file.key),
    null,
    onBuf
  );
  onReceivedAbortController?.(controller);
  const buf = await result;
  if ("error" in buf || !(buf instanceof ArrayBuffer)) {
    return onError(buf as any);
  }

  let resultBlob: Blob;
  if (unencryptedUpload) {
    const b = new Blob([buf], {type: file.customMetadata.upload.contentType});
    resultBlob = b;
  } else {
    onDecryptStart?.();
    const res = await decrypt(
      {encryptedBuf: buf, meta: file.customMetadata.upload},
      keys
    );
    if ("error" in res) {
      return onError?.(res);
    }
    const b = new Blob([res], {type: file.customMetadata.upload.contentType});
    resultBlob = b;
  }
  onResult?.(resultBlob);
}
