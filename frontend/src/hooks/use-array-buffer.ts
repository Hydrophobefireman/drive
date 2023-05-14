import { blobToArrayBuffer } from "@hydrophobefireman/j-utils";
import { useEffect, useState } from "@hydrophobefireman/ui-lib";

export function useArrayBuffer(file: Blob) {
  const [buf, setBuf] = useState<ArrayBuffer>();
  useEffect(async () => {
    const ab = await blobToArrayBuffer(file);
    setBuf(ab);
  }, [file]);
  return buf;
}
