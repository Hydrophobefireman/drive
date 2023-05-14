import { downloadManager } from "~/handlers/managers/file-download-manager";
import { useFileDownloadSignal } from "~/signals/file-signals";

import { DownloadIcon } from "@hydrophobefireman/kit-icons";
import { useRerender } from "@hydrophobefireman/kit/hooks";
import { _collectors } from "@hydrophobefireman/lazy";

import { Progress } from "../Progress";

export function DownloadProgress() {
  const rerender = useRerender();
  useFileDownloadSignal(rerender);
  return (
    <Progress
      icon={<DownloadIcon />}
      items={downloadManager.inProgressDownloads
        .map((x) => ({
          name: x.name,
          percent: x.progress,
          status: x.status,
          isClearable: (["DONE", "ERROR"] as (typeof x.status)[]).includes(
            x.status
          ),
          cancel: () => x.cancel(),
          clear: () => x.clearError(),
        }))
        .collect(_collectors.ARRAY_COLLECTOR)}
    />
  );
}
