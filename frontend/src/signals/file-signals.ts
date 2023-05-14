import { createSignal, Signal } from "use-signal";
import { useSignal } from "use-signal/ui-lib";

import { useRerender } from "@kit/hooks";

export const fileUploadPreferenceChanged: Signal = createSignal();
export const fetchFilesSignal: Signal = createSignal();
export const downloadFilesSignal: Signal = createSignal();

export function useFileUploadPreference() {
  const rerender = useRerender();
  useSignal(fileUploadPreferenceChanged, rerender);
}

export function useFetchFileSignal(onSignal: (e: CustomEvent<any>) => void) {
  useSignal(fetchFilesSignal, onSignal);
}

export function useFileDownloadSignal(onSignal: (e: CustomEvent<any>) => void) {
  useSignal(downloadFilesSignal, onSignal);
}
