import {} from "@kit/dropdown";

import {uploadManager} from "~/handlers/managers/file-upload-manager";
import {useFileUploadPreference} from "~/signals/file-signals";

import {UploadIcon} from "@hydrophobefireman/kit-icons";
import {_collectors} from "@hydrophobefireman/lazy";

import {Progress} from "../Progress";

const {ARRAY_COLLECTOR} = _collectors;
export function UploadProgress() {
  useFileUploadPreference();
  const manager = uploadManager;
  const inProgressUploads = manager.getInProgressUploads();
  if (manager.empty) return;
  return (
    <Progress
      icon={<UploadIcon />}
      items={inProgressUploads
        .map((u) => ({
          name: u.name,
          percent: u.percent,
          status: u.status,
          isClearable: (
            ["ERROR", "DELETED", "COMPLETE"] as (typeof u.status)[]
          ).includes(u.status),
          cancel: () => u.cancel(),
          clear: () => u.clearError(),
        }))
        .collect(ARRAY_COLLECTOR)}
    />
  );
}
