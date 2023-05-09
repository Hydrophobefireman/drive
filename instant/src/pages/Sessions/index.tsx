import {css} from "catom";
import QRCode from "qrcode";
import {createState} from "statedrive";

import {FileUploadTask} from "@/handlers/file-upload-task";
import {requests} from "@/util/bridge";
import {getSessionDetailsRoute, updateSessionRoute} from "@/util/routes";
import {AbortableFetchResponse} from "@hydrophobefireman/flask-jwt-jskit";
import {
  A,
  useEffect,
  useRef,
  useRoute,
  useState,
} from "@hydrophobefireman/ui-lib";
import {Button} from "@kit/button";
import {FileDropTarget} from "@kit/file-drop-target";
import {useCachingResource, useInterval, useResource} from "@kit/hooks";
import {Modal} from "@kit/modal";

function fetchSession(
  x: string
): AbortableFetchResponse<
  {url: string | null; createdAt: number} | {error: string}
> {
  if (!x)
    return {
      controller: new AbortController(),
      headers: null,
      result: Promise.resolve({error: "invalid", data: null}),
    };
  return requests.get(getSessionDetailsRoute(x));
}
function humanReadableSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) {
    return "0 Bytes";
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${size} ${sizes[i]}`;
}
const cache = createState({name: "x"});
export default function Session() {
  const {params, search} = useRoute();
  const {resp, fetchResource} = useCachingResource(
    fetchSession,
    [params.id],
    cache
  );

  const loc = new URL(`/sessions/${params.id}?mode=qr`, location.href).href;
  useInterval(
    () => {
      if (resp && (resp as any)?.url != null) return;
      fetchResource();
    },
    !location.host.includes("localhost") ? 2000 : 5000
  );

  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">(
    "idle"
  );
  const errorRef = useRef("");
  const pathRef = useRef("");
  const [[done, left, percent], setDoneAndLeft] = useState<
    [number, number, number]
  >([null, null, null]);
  function handleFile(file: File) {
    file = Array.isArray(file) ? file[0] : file;
    setState("uploading");
    const handler = new FileUploadTask(file);
    handler.manager.addListener((data) => {
      pathRef.current = handler.path;
      if (handler.status === "COMPLETE") {
        setState("done");
        fetch(updateSessionRoute(params.id, handler.path, file.name));
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

  const [showDownloadQr, setShowDownloadQr] = useState(false);
  if (!resp) return;
  if ("error" in resp) return <div>{resp.error}</div>;
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
      <Modal active={showDownloadQr}>
        <Modal.Body>
          <Qr text={resp.url} />
          <Modal.Actions>
            <button
              onClick={() => setShowDownloadQr(false)}
              class={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                marginTop: ".5rem",
                padding: ".25rem",
                background: "var(--kit-shade-7)",
                borderRadius: "5px",
              })}
            >
              Close
            </button>
          </Modal.Actions>
        </Modal.Body>
      </Modal>
      {!resp.url && (
        <>
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
        </>
      )}

      {search.get("mode") !== "qr" && !resp?.url && (
        <div
          class={css({
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          })}
        >
          <div>Scan the code to upload the file from a different device</div>
          <Qr text={params.id ? loc : null} />
        </div>
      )}
      {resp.url && (
        <div
          class={css({
            marginTop: "2rem",
            border: "1px solid",
            padding: "1rem",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            maxWidth: "500px",
            boxShadow: "var(--kit-shadow)",
          })}
        >
          <div class={css({fontSize: "1.2rem", fontWeight: "bold"})}>
            Your file is ready!
          </div>
          <div
            class={css({display: "flex", gap: "2rem", marginTop: "0.25rem"})}
          >
            <a
              class={css({
                padding: "0.5rem",
                background: "var(--kit-shade-7)",
                transition: "0.3s ease-in-out",
                pseudo: {
                  ":hover": {
                    background: "var(--kit-shade-6)",
                  },
                },
              })}
              href={resp.url}
              download
            >
              Download file
            </a>
            <button
              onClick={() => setShowDownloadQr(true)}
              class={css({
                padding: "0.5rem",
                background: "var(--kit-shade-7)",
                transition: "0.3s ease-in-out",
                pseudo: {
                  ":hover": {
                    background: "var(--kit-shade-6)",
                  },
                },
              })}
            >
              Show QR Code
            </button>
          </div>
        </div>
      )}
      <Modal active={state !== "idle"}>
        <Modal.Body>
          <Modal.Title>
            {state === "done" ? "Click to copy" : "Uploading"}
          </Modal.Title>
          {state == "error" && <div>{errorRef.current}</div>}
          {state === "done" && (
            <>
              <button
                onClick={() => navigator.clipboard.writeText(pathRef.current)}
                class={css({
                  overflow: "hidden",
                  maxWidth: "100%",
                  textOverflow: "ellipsis",
                  transition: "0.3s ease-in-out",
                  pseudo: {
                    ":hover": {
                      background: "var(--kit-shade-7)",
                    },
                  },
                })}
              >
                {pathRef.current}
              </button>
              <Modal.Actions
                class={css({
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                })}
              >
                <a
                  href="/"
                  class={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    marginTop: ".5rem",
                    padding: ".25rem",
                    background: "var(--kit-shade-7)",
                    borderRadius: "5px",
                    width: "100%",
                  })}
                >
                  Upload another file
                </a>

                <button
                  onClick={() => setState("idle")}
                  class={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    marginTop: ".5rem",
                    padding: ".25rem",
                    background: "var(--kit-shade-7)",
                    borderRadius: "5px",
                    width: "100%",
                  })}
                >
                  Close
                </button>
              </Modal.Actions>
            </>
          )}
          {done != null && left != null && state !== "done" && (
            <div>
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
                {humanReadableSize(done)}/{humanReadableSize(left)} ( {percent}%
                )
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
}

function Qr({text}: {text: string}) {
  const [qr, setQr] = useState<string | null>("");
  useEffect(() => {
    setQr(null);
    if (!text) return;
    (async () => {
      const url = await QRCode.toDataURL(text);
      setQr(url);
    })();
  }, [text]);
  return (
    <img
      data-href={text}
      class={css({marginTop: "2rem"})}
      src={qr}
      alt="qr"
      height={196}
      width={196}
    />
  );
}
