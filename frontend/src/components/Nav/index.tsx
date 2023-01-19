import {css} from "catom";
import {revokeIntegrityToken} from "~/handlers/auth";
import {pointerEventsNone} from "~/style";
import {client} from "~/util/bridge";

import {useRef, useState} from "@hydrophobefireman/ui-lib";
import {Box} from "@kit/container";
import {Dropdown} from "@kit/dropdown";
import {UserCircleIcon} from "@kit/icons";

import {
  navActionButtonCls,
  navDropdownContainerCls,
  profileButtonCls,
} from "./nav.style";

export function Nav() {
  const [isOpen, setOpen] = useState(false);
  function toggle() {
    setOpen(!isOpen);
  }
  const dropdownParentRef = useRef<HTMLElement>();
  const dropdownSiblingRef = useRef<HTMLButtonElement>();
  function handleLogout(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const {
      currentTarget: {
        dataset: {action},
      },
    } = e;

    if (action === "logout:all") {
      revokeIntegrityToken();
    }
    client.logout();
  }
  return (
    <Box
      ref={dropdownParentRef}
      element="nav"
      horizontal="right"
      class={css({padding: "0.5rem"})}
    >
      <button
        ref={dropdownSiblingRef}
        class={profileButtonCls}
        onClick={toggle}
        label="My Account"
      >
        <UserCircleIcon size={"2rem"} />
      </button>
      <Dropdown
        class={isOpen ? "" : pointerEventsNone}
        parent={dropdownParentRef}
        sibling={dropdownSiblingRef}
      >
        <Box horizontal="right">
          <Box class={navDropdownContainerCls(isOpen)} horizontal="left">
            <button
              onClick={handleLogout}
              data-action="logout"
              class={navActionButtonCls}
            >
              logout
            </button>
            <button
              onClick={handleLogout}
              data-action="logout:all"
              class={navActionButtonCls}
            >
              log out of all devices
            </button>
          </Box>
        </Box>
      </Dropdown>
    </Box>
  );
}
