import { css } from "catom";

export function ImageRenderer({url}: {url: string}) {
  return <img class={css({height: "100%"})} src={url || null} alt="Preview" />;
}
