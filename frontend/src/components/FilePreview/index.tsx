import {css} from "catom";

import {UploadCustomMetadata} from "@/api-types/files";
import {Box} from "@hydrophobefireman/kit/container";
import {useMount} from "@hydrophobefireman/kit/hooks";
import {ArrowLeftIcon} from "@hydrophobefireman/kit/icons";
import {Text} from "@hydrophobefireman/kit/text";
import {A, redirect} from "@hydrophobefireman/ui-lib";

import {useFileDecrypt} from "../../hooks/use-file-decrypt";
import {DelayedRender} from "../DelayedRender";
import {AudioRenderer, BaseAudio} from "./Renderers/audio-renderer";
import {BaseImg, ImgRenderer} from "./Renderers/img-renderer";
import {NotRenderable} from "./Renderers/not-renderable";
import {BasePdf, PdfRenderer} from "./Renderers/pdf-renderer";
import {BaseText, TextRenderer} from "./Renderers/text-renderer";
import {Renderer} from "./Renderers/types";
import {useObjectUrl} from "./Renderers/use-file";
import {BaseVideo, VideoRenderer} from "./Renderers/video-renderer";

function getRenderer(f: string, type: "base" | "blob") {
  const blob = type === "blob";
  if (f.includes("image")) return blob ? ImgRenderer : BaseImg;
  if (f.includes("text")) return blob ? TextRenderer : BaseText;
  if (f.includes("audio")) return blob ? AudioRenderer : BaseAudio;
  if (f.includes("video")) return blob ? VideoRenderer : BaseVideo;
  if (f.includes("pdf")) return blob ? PdfRenderer : BasePdf;
  return null;
}
export function FilePreview({
  file,
  children,
  onNoRenderer,
}: Renderer & {
  children?: any;
  onNoRenderer?: ({file}: {file: Blob}) => JSX.Element;
}) {
  if (!file) return;
  const Renderer =
    (getRenderer(file.type, "blob") as typeof ImgRenderer) ||
    onNoRenderer ||
    NotRenderable;
  return (
    <Box
      class={css({
        //@ts-ignore
        "--kit-switch-width": "2.8rem",
        "--kit-switch-height": "1.5rem",
      })}
    >
      <Renderer file={file} />
      {children}
    </Box>
  );
}
export interface ObjectViewProps {
  meta: UploadCustomMetadata;
  ct: string;
  url: string;
  accKey: string;
  onBack?(): void;
}
function NotAuthenticated() {
  useMount(() => redirect("/"));
  return (
    <Box class={css({marginTop: "3rem"})}>
      You need to be authenticated to view decrypted files
    </Box>
  );
}
function NoRenderer({url}: {url: string}) {
  return (
    <Box class={css({marginTop: "3rem"})}>
      <Text.p>Cannot render this file</Text.p>
      <Text.p>But you can view it here:</Text.p>
      <Box>
        <a
          class="kit-flex kit-button kit-link"
          target="_blank"
          href={url}
          label="view file"
        >
          Open File
        </a>
      </Box>
    </Box>
  );
}
export function ObjectView({meta, ct, url, accKey, onBack}: ObjectViewProps) {
  const Renderer = getRenderer(ct, "base") as typeof BaseImg;
  if (Renderer)
    return <FileRenderer onBack={onBack} src={url} Renderer={Renderer} />;
  if (!meta.enc) return <NoRenderer url={url} />;
  if (!accKey) return <NotAuthenticated />;
  return (
    <DecryptionViewer accKey={accKey} meta={meta} url={url} onBack={onBack} />
  );
}

function DecryptionViewer({
  url,
  accKey,
  meta,
  onBack,
}: Omit<ObjectViewProps, "ct">) {
  const {blob, progress} = useFileDecrypt({url, meta: meta.enc, accKey});
  if (!blob)
    return (
      <DelayedRender time={500}>
        <div
          class={css({
            transition: "var(--kit-transition)",
            transformOrigin: "left",
            width: "100%",
            maxWidth: "500px",
            margin: "auto",
            borderRadius: "55px",
            borderColor: "transparent",
            background: "#ff76f936",
            height: "10px",
          })}
        >
          <div
            style={{transform: `scaleX(${progress})`}}
            class={css({
              transition: "var(--kit-transition)",
              transformOrigin: "left",
              width: "100%",
              maxWidth: "500px",
              margin: "auto",
              borderRadius: "55px",
              borderColor: "transparent",
              background: "var(--kit-theme-fg)",
              height: "10px",
            })}
          />
        </div>
      </DelayedRender>
    );
  return (
    <Box class={css({height: "95%", width: "98%", margin: "auto"})}>
      <DecryptedFileRenderer onBack={onBack} file={blob} />
    </Box>
  );
}
function DecryptedFileRenderer({file, onBack}: {file: Blob; onBack(): void}) {
  const src = useObjectUrl(file);
  const Renderer = getRenderer(file.type, "base") as typeof BaseImg;
  return <FileRenderer src={src} Renderer={Renderer} onBack={onBack} />;
}

function FileRenderer({
  src,
  Renderer,
  onBack,
}: {
  src: string;
  Renderer;
  onBack(): void;
}) {
  return (
    <>
      <Box
        class={css({width: "100%", padding: "0", marginTop: "0rem"})}
        horizontal="left"
      >
        {onBack ? (
          <button
            onClick={onBack}
            class={css({
              transition: "var(--kit-transition)",
              pseudo: {":hover": {transform: "scale(1.05)"}},
            })}
          >
            <ArrowLeftIcon />
          </button>
        ) : (
          <A
            href="/app"
            class={css({
              transition: "var(--kit-transition)",
              pseudo: {":hover": {transform: "scale(1.05)"}},
            })}
          >
            <ArrowLeftIcon />
          </A>
        )}
      </Box>
      <Box class={css({height: "100%", width: "100vw"})}>
        <Renderer src={src} />
        <a href={src} target="_blank">
          File URL
        </a>
      </Box>
    </>
  );
}
