import {useEffect, useRef} from "@hydrophobefireman/ui-lib";

export function useCancellableControllerRef() {
  const controllerRef = useRef<AbortController>(new AbortController());
  useEffect(() => {
    return () => {
      controllerRef.current.abort();
    };
  }, []);
  return controllerRef;
}
