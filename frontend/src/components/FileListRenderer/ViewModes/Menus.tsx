import {css} from "catom";
import {downloadManager} from "~/handlers/managers/file-download-manager";
import {publicFileURL} from "~/handlers/routes";
import {FileDownloadTask} from "~/handlers/tasks/file-download-task";
import {FileMetadata} from "~/types/files";

import {
  ClipboardCopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  TrashIcon,
} from "@hydrophobefireman/kit-icons";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {useEffect, useRef} from "@hydrophobefireman/ui-lib";
import {BottomSheet} from "@kit/bottom-sheet";

import {
  gridMenuItemBox,
  gridMenuItemStyle,
  gridMenuList,
} from "./view-mode.style";

export function BottomSheetMenu({
  active,
  id,
  children,
}: {
  active: boolean;
  id: string;
  children?: any;
}) {
  const scrollPos = useRef({y: 0});
  useEffect(() => {
    scrollPos.current.y = window.scrollY;
  }, [active]);
  return (
    <BottomSheet
      active={active}
      height={250}
      onAnimationComplete={() => {
        window.scrollY = scrollPos.current.y;
      }}
    >
      <div
        style={{pointerEvents: active ? "all" : "none"}}
        id={id}
        class={css({
          height: "100%",
          padding: ".5rem",
          display: "grid",
        })}
      >
        {children}
      </div>
    </BottomSheet>
  );
}

export function PopupMenu({
  active,
  id,
  children,
}: {
  active?: boolean;
  id: string;
  children?: any;
}) {
  return (
    <div
      class={css({
        position: "absolute",
        top: "1.5rem",
        right: "0",
        zIndex: "10",
      })}
      style={{
        "--scale": active ? 1 : 0,
        pointerEvents: active ? "all" : "none",
      }}
    >
      <div id={id} class={gridMenuList}>
        <div class={gridMenuItemBox}>{children}</div>
      </div>
    </div>
  );
}

export function MenuButtons({
  file,
  isUnencrypted,
  keys,
  setDeleting,
}: {
  file: FileMetadata;
  keys: string;
  setDeleting(v: boolean): void;
  isUnencrypted: boolean;
}) {
  const {show} = useAlerts();
  const buttons = [
    <button
      class={gridMenuItemStyle}
      onClick={() => {
        downloadManager.addDownload(
          new FileDownloadTask(file, keys, downloadManager)
        );
      }}
    >
      <DownloadIcon />
      <span>download</span>
    </button>,
    <button class={gridMenuItemStyle} onClick={() => setDeleting(true)}>
      <TrashIcon />
      <span>delete</span>
    </button>,
    <a
      class={gridMenuItemStyle}
      target="_blank"
      href={`/viewer?key=${file.key}`}
    >
      <ExternalLinkIcon />
      <span>open in new tab</span>
    </a>,
    isUnencrypted && (
      <button
        class={gridMenuItemStyle}
        onClick={() => {
          navigator.clipboard
            .writeText(publicFileURL(file.key))
            .then(() => show({content: "copied!", type: "success"}));
        }}
      >
        <ClipboardCopyIcon />
        <span>copy direct url</span>
      </button>
    ),
  ];
  return <>{buttons}</>;
}
