import {css} from "catom";
export const uploadBtn = css({
  transition: "var(--kit-transition)",
  pseudo: {
    ":focus-visible": {outline: "2px solid"},
    ".kit-button": {
      borderRadius: "30px",
      height: "2.5rem",
      padding: "1.5rem",
      borderColor: "#e3e3e34d",
      marginBottom: ".5rem",

      backgroundColor: "var(--kit-shade-1)",
    },
    ".kit-button:hover": {
      backgroundColor: "var(--kit-shade-2)",
      transform: "scale(0.98)",
    },
  },
});

export const uploadItemCls = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "var(--kit-shadow)",
  padding: "0.5rem",
  borderRadius: "var(--kit-radius)",
  "--opacity": 0,
  "--pointer-events": "none",
  media: {
    "(max-width:600px)": {
      //@ts-ignore
      "--opacity": 1,
      "--pointer-events": "all",
    },
  },
  pseudo: {
    " .trash": {
      transition: "var(--kit-transition)",
      opacity: "var(--opacity)",
      //@ts-ignore
      pointerEvents: "var(--pointer-events)",
    },
    ":hover .trash": {
      pointerEvents: "all",
      opacity: 1,
      transition: "var(--kit-transition)",
    },
  },
});

export const previewBlobWrapper = css({
  height: "300px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

export const uploaderRootModal = css({
  //@ts-ignore
  "--kit-modal-min-width": "80vw",
  height: "95vh",
  overflowY: "auto",
  wordBreak: "break-word",
});

export const uploaderRootGrid = css({
  width: "95%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
  gap: "2rem",
});

export const fileTitleCls = css({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
});
