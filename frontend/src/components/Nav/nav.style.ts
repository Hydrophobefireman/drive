import {css} from "catom";

export const profileButtonCls = css({
  padding: "0.5rem",
  borderRadius: "50%",
  height: "3rem",
  width: "3rem",
  transition: "var(--kit-transition)",
  boxShadow: "var(--kit-shadow)",
  pseudo: {
    ":hover": {
      transform: "scale(1.05)",
    },
  },
});

const _navDropdownContainerBasecls = `kit-inline-flex ${css({
  transition: "0.3s ease",
  transformOrigin: "top right",
  padding: "0.5rem",
  boxShadow: "var(--kit-shadow)",
  gap: ".15rem",
  marginRight: "10px",
  background: "var(--kit-background)",
})}`;
export const navDropdownContainerCls = (isOpen: boolean) =>
  `${_navDropdownContainerBasecls} ${
    isOpen
      ? css({transform: "scale(1)"})
      : css({
          transform: "scale(0.7)",
          opacity: 0,
          pointerEvents: "none",
        })
  }`;

export const navActionButtonCls = css({
  borderRadius: "var(--kit-radius)",
  width: "100%",
  textAlign: "left",
  transition: "0.3s ease",
  padding: "0.25rem",
  pseudo: {
    ":hover": {
      background: "var(--kit-shade-2)",
    },
  },
});
