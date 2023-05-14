import {css} from "catom";

export function PDFRenderer({url}: {url: string}) {
  return (
    <iframe
      class={css({height: "100%", width: "var(--iframe-width)"})}
      src={url || "data:text/html,"}
    />
  );
}
