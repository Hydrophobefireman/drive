import {FileMetadata} from "~/types/files";
import {die} from "~/util/die";

import {useClickAway} from "@hydrophobefireman/kit/hooks";
import {$Iterator, _range} from "@hydrophobefireman/lazy";
import {useRef, useState} from "@hydrophobefireman/ui-lib";

const ignoreOutOfFocus = (x: unknown) =>
  x instanceof HTMLInputElement ||
  x instanceof HTMLButtonElement ||
  (x instanceof HTMLElement && x.matches("[role='option']"));

type Click = JSX.TargetedMouseEvent<HTMLDivElement>;
type ClickRef = {e: FileMetadata; i: number};

export function useFileSelection(
  sortedFiles: FileMetadata[],
  open_somehow: (f: FileMetadata) => void
) {
  const [selectedFiles, setSelectedFiles] = useState<Set<FileMetadata>>(
    () => new Set()
  );
  const lastClickRef = useRef<ClickRef>();
  const gridRef = useRef<HTMLDivElement>();
  useClickAway((e) => {
    // let user type
    if (e.composedPath().some(ignoreOutOfFocus) || !selectedFiles.size) return;
    setSelectedFiles(new Set());
  }, gridRef.current);
  const toggle = (file: FileMetadata, index: number) =>
    setSelectedFiles((s) => {
      const ns = new Set(s);
      if (selectedFiles.has(file)) {
        ns.delete(file);
      } else {
        lastClickRef.current = {e: file, i: index};
        ns.add(file);
      }

      return ns;
    });

  function handleFileClick(e: Click, file: FileMetadata, index: number) {
    const path = e.composedPath();
    const clicked_checkbox = path.some(
      (x) => x instanceof HTMLElement && x.dataset.is === "checkbox"
    );
    const skip_click = path.some((x) => x instanceof HTMLButtonElement);
    const lastClick: ClickRef = lastClickRef.current || {
      e: {} as FileMetadata,
      i: -1,
    };

    if (!(e.ctrlKey || e.shiftKey)) {
      if (clicked_checkbox) {
        return toggle(file, index);
      }
      if (skip_click) return;
      open_somehow(file);
    } else {
      lastClickRef.current = {e: file, i: index};
      if (e.ctrlKey) {
        toggle(file, index);
        return;
      }
      die(e.shiftKey);

      if (lastClick.e) {
        // this is usually how shift click works
        // the first shift click is the main click and everything else is selected
        lastClickRef.current = lastClick;
        const start = Math.min(lastClick.i, index);
        const end = Math.max(lastClick.i, index);
        setSelectedFiles((s) => {
          const cl = new Set(s);
          new $Iterator(_range(start, end + 1)).forEach((i) => {
            cl.add(sortedFiles[i]);
          });
          return cl;
        });
      } else {
        setSelectedFiles((s) => new Set([...s, file]));
      }
    }
  }
  return {
    selectedFiles,
    handleFileClick,
    gridRef,
    clearSelectedFiles: () => setSelectedFiles(new Set()),
  };
}
