import {css} from "catom";
import {uploadManager} from "~/handlers/managers/file-upload-manager";
import {FileUploadTask} from "~/handlers/tasks/file-upload-task";
import {useAccountKeys} from "~/store/account-key-store";
import {useAuthState} from "~/util/bridge";
import {receiveFileUploads} from "~/util/receive-file-upload";

import {_collectors} from "@hydrophobefireman/lazy";
import {TextButton} from "@kit/button";
import {Box} from "@kit/container";
import {useFileDropListener} from "@kit/hooks";
import {PlusIcon} from "@kit/icons";

import {FileUploadConfigModal} from "./FileUploadConfigModal";
import {uploadBtn} from "./uploader.style";

export function Uploader() {
  const [keys] = useAccountKeys();
  const [user] = useAuthState();
  useFileDropListener(document.documentElement, handleFiles);
  async function handleFiles(files: File[]) {
    files.forEach((f) =>
      uploadManager.addUpload(new FileUploadTask(f, keys, user.user))
    );
  }
  async function initUploader() {
    handleFiles(await receiveFileUploads());
  }

  if (!keys) return <div>No keys?</div>;
  return (
    <Box horizontal="center" class={css({marginTop: "2rem"})}>
      <FileUploadConfigModal />
      <TextButton
        onClick={initUploader}
        variant="custom"
        class={uploadBtn}
        prefix={<PlusIcon size="1.5rem" />}
      >
        upload
      </TextButton>
    </Box>
  );
}
