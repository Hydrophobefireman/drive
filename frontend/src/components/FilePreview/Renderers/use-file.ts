import {blobToArrayBuffer} from "@hydrophobefireman/j-utils";
import {useEffect, useState} from "@hydrophobefireman/ui-lib";

export function useObjectUrl(file: Blob) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);
  return src;
}

export function useArrayBuffer(file: Blob) {
  const [buf, setBuf] = useState<ArrayBuffer>();
  useEffect(async () => {
    const ab = await blobToArrayBuffer(file);
    setBuf(ab);
  }, [file]);
  return buf;
}
