import {css} from "catom";

export const fileRenderTitleBox = css({
  position: "absolute",
  width: "100%",
  bottom: "0",
  background: "#999999a8",
  height: "2.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const fileRenderTitle = css({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  width: "98%",
  margin: "auto",
  userSelect: "none",
  textAlign: "center",
});

export const fileRenderItem = css({
  //   cursor: "pointer",
  border: "2px solid #e3e3e3",
  borderRadius: "var(--kit-radius)",
  position: "relative",
  outline: "2px dashed",
  outlineColor: "transparent",
  transition: "var(--kit-transition)",
  "--opacity": "0",

  "--pointer-events": "none",
  pseudo: {
    ":hover": {
      //@ts-ignore
      "--opacity": "1",
      "--pointer-events": "all",
    },
    '[data-selected="true"]': {
      outlineColor: "black",
      //@ts-ignore
      "--opacity": "1",
      "--pointer-events": "all",
    },
  },
});

export const fileRenderGrid = css({
  marginTop: "1rem",
  //@ts-ignore
  "--size": "225px",
  display: "grid",
  width: "95%",
  margin: "auto",
  gap: "0.5rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(var(--size), 1fr))",
  gridAutoRows: "minmax(var(--size), auto)",
});

export const buttonWrapperClass = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "95%",
  marginTop: "1rem",
  marginBottom: "1rem",
  marginLeft: "auto",
  marginRight: "auto",
});

export const checkboxCls = css({
  height: "1rem",
  width: "1rem",
  pseudo: {
    "  .kit-cb-icon-container": {
      marginRight: "0",
    },
  },
});

const _baseContainer = css({
  background: "#ffffffa3",
  borderRadius: "var(--kit-radius)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: "var(--opacity)",
  //@ts-ignore
  pointerEvents: "var(--pointer-events)",
  transition: "var(--kit-transition)",
  media: {
    "(max-width:600px)": {
      //@ts-ignore
      "--opacity": "1",
      "--pointer-events": "all",
    },
  },
});
export const menuButtonContainer = [
  _baseContainer,
  css({height: "2rem", width: "2rem"}),
].join(" ");

export const checkboxContainer = [
  _baseContainer,
  css({
    padding: "0.5rem",
  }),
].join(" ");

export const actionContainer = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

export const listViewTime = css({
  userSelect: "none",

  pseudo: {
    " .text": {color: "var(--kit-shade-3)", fontSize: "0.75rem"},
  },
  display: "flex",
  position: "relative",
  alignItems: "center",
});

export const listViewName = css({
  flex: "1",
  userSelect: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const listViewCheckbox = css({
  pseudo: {
    " .kit-cb-icon-container": {
      marginRight: "none",
    },
  },
});

export const listViewCheckboxContainer = css({
  height: "4rem",
  width: "4rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const listViewItem = css({
  boxShadow: "var(--kit-shadow)",
  borderRadius: "var(--kit-radius)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  margin: "auto",
  width: "98%",
  cursor: "pointer",
  outline: "2px dashed",
  outlineColor: "transparent",
  transition: "var(--kit-transition)",
  paddingLeft: ".5rem",
  paddingRight: ".5rem",
  pseudo: {
    "[data-selected='true']": {
      outlineColor: "black",
    },
  },
});

export const fileSelectedActionBox = (hasSelected: boolean) =>
  `${css({
    transition: "var(--kit-transition)",
    width: "95%",
    margin: "auto",
    gap: "1rem",
  })} ${
    hasSelected
      ? css({opacity: "1"})
      : css({
          opacity: "0",
          transition: "var(--kit-transition)",
          pointerEvents: "none",
        })
  }`;
