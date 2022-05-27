import {css} from "catom";

import {FileListResponse} from "@/api-types/files";
import {deleteFile} from "@/handlers/files";
import {useAuthState} from "@/util/bridge";
import {getEventPath} from "@/util/get-path";
import {useAlerts} from "@hydrophobefireman/kit/alerts";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {_useHideScrollbar, useClickAway} from "@hydrophobefireman/kit/hooks";
import {XIcon} from "@hydrophobefireman/kit/icons";
import {Modal} from "@hydrophobefireman/kit/modal";
import {useCallback, useRef, useState} from "@hydrophobefireman/ui-lib";
import {mask, modal} from "@kit/classnames";
import {Skeleton} from "@kit/skeleton";

import {ObjectView} from "../FilePreview";
import {Paginate} from "../Paginate";
import {
  buttonWrapperCls,
  gridElLoader,
  gridRoot,
} from "./file-list-renderer.style";
import {FileRenderer} from "./file-renderer";
import {useFileListSelection} from "./use-file-list-selection";

export function FileListRenderer({
  files,
  fetchResource,
}: {
  files: FileListResponse;
  fetchResource(): void;
}) {
  const [user] = useAuthState();

  const {clearSelection, delegateClick, selectedIndices} =
    useFileListSelection(files);

  const render = useCallback(
    (obj: FileListResponse["objects"][0], i: number) => (
      <FileRenderer
        fetchResource={fetchResource}
        index={i}
        obj={obj}
        delegate={delegateClick}
        isSelected={selectedIndices[i]}
      />
    ),
    [selectedIndices]
  );
  const boxRef = useRef<HTMLDivElement>();
  const menuRef = useRef<HTMLElement>();
  const modalRef = useRef<HTMLDivElement>();
  useClickAway((e) => {
    const p = getEventPath(e);
    if (p.includes(modalRef.current) || p.includes(menuRef.current)) return;
    clearSelection();
  }, boxRef.current);

  const [listState, setListState] = useState<"delete" | "deleting" | "idle">(
    "idle"
  );
  const {show} = useAlerts();
  if (!files)
    return (
      <div style={{gap: "10px"}} class={gridRoot}>
        {Array.from({length: 5}).map(() => (
          <Skeleton>
            <div style={{height: "100px"}} class={gridElLoader} />
          </Skeleton>
        ))}
      </div>
    );

  function handleDelete() {
    setListState("delete");
  }
  function confDelete() {
    const toDelete = Object.keys(selectedIndices).map(
      (x) => files.objects[x as any as number].key
    );

    setListState("deleting");
    deleteFile(user.user, toDelete).result.then(({data, error}) => {
      setListState("idle");
      clearSelection();
      if (error) {
        show({
          content: `Could not delete files`,
          type: "error",
        });
      }

      fetchResource();
    });
  }
  const selectedIndiceValues = Object.values(selectedIndices);
  const hasSelections = selectedIndiceValues.some(Boolean);
  return (
    <>
      <Modal active={hasSelections && listState === "delete"}>
        <div ref={modalRef}>
          <Modal.Body>
            <Modal.Title>Confirm delete</Modal.Title>
            <Modal.Body>
              Are you sure you want to delete {selectedIndiceValues.length}{" "}
              items?
            </Modal.Body>
          </Modal.Body>
          <Modal.Actions>
            <Modal.Action onClick={confDelete}>Delete</Modal.Action>
            <Modal.Action
              onClick={() => {
                clearSelection();
                setListState("idle");
              }}
            >
              Cancel
            </Modal.Action>
          </Modal.Actions>
        </div>
      </Modal>
      <Box
        ref={menuRef}
        horizontal="right"
        style={!hasSelections && {pointerEvents: "none"}}
        class={css({padding: "1rem"})}
      >
        <TextButton
          onClick={handleDelete}
          style={!hasSelections && {opacity: 0}}
          class={css({transition: "var(--kit-transition)"})}
          variant="shadow"
          mode="error"
        >
          Delete
        </TextButton>
      </Box>
      <div style={listState === "deleting" && {display: "none"}} ref={boxRef}>
        <Paginate
          buttonClass="kit-button kit-button-secondary"
          buttonWrapperClass={buttonWrapperCls}
          listParentClass={gridRoot}
          atOnce={10}
          items={files.objects}
          render={render}
        />
      </div>
    </>
  );
}
const viewerCls = css({
  //@ts-ignore
  "--kit-modal-min-width": "85vw",
  height: "95%",
  zIndex: 1000000,
});

function Viewer({
  file,
  close,
}: {
  file: FileListResponse["objects"][0];
  close(): void;
}) {
  return (
    <Modal onClickOutside={close} onEscape={close} active class={viewerCls}>
      <Modal.Body>
        <Box horizontal="right" class={css({width: "100%"})}>
          <button
            class={css({padding: ".5rem", pseudo: {":hover": {}}})}
            aria-label="close"
            onClick={close}
          >
            <XIcon />
          </button>
        </Box>
        <ObjectView obj={file} />
      </Modal.Body>
    </Modal>
  );
}