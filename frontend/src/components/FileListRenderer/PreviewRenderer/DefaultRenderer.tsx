import {css} from "catom";
import {Img} from "~/components/Img";
import {PreviewInit} from "~/types/preview";

export function DefaultPreviewRenderer(
  props: Omit<PreviewInit, "decryptionKeys"> & {decryptionKeys?: any}
) {
  return (
    <Img
      remount
      class={css({
        display: "block",
        margin: "auto",
        objectFit: "cover",
        width: "50%",
        maxWidth: "150px",
        userSelect: "none",
        pointerEvents: "none",
      })}
      src={`https://icons.api.hpfm.dev/api/vs?mode=mime&name=${encodeURIComponent(
        props.file.customMetadata.upload.contentType ||
          "application/octet-stream"
      )}`}
    />
  );
}
