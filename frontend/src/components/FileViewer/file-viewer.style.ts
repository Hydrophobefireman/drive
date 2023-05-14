import {css} from "catom";
import {ellipsis} from "~/style";

export const previewRoot = css({
  width: "95%",
  margin: "auto",
  height: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  pseudo: {
    " textarea": {width: "100%"},
    " div": {
      width: "100%",
    },
  },
});
export const textCenter = `${ellipsis} ${css({textAlign: "center"})}`;
export const previewContainer = css({
  maxHeight: "95%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: "90%",
  //@ts-ignore
  "--iframe-width": "100%",
});
export const buttonsRoot = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
  margin: "auto",
  maxWidth: "300px",
});
