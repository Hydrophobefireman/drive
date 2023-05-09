import {css} from "catom";
import QRCode from "qrcode";

import {FileUploadTask} from "@/handlers/file-upload-task";
import {requests} from "@/util/bridge";
import {getSessionDetailsRoute} from "@/util/routes";
import {AbortableFetchResponse} from "@hydrophobefireman/flask-jwt-jskit";
import {useEffect, useRef, useRoute, useState} from "@hydrophobefireman/ui-lib";
import {Button} from "@kit/button";
import {FileDropTarget} from "@kit/file-drop-target";
import {useInterval, useResource} from "@kit/hooks";
import {Modal} from "@kit/modal";

function fetchSession(
  x: string
): AbortableFetchResponse<{url: string | null; createdAt: number}> {
  if (!x)
    return {
      controller: null,
      headers: null,
      result: Promise.resolve({error: "invalid", data: null}),
    };
  return requests.get(getSessionDetailsRoute(x));
}

export default function Session() {
  const {params, search} = useRoute();
  const {resp, fetchResource} = useResource(fetchSession, [params.id]);
  const [qr, setQr] = useState<string | null>("");
  const loc = new URL(`/sessions/${params.id}?mode=qr`, location.href).href;
  useInterval(
    () => fetchResource(),
    !location.host.includes("localhost") ? 2000 : null
  );
  useEffect(() => {
    setQr(null);
    if (!params.id) return;
    (async () => {
      const url = await QRCode.toDataURL(loc);
      setQr(url);
    })();
  }, [loc]);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const errorRef = useRef("");
  const [[done, left, percent], setDoneAndLeft] = useState<
    [number, number, number]
  >([null, null, null]);
  function handleFile(file: File) {
    file = Array.isArray(file) ? file[0] : file;
    setState("uploading");
    const handler = new FileUploadTask(file);
    handler.manager.addListener((data) => {
      if (handler.status === "COMPLETE") {
        setState("done");
      } else if (handler.status === "ERROR") {
        setState("error");
        errorRef.current = handler.errorMessage;
      } else if (handler.status === "STARTED") {
        setDoneAndLeft([
          handler.uploadedSize,
          handler.uploadSize,
          handler.percent,
        ]);
      }
    });
    handler.start();
  }
  console.log(qr);
  return (
    <section
      data-id={params.id}
      class={css({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        flexDirection: "column",
      })}
    >
      <h1>Temp Files</h1>
      <div>Files uploaded here will be deleted every 24 hours</div>
      <FileDropTarget
        class={css({
          pseudo: {
            ".kit-file-drop-target": {
              border: "1px dashed white",
              padding: "1.5rem",
              background: "black",
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "500px",
            },
          },
        })}
        onUpdate={handleFile}
        message="Drag and drop"
      >
        <Button label="select files">Select files</Button>
      </FileDropTarget>

      {search.get("mode") !== "qr" && !resp?.url && qr && (
        <div
          class={css({
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          })}
        >
          <div>Scan the code to upload the file from a different device</div>
          <img
            data-href={loc}
            class={css({marginTop: "2rem"})}
            src={qr}
            alt="qr"
            height={196}
            width={196}
          />
        </div>
      )}

      <Modal active={state !== "idle"}>
        <Modal.Body>
          <Modal.Title>Uploading</Modal.Title>
          <div
            style={{transform: `scaleX(${done / left})`}}
            class={css({
              background: "blue",
              borderRadius: "20px",
              height: "20px",
              width: "100%",
              transformOrigin: "left",
            })}
          ></div>
          <div>
            {done}/{left} ( {percent}%)
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
}
