import {css} from "catom";
import {useCancellableControllerRef} from "~/hooks/use-cancellable-controller";
import {useAccountKeys} from "~/store/account-key-store";
import {FileMetadata} from "~/types/files";
import {decryptionDownloader} from "~/util/downloader";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SpinnerIcon,
} from "@hydrophobefireman/kit-icons";
import {TextButton} from "@hydrophobefireman/kit/button";
import {useEffect, useState} from "@hydrophobefireman/ui-lib";

import {PreviewDecrypt} from "../FileListRenderer/PreviewRenderer/PreviewDecrypt";
import {PreviewBlob} from "../PreviewBlob";
import {
  buttonsRoot,
  previewContainer,
  previewRoot,
  textCenter,
} from "./file-viewer.style";

export function FileViewer({
  file,
  next,
  previous,
}: {
  file: FileMetadata;
  next(): void;
  previous(): void;
}) {
  return (
    <div class={css({maxWidth: "900px", height: "90%"})}>
      <$FileViewer file={file} />
      <div class={buttonsRoot}>
        <TextButton
          onClick={previous}
          class={css({flex: 1, justifyContent: "center"})}
          mode="secondary"
          variant="shadow"
          prefix={<ChevronLeftIcon />}
        >
          previous
        </TextButton>
        <TextButton
          onClick={next}
          class={css({flex: 1, justifyContent: "center"})}
          mode="secondary"
          variant="shadow"
          suffix={<ChevronRightIcon />}
        >
          next
        </TextButton>
      </div>
    </div>
  );
}

function $FileViewer({file}: {file: FileMetadata}) {
  const ref = useCancellableControllerRef();
  const [keys] = useAccountKeys();
  const [status, setStatus] = useState<
    "DOWNLOADING" | "DECRYPTING" | "PENDING" | "ERROR" | "DONE"
  >("PENDING");
  const [finalBlob, setFinalBlob] = useState<Blob>();
  const hasPreview = !!file.previewMetadata?.upload?.mediaMetadata;
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setStatus("DOWNLOADING");
    setFinalBlob(null);
    setPercent(0);
    decryptionDownloader(file, keys, {
      onReceivedAbortController: (c) => (ref.current = c),
      onBuf: ({received, total}) => {
        setPercent(received / total);
        setStatus("DOWNLOADING");
      },
      onDecryptStart: () => {
        setStatus("DECRYPTING");
      },
      onError: () => {
        setStatus("ERROR");
      },
      onResult: (blob) => {
        setStatus("DONE");
        setFinalBlob(blob);
      },
    });
    return () => {
      ref.current.abort();
    };
  }, [file]);

  const dims =
    hasPreview && file.previewMetadata.upload.mediaMetadata.originalDimensions;

  if (status === "ERROR") {
    return (
      <div>
        An error occured.{" "}
        <a href="/?err" class={css({textDecoration: "underline"})}>
          Try reloading
        </a>
      </div>
    );
  }
  if (status === "DONE") {
    return (
      <div class={previewRoot}>
        <div class={textCenter}>{file.customMetadata.upload.name}</div>
        <div
          class={previewContainer}
          style={
            dims
              ? {height: `${dims[1]}px`, width: `${dims[0]}px`}
              : {height: "100%"}
          }
        >
          <PreviewBlob blob={finalBlob} />
        </div>
      </div>
    );
  }
  if (status === "DECRYPTING" || status === "DOWNLOADING") {
    if (hasPreview) {
      return (
        <div class={previewRoot}>
          <div class={textCenter}>{file.customMetadata.upload.name}</div>
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
            {percent.toFixed(2)}
          </div>
        </div>
      );
    }
    return (
      <div class={previewRoot}>
        <div class={textCenter}>{file.customMetadata.upload.name}</div>
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
      </div>
    );
  }
  if (status === "PENDING") return <div></div>;
}
