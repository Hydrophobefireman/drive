import {css} from "catom";

export const pointerEventsNone = css({pointerEvents: "none"});

export const ellipsis = css({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  maxWidth: "100%",
});
