import { css } from "catom";

export const previewImg = css({
  position: "absolute",
  top: "0",
  bottom: "0",
  left: "0",
  right: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: "-1",
  pointerEvents: "none",
  userSelect: "none",
});
