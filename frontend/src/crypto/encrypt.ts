import {arrayBufferToBase64} from "@hydrophobefireman/j-utils";

import {API_VERSION} from "./constants";
import {EncData, enc_string, generateKey} from "./util";

export async function encrypt(
  file: ArrayBuffer,
  password: string,
  additional?: any
): Promise<EncData> {
  const salt = crypto.getRandomValues(new Uint8Array(100));
  const {key, ITER_COUNT} = await generateKey(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(50)).buffer;
  const encryptedBuf = await crypto.subtle.encrypt(
    {name: "AES-GCM", iv},
    key,
    file
  );
  return {
    encryptedBuf,
    meta: {
      API_VERSION: await enc_string(API_VERSION, password),
      salt: await arrayBufferToBase64(salt.buffer),
      ITER_COUNT,
      iv: await arrayBufferToBase64(iv),
      ...additional,
    },
  };
}
const encoder = new TextEncoder();
export function encryptJson(json: object, password: string, additional?: any) {
  return encrypt(encoder.encode(JSON.stringify(json)), password, additional);
}
