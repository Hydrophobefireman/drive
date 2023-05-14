import {css} from "catom";

import {useEffect, useState} from "@hydrophobefireman/ui-lib";

export function PreviewText({url}: {url: string}) {
  const [text, setText] = useState("");
  useEffect(async () => {
    setText("");
    if (!url) return;
    const response = await fetch(url);
    setText(await response.text());
  }, [url]);
  return (
    <div class={css({height: "100%"})}>
      <textarea class={css({height: "100%"})} readOnly disabled>
        {text}
      </textarea>
    </div>
  );
}
