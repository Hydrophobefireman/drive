import { css } from "catom";

export function VideoRenderer({url}: {url: string}) {
  return <video class={css({height: "100%"})} controls src={url || null} />;
}
