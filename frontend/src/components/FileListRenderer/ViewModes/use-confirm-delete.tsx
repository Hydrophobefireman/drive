import { css } from "catom";
import { useFileList } from "~/context/file-list";
import { deleteFiles } from "~/handlers/files";
import { FileMetadata } from "~/types/files";
import { useAuthState } from "~/util/bridge";

import { SpinnerIcon } from "@hydrophobefireman/kit-icons";
import { useAlerts } from "@hydrophobefireman/kit/alerts";
import { Modal } from "@hydrophobefireman/kit/modal";
import { useState } from "@hydrophobefireman/ui-lib";

export function useConfirmDelete(file: FileMetadata) {
  const [user] = useAuthState();
  const [isDeleting, setDeleting] = useState(false);
  const {fetchFiles} = useFileList();
  const [isLoading, setLoading] = useState(false);
  const {persist} = useAlerts();
  async function handleConfirmDelete() {
    setLoading(true);
    const {error} = await deleteFiles(user.user, [file.key]).result;
    if (error) {
      return persist({
        content: error,
        type: "error",
        actionText: "retry",
        onActionClick: handleConfirmDelete,
      });
    }
    await fetchFiles(true);
    setLoading(false);
    setDeleting(false);
  }
  const deleteModal = isDeleting && (
    <Modal active={isDeleting}>
      <Modal.Body>
        <div
          class={css({
            width: "100%",
            wordBreak: "break-word",
          })}
        >
          are you sure you want to delete{" "}
          <b>{file.customMetadata.upload.name}</b>?
        </div>
      </Modal.Body>
      <Modal.Actions>
        <Modal.Action onClick={handleConfirmDelete}>
          <span class={css({textTransform: "lowercase"})}>
            {isLoading ? <SpinnerIcon /> : "yes"}
          </span>
        </Modal.Action>
        <Modal.Action onClick={() => setDeleting(false)}>
          <span class={css({textTransform: "lowercase"})}>cancel</span>
        </Modal.Action>
      </Modal.Actions>
    </Modal>
  );
  return {setDeleting, deleteModal};
}
