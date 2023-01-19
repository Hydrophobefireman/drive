import {css} from "catom";
import {uploadManager} from "~/handlers/managers/file-upload-manager";
import {FileUploadTask} from "~/handlers/tasks/file-upload-task";
import {useFileUploadPreference} from "~/signals/file-signals";

import {_collectors} from "@hydrophobefireman/lazy";
import {TextButton} from "@kit/button";
import {Box} from "@kit/container";
import {LockClosedIcon, LockOpenIcon, XIcon} from "@kit/icons";
import {Input, Switch} from "@kit/input";
import {Modal} from "@kit/modal";

import {PreviewBlob} from "../PreviewBlob";
import {GlobalEncryptionState} from "./GlobalEncryptionState";
import {
  fileTitleCls,
  previewBlobWrapper,
  uploadItemCls,
  uploaderRootGrid,
  uploaderRootModal,
} from "./uploader.style";

const {ARRAY_COLLECTOR} = _collectors;

export function FileUploadConfigModal() {
  useFileUploadPreference();
  const manager = uploadManager;
  const files = manager
    .getPendingUploads()
    .map((x) => <FileRenderer file={x} />)
    .collect(ARRAY_COLLECTOR);
  return (
    <Modal class={uploaderRootModal} active={files?.length > 0}>
      <Modal.Body>
        <div
          class={css({
            width: "95%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          })}
        >
          <GlobalEncryptionState />
          <Box row class={css({gap: "2rem"})}>
            <TextButton
              onClick={cancelAllPendingUploads}
              variant="shadow"
              mode="error"
            >
              cancel
            </TextButton>
            <TextButton
              variant="shadow"
              mode="success"
              onClick={startPendingUploads}
            >
              upload
            </TextButton>
          </Box>
        </div>
        <div class={uploaderRootGrid}>{files}</div>
      </Modal.Body>
    </Modal>
  );
}
function startPendingUploads() {
  uploadManager.startPendingUploads();
}
function cancelAllPendingUploads() {
  uploadManager.batched_cancelPendingUplaods();
}
function handleConfigChange({currentTarget}: Event) {
  const {_nodeContext, checked} = currentTarget as any;
  _nodeContext.setEncryptionStatus(checked);
}

function handlePendingUploadDelete(
  e: JSX.TargetedMouseEvent<HTMLButtonElement>
) {
  const {currentTarget} = e;
  const {_nodeContext} = currentTarget as {_nodeContext: FileUploadTask};
  uploadManager.removeUpload(_nodeContext);
}

function FileRenderer({file}: {file: FileUploadTask}) {
  return (
    <div class={uploadItemCls}>
      <Input
        class={fileTitleCls}
        setValue={(n) => file.setName(n)}
        placeholder={file.file.name}
        value={file.modifiedName ?? file.name}
      ></Input>
      <div class={previewBlobWrapper}>
        <PreviewBlob blob={file.file} />
      </div>
      <Box
        row
        class={css({
          width: "100%",
          marginTop: "1rem",
        })}
      >
        <button
          onClick={handlePendingUploadDelete}
          class="trash"
          _nodeContext={file}
        >
          <XIcon />
        </button>
        <Box row flex={1} vertical="center">
          {file.shouldEncrypt ? <LockClosedIcon /> : <LockOpenIcon />}
          <div class="kit-flex">
            <Switch
              label="Encrypt file?"
              _nodeContext={file}
              state={file.shouldEncrypt ? "enabled" : "disabled"}
              onInput={handleConfigChange}
            />
          </div>
        </Box>
      </Box>
    </div>
  );
}
