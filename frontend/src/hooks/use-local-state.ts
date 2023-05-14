import {useEffect, useState} from "@hydrophobefireman/ui-lib";

export function useLocalState<T>(name: string, defaultV: T) {
  const [v, setV] = useState(() => {
    const localV = localStorage.getItem(name);
    return localV ? JSON.parse(localV) : defaultV;
  });
  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(v));
  }, [v]);
  return [v, setV];
}
