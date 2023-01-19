import {css} from "catom";
import {publicFileURL} from "~/handlers/routes";

import {_util} from "@hydrophobefireman/kit";
import {DotsHorizontalIcon} from "@hydrophobefireman/kit-icons";
import {
  useClickAway,
  useId,
  useToggleState,
} from "@hydrophobefireman/kit/hooks";
import {Checkbox} from "@hydrophobefireman/kit/input";
import {useRef} from "@hydrophobefireman/ui-lib";

import {PreviewRenderer} from "../PreviewRenderer";
import {
  actionContainer,
  checkboxCls,
  checkboxContainer,
  fileRenderItem,
  fileRenderTitle,
  fileRenderTitleBox,
  menuButtonContainer,
} from "../file-renderer.style";
import {BottomSheetMenu, MenuButtons, PopupMenu} from "./Menus";
import {ViewItem} from "./types";
import {useConfirmDelete} from "./use-confirm-delete";

export function GridItem({
  file,
  handleFileClick,
  keys,
  selectedFiles,
  isWideScreen,
  i,
}: ViewItem) {
  const {active: showMenu, toggle, setActive} = useToggleState(false);
  const dropdownSiblingRef = useRef<HTMLButtonElement>();
  const id = useId();
  const {setDeleting, deleteModal} = useConfirmDelete(file);
  useClickAway(() => {
    if (!showMenu) return;
    setActive(false);
  }, dropdownSiblingRef.current);

  const isUnencrypted = file.customMetadata.upload.unencryptedUpload;

  return (
    <div
      role="button"
      data-public-url={publicFileURL(file.key)}
      class={fileRenderItem}
      onClick={(e) => handleFileClick(e, file, i)}
    >
      {deleteModal}
      <div class={actionContainer}>
        <div class={checkboxContainer} data-is="checkbox">
          <Checkbox
            label={`Select ${file.customMetadata.upload.name}`}
            boxClass={checkboxCls}
            checked={selectedFiles.has(file)}
            onCheck={_util.noop}
          />
        </div>
        <div>
          <button
            class={menuButtonContainer}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            ref={dropdownSiblingRef}
          >
            <DotsHorizontalIcon class={css({transform: "rotate(90deg)"})} />
          </button>
          {isWideScreen ? (
            <PopupMenu id={id} active={showMenu}>
              <MenuButtons
                file={file}
                isUnencrypted={isUnencrypted}
                keys={keys}
                setDeleting={setDeleting}
              />
            </PopupMenu>
          ) : (
            <BottomSheetMenu id={id} active={showMenu}>
              <MenuButtons
                file={file}
                isUnencrypted={isUnencrypted}
                keys={keys}
                setDeleting={setDeleting}
              />
            </BottomSheetMenu>
          )}
        </div>
      </div>
      <div class={fileRenderTitleBox}>
        <span class={fileRenderTitle}>
          <span>{isUnencrypted ? null : "🔒"} </span>
          {file.customMetadata.upload.name}
        </span>
      </div>
      <PreviewRenderer file={file} decryptionKeys={keys} />
    </div>
  );
}
