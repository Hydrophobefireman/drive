import {css} from "catom";
import {downloadManager} from "~/handlers/managers/file-download-manager";
import {publicFileURL} from "~/handlers/routes";
import {FileDownloadTask} from "~/handlers/tasks/file-download-task";
import {FileMetadata} from "~/types/files";
import {formatBytes} from "~/util/human-readable-bytes";

import {
  ClipboardCopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@hydrophobefireman/kit-icons";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {useMedia} from "@hydrophobefireman/kit/hooks";
import {Modal, useModal} from "@hydrophobefireman/kit/modal";
import {useEffect, useRef} from "@hydrophobefireman/ui-lib";
import {BottomSheet} from "@kit/bottom-sheet";

import {
  gridMenuItemBox,
  gridMenuItemStyle,
  gridMenuList,
  infoTable,
  infoTableItem,
  infoTableRow,
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
  const {active, setActive} = useModal(false);
  return (
    <>
      {active && <FileMetadataRenderer setActive={setActive} file={file} />}
      <button onClick={() => setActive(true)} class={gridMenuItemStyle}>
        <InformationCircleIcon />
        <span>info</span>
      </button>
      <button
        class={gridMenuItemStyle}
        onClick={() => {
          downloadManager.addDownload(
            new FileDownloadTask(file, keys, downloadManager),
          );
        }}
      >
        <DownloadIcon />
        <span>download</span>
      </button>
      <button class={gridMenuItemStyle} onClick={() => setDeleting(true)}>
        <TrashIcon />
        <span>delete</span>
      </button>
      <a
        class={gridMenuItemStyle}
        target="_blank"
        href={`/viewer?key=${file.key}`}
      >
        <ExternalLinkIcon />
        <span>open in new tab</span>
      </a>

      {isUnencrypted && (
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
      )}
    </>
  );
}

function FileMetadataRenderer({
  setActive,
  file,
}: {
  setActive(v: boolean): void;
  file: FileMetadata;
}) {
  const isMobile = useMedia.useMaxWidth("600px");
  return (
    <Modal
      class={css({"--kit-modal-min-width": "60vw"} as any)}
      active
      onClickOutside={() => setActive(false)}
    >
      <Modal.Body>
        {isMobile ? (
          <dl class={css({marginBottom: "10px"})}>
            <dt class={css({fontWeight: "bold"})}>name</dt>
            <dd>{file.customMetadata.upload.name}</dd>

            <dt class={css({fontWeight: "bold"})}>encrypted?</dt>
            <dd>
              {file.customMetadata.upload.unencryptedUpload ? "false" : "true"}
            </dd>

            <dt class={css({fontWeight: "bold"})}>size</dt>
            <dd>{formatBytes(file.size)}</dd>
          </dl>
        ) : (
          <table class={infoTable}>
            <thead>
              <tr>
                <th class={infoTableRow}>name</th>
                <th class={infoTableRow}>encrypted?</th>
                <th class={infoTableRow}>size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class={infoTableItem}>{file.customMetadata.upload.name}</td>
                <td class={infoTableItem}>
                  {file.customMetadata.upload.unencryptedUpload
                    ? "false"
                    : "true"}
                </td>
                <td class={infoTableItem}>{formatBytes(file.size)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal.Body>
    </Modal>
  );
}
