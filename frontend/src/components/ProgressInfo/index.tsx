import { css } from "catom";

import { DownloadProgress } from "../DownloadProgress";
import { UploadProgress } from "../UploadProgress";

export function ProgressInfo() {
  return (
    <div
      class={css({
        zIndex: 111,
        position: "fixed",
        bottom: ".5rem",
        width: "100vw",
        maxWidth: "400px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        background: "white",
        right: ".5rem",
      })}
    >
      <UploadProgress />
      <DownloadProgress />
    </div>
  );
}
