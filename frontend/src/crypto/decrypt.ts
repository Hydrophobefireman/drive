import { dec_string } from "./string_enc";
import { EncData } from "./util";

const LATEST_VERSION = "1";
const decryptionFuncMap = {
  "1": () => import("./decrypt/decrypt-v1"),
};

export function getFunction(n: string) {
  const importFunction = decryptionFuncMap[n as keyof typeof decryptionFuncMap];
  if (!importFunction) {
    throw Error(
      "invalid password, API_VERSION exists but could not get version number"
    );
  }
  return importFunction;
}
getFunction(LATEST_VERSION)();

export async function decrypt(p: EncData, password: string) {
  const {meta: _m} = p;
  const meta = typeof _m === "string" ? JSON.parse(_m) : _m;
  const {API_VERSION: _API_VERSION} = meta;

  try {
    const API_VERSION = _API_VERSION
      ? await dec_string(_API_VERSION, password)
      : "0";
    const mod = await getFunction(API_VERSION)();
    return mod.decrypt(p, password, meta);
  } catch (e) {
    return {error: "could not decrypt, check your password"};
  }
}

const decoder = new TextDecoder();

export async function decryptJson(p: EncData, password: string) {
  const ret = await decrypt(p, password);
  if (ret instanceof ArrayBuffer) {
    return JSON.parse(decoder.decode(ret));
  }
  return ret;
}
