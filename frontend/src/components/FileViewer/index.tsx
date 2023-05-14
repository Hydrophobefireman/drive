import {css} from "catom";
import {publicFileURL} from "~/handlers/routes";
import {useCancellableControllerRef} from "~/hooks/use-cancellable-controller";
import {useAccountKeys} from "~/store/account-key-store";
import {FileMetadata} from "~/types/files";
import {decryptionDownloader} from "~/util/downloader";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from "@hydrophobefireman/kit-icons";
import {TextButton} from "@hydrophobefireman/kit/button";
import {Box} from "@hydrophobefireman/kit/container";
import {useEffect, useState} from "@hydrophobefireman/ui-lib";

import {PreviewBlob} from "../PreviewBlob";
import {PreviewURL} from "../PreviewURL";
import {buttonsRoot, previewRoot, textCenter} from "./file-viewer.style";
import {LoaderWithPreview, PreviewContainer, UnknownSpinner} from "./Viewers";

export function FileViewer({
  file,
  next,
  previous,
  close,
}: {
  file: FileMetadata;
  next?(): void;
  previous?(): void;
  close(): void;
}) {
  const fileType = file.customMetadata.upload.contentType;
  const previewable = ["text", "image", "audio", "video", "pdf"].some((x) =>
    fileType.includes(x)
  );
  const unencryptedUpload = file.customMetadata.upload.unencryptedUpload;

  return (
    <div class={css({maxWidth: "900px", height: "90%"})}>
      <Box horizontal="right">
        <button onClick={close} class={css({padding: "0.5rem"})}>
          <XIcon />
        </button>
      </Box>
      {previewable ? (
        unencryptedUpload ? (
          <PreviewContainer file={file}>
            <PreviewURL type={fileType} url={publicFileURL(file.key)} />
          </PreviewContainer>
        ) : (
          <EncryptedFileViewer file={file} />
        )
      ) : (
        <div class={previewRoot}>
          <div class={textCenter}>
            The requested file <b>{file.customMetadata.upload.name}</b> cannot
            be shown in this browser
          </div>
          <a
            class={css({textDecoration: "underline"})}
            href={publicFileURL(file.key)}
          >
            File URL
          </a>
        </div>
      )}
      <div
        style={!previous && !next ? {display: "none"} : {}}
        class={buttonsRoot}
      >
        <TextButton
          onClick={previous}
          class={`${css({flex: 1, justifyContent: "center"})} ${
            !previous ? css({opacity: "0", pointerEvents: "none"}) : ""
          }`}
          mode="secondary"
          variant="shadow"
          prefix={<ChevronLeftIcon />}
        >
          previous
        </TextButton>
        <TextButton
          onClick={next}
          class={`${css({flex: 1, justifyContent: "center"})} ${
            !next ? css({opacity: "0", pointerEvents: "none"}) : ""
          }`}
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

export function FileName({file}: {file: FileMetadata}) {
  const unEncrypted = file.customMetadata.upload.unencryptedUpload;
  const cls = textCenter;
  if (unEncrypted)
    return (
      <a
        href={publicFileURL(file.key)}
        target="_blank"
        class={`${cls} ${css({textDecoration: "underline"})}`}
      >
        {file.customMetadata.upload.name}
      </a>
    );
  return <div class={cls}>{file.customMetadata.upload.name}</div>;
}

function EncryptedFileViewer({file}: {file: FileMetadata}) {
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
      onError: (e) => {
        if (e.error) setStatus("ERROR");
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
      <PreviewContainer file={file}>
        <PreviewBlob blob={finalBlob} />
      </PreviewContainer>
    );
  }
  if (status === "DECRYPTING" || status === "DOWNLOADING") {
    if (hasPreview) {
      return <LoaderWithPreview file={file} percent={percent} keys={keys} />;
    }
    return <UnknownSpinner file={file} percent={percent} />;
  }
  if (status === "PENDING") return <div></div>;
}
