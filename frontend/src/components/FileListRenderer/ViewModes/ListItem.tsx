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

import {DefaultPreviewRenderer} from "../PreviewRenderer/DefaultRenderer";
import {
  listViewCheckbox,
  listViewCheckboxContainer,
  listViewItem,
  listViewName,
  listViewTime,
  menuButtonContainer,
} from "../file-renderer.style";
import {BottomSheetMenu, MenuButtons, PopupMenu} from "./Menus";
import {ViewItem} from "./types";
import {useConfirmDelete} from "./use-confirm-delete";

const formatter = new Intl.DateTimeFormat("en", {
  dateStyle: "short",
  timeStyle: "short",
});
export function ListItem({
  file,
  handleFileClick,
  i,
  keys,
  selectedFiles,
  isWideScreen,
}: ViewItem) {
  const id = useId();
  const {setDeleting, deleteModal} = useConfirmDelete(file);
  const {active: showMenu, toggle, setActive} = useToggleState(false);
  const dropdownSiblingRef = useRef<HTMLButtonElement>();
  useClickAway(() => {
    if (!showMenu) return;
    setActive(false);
  }, dropdownSiblingRef.current);
  const isUnencrypted = file.customMetadata.upload.unencryptedUpload;
  return (
    <div
      data-public-url={publicFileURL(file.key)}
      data-selected={selectedFiles.has(file)}
      onClick={(e) => {
        handleFileClick(e, file, i);
      }}
      role="button"
      class={listViewItem}
    >
      {deleteModal}
      <div data-is="checkbox" class={listViewCheckboxContainer}>
        {selectedFiles.has(file) ? (
          <Checkbox checked onCheck={_util.noop} boxClass={listViewCheckbox} />
        ) : (
          <DefaultPreviewRenderer file={file} />
        )}
      </div>
      <div class={listViewName} data-click-target>
        <span>
          {file.customMetadata.upload.unencryptedUpload ? null : "🔒"}
        </span>
        <span>{file.customMetadata.upload.name}</span>
      </div>
      <div class={listViewTime}>
        <span class="text">{formatter.format(file.uploaded)}</span>

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
  );
}
