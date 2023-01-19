import {css} from "catom";

import {AudioRenderer} from "./Renderers/AudioRenderer";
import {ImageRenderer} from "./Renderers/ImgRenderer";
import {PDFRenderer} from "./Renderers/PDFRenderer";
import {PreviewText} from "./Renderers/TextRenderer";
import {VideoRenderer} from "./Renderers/VideoRenderer";

export function PreviewURL({type, url}: {url: string; type: string}) {
  if (type.includes("text")) return <PreviewText url={url} />;
  if (type.includes("image")) return <ImageRenderer url={url} />;
  if (type.includes("audio")) return <AudioRenderer url={url} />;
  if (type.includes("video")) return <VideoRenderer url={url} />;
  if (type.includes("pdf")) return <PDFRenderer url={url} />;

  return (
    <div>
      <div>The requested file cannot be shown in this browser</div>
      <a class={css({textDecoration: "underline"})} href={url}>
        File URL
      </a>
    </div>
  );
}
