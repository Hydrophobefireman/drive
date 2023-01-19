import {useLayoutEffect, useState} from "@hydrophobefireman/ui-lib";
const empty: any = [null, null];
export function useObjectUrl(file: Blob) {
  const [res, setRes] = useState<[string, string]>(empty);
  useLayoutEffect(() => {
    setRes(empty);
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRes([url, file.type]);
    return () => {
      URL.revokeObjectURL(url);
      setRes(empty);
    };
  }, [file]);
  return res;
}
