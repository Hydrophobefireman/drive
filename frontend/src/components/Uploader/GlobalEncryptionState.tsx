import {css} from "catom";
import {uploadManager} from "~/handlers/managers/file-upload-manager";
import {useFileUploadPreference} from "~/signals/file-signals";

import {Box} from "@kit/container";
import {Switch} from "@kit/input";

export function GlobalEncryptionState() {
  useFileUploadPreference();
  const total = uploadManager.getPendingUploads().count();
  const encrypting = uploadManager
    .getPendingUploads()
    .filter((f) => f.shouldEncrypt)
    .count();

  const label = `encrypting ${encrypting}/${total} files`;
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
        state={encrypting === total ? "enabled" : "disabled"}
        label={label}
      />
      <span>{label}</span>
    </Box>
  );
}
