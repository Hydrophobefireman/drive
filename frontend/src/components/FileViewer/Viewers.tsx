import {css} from "catom";
import {FileMetadata} from "~/types/files";

import {SpinnerIcon} from "@hydrophobefireman/kit-icons";

import {PreviewDecrypt} from "../FileListRenderer/PreviewRenderer/PreviewDecrypt";
import {previewContainer, previewRoot, textCenter} from "./file-viewer.style";
import {FileName} from "./index";

export function UnknownSpinner({
  file,
  percent,
}: {
  file: FileMetadata;
  percent: number;
}) {
  return (
    <ViewerRoot file={file}>
      <SpinnerIcon size={"4rem"} />
      <div
        class={css({
          fontVariantNumeric: "tabular-nums",
          fontSize: "3rem",
          textAlign: "center",
        })}
      >
        {(percent * 100).toFixed(2)}%
      </div>
    </ViewerRoot>
  );
}
export function LoaderWithPreview({
  file,
  percent,
  keys,
}: {
  file: FileMetadata;
  percent: number;
  keys: string;
}) {
  const hasPreview = !!file.previewMetadata?.upload?.mediaMetadata;
  const dims =
    hasPreview && file.previewMetadata.upload.mediaMetadata.originalDimensions;

  return (
    <ViewerRoot file={file}>
      <div
        class={previewContainer}
        style={{
          height: `${dims[1]}px`,
          width: `${dims[0]}px`,
          "--ratio": `${dims[0]}/${dims[1]}`,
        }}
      >
        <PreviewDecrypt
          decryptionKeys={keys}
          file={file}
          className={css({height: "100%", aspectRatio: "var(--ratio)"})}
        />
      </div>

      <div class={textCenter} style={{"--p": percent}}>
        {(percent * 100).toFixed(2)}%
      </div>
    </ViewerRoot>
  );
}
function ViewerRoot({file, children}: {file: FileMetadata; children?: any}) {
  return (
    <div class={previewRoot}>
      <FileName file={file} />
      {children}
    </div>
  );
}

export function PreviewContainer({
  file,
  children,
}: {
  file: FileMetadata;
  children?: any;
}) {
  const hasPreview = !!file.previewMetadata?.upload?.mediaMetadata;
  const dims =
    hasPreview && file.previewMetadata.upload.mediaMetadata.originalDimensions;

  return (
    <ViewerRoot file={file}>
      <div
        class={previewContainer}
        style={
          dims
            ? {height: `${dims[1]}px`, width: `${dims[0]}px`}
            : {height: "100%"}
        }
      >
        {children}
      </div>
    </ViewerRoot>
  );
}
