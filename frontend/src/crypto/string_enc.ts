import {die} from "~/util/die";

import {$Iterator} from "@hydrophobefireman/lazy";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
try {
  die(!!crypto.getRandomValues);
  die(!!crypto.subtle.decrypt);
  die(!!crypto.subtle.encrypt);
  
} catch (e) {
  alert("your browser does not support crypto apis required to run this app");
}
export async function enc_string(text: string, pass: string): Promise<string> {
  const encodedPw = encoder.encode(pass);
  const pwHash = await crypto.subtle.digest("SHA-256", encodedPw);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const alg = {name: "AES-GCM", iv: iv};
  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "encrypt",
  ]);

  const encodedtext = encoder.encode(text);
  const encryptedText = await crypto.subtle.encrypt(alg, key, encodedtext);

  const ivStr = new $Iterator(iv.values()).map((x) => String.fromCharCode(x));

  const ctStr = new $Iterator(new Uint8Array(encryptedText).values()).map((x) =>
    String.fromCharCode(x)
  );
  const ch = Array.from(ivStr.chain(ctStr));
  return window.btoa(ch.join(""));
}

export async function dec_string(
  ciphertext: string,
  password: string
): Promise<string> {
  const pwUtf8 = encoder.encode(password);
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
  const ivStr = window.atob(ciphertext).slice(0, 12);

  const iv = new Uint8Array(Array.from(ivStr).map((ch) => ch.charCodeAt(0)));

  const alg = {name: "AES-GCM", iv: iv};

  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "decrypt",
  ]);

  const ctStr = window.atob(ciphertext).slice(12);
  const ctUint8 = new Uint8Array(
    Array.from(ctStr).map((ch) => ch.charCodeAt(0))
  );

  try {
    const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);
    const plaintext = decoder.decode(plainBuffer);
    return plaintext; // return the plaintext
  } catch (e) {
    throw new Error("Decrypt failed");
  }
}
