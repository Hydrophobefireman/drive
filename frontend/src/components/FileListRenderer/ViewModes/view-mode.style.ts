import {css} from "catom";

export const gridMenuItemStyle = css({
  width: "100%",
  textAlign: "left",
  display: "flex",
  alignContent: "center",
  justifyContent: "flex-start",
  gap: "0.25rem",
  transition: "var(--kit-transition)",
  padding: "0.25rem",
  borderRadius: "var(--kit-radius)",
  pseudo: {
    ":hover": {
      background: "var(--kit-shade-2)",
    },
  },
  media: {
    "(max-width:600px)": {
      boxShadow: "var(--kit-shadow)",
      alignItems: "center",
    },
  },
});
export const gridMenuItemBox = css({
  display: "flex",
  flexDirection: "column",
  padding: "0.25rem",
  gap: "0.25rem",
  background: "white",
  width: "200px",
  borderRadius: "var(--kit-radius)",
  boxShadow: "var(--kit-shadow)",
});
export const gridMenuList = css({
  display: "flex",
  justifyContent: "flex-end",
  transformOrigin: "top right",
  transform: "scale(var(--scale))",
  transition: "var(--kit-transition)",
});
