import {css} from "catom";
import {uploadManager} from "~/handlers/managers/file-upload-manager";
import {useFileUploadPreference} from "~/signals/file-signals";

import {Box} from "@kit/container";
import {Switch} from "@kit/input";

export function GlobalEncryptionState() {
  useFileUploadPreference();
  const isEncryptingEveryFile = uploadManager
    .getPendingUploads()
    .all((file) => file.shouldEncrypt);
  const label = `${isEncryptingEveryFile ? "" : "Not"} Encrypting every file`;
  return (
    <Box
      vertical="center"
      horizontal="left"
      class={css({marginBottom: "1rem"})}
    >
      <Switch
        onInput={(e) => {
          const {checked} = e.currentTarget as HTMLInputElement;
          uploadManager.batched_setEncryptionStatus(checked);
        }}
        state={isEncryptingEveryFile ? "enabled" : "disabled"}
        label={label}
      />
      <span>{label}</span>
    </Box>
  );
}
