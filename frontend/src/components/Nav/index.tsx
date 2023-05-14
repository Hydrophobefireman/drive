import { css } from "catom";
import { revokeIntegrityToken } from "~/handlers/auth";
import { pointerEventsNone } from "~/style";
import { client, useAuthState } from "~/util/bridge";

import { useRef, useState } from "@hydrophobefireman/ui-lib";
import { Box } from "@kit/container";
import { Dropdown } from "@kit/dropdown";
import { UserCircleIcon } from "@kit/icons";

import { SwitchUsers } from "../SwitchUsers";
import {
    navActionButtonCls,
    navDropdownContainerCls,
    profileButtonCls
} from "./nav.style";

export function Nav() {
  const [isOpen, setOpen] = useState(false);
  function toggle() {
    setOpen(!isOpen);
  }
  const dropdownParentRef = useRef<HTMLElement>();
  const dropdownSiblingRef = useRef<HTMLButtonElement>();
  const [switchUsers, setSwitchUsers] = useState(false);
  async function handleNavAction(e: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    const {
      currentTarget: {
        dataset: {action},
      },
    } = e;
    setOpen(false);
    if (action === "logout:all") {
      await revokeIntegrityToken().result;
    }
    if (action === "logout") client.logoutCurrent();

    if (action === "auth:switch") setSwitchUsers(true);
  }
  const [auth] = useAuthState();
  return (
    <Box
      row
      ref={dropdownParentRef}
      element="nav"
      style={{"--kit-justify-content": "space-between"}}
      class={css({padding: "0.5rem"})}
    >
      <SwitchUsers close={() => setSwitchUsers(false)} active={switchUsers} />
      <span>Hi {auth?.user}</span>
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
              onClick={handleNavAction}
              data-action="auth:switch"
              class={navActionButtonCls}
            >
              switch users
            </button>

            <button
              onClick={handleNavAction}
              data-action="logout"
              class={navActionButtonCls}
            >
              logout
            </button>
            <button
              onClick={handleNavAction}
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
