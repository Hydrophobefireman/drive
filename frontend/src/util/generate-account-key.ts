import {patchGlobalThis} from "@hydrophobefireman/j-utils";
patchGlobalThis();

const HAS_CRYPTO = Boolean(globalThis.crypto);
const HAS_CRYPTO_UUID = Boolean(HAS_CRYPTO && crypto.randomUUID);
const generateUUID = (() => {
  if (HAS_CRYPTO_UUID) {
    return () => crypto.randomUUID();
  }
  if (HAS_CRYPTO) {
    return () =>
      "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
          Number(c) ^
          (crypto.getRandomValues(new Uint8Array(1))[0] &
            (15 >> (Number(c) / 4)))
        ).toString(16)
      );
  }
  throw new Error();
})();

function buf2hex(ui: Uint16Array) {
  return [...ui].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function generateAccountKey() {
  return buf2hex(crypto.getRandomValues(new Uint16Array(36)));
}

export {generateAccountKey, generateUUID};
