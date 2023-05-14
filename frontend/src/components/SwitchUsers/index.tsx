import {css} from "catom";
import {client, useAllAuthState} from "~/util/bridge";

import {PlusCircleIcon, UserCircleIcon} from "@hydrophobefireman/kit-icons";
import {Button} from "@hydrophobefireman/kit/button";
import {Modal} from "@hydrophobefireman/kit/modal";
import {A} from "@hydrophobefireman/ui-lib";

const navActionButtonCls = css({
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

const switchUserCls = [
  navActionButtonCls,
  css({
    borderRadius: "0",
    border: "none!important",
  }),
].join(" ");

export function SwitchUsers({active, close}: {active: boolean; close(): void}) {
  return (
    <Modal onClickOutside={() => close()} active={active}>
      {active && <_SwitchUsers close={close} />}
    </Modal>
  );
}
export function SwitchUsersContent({
  close,
  children,
}: {
  close(): void;
  children?: any;
}) {
  const [all] = useAllAuthState();

  return (
    <div
      class={css({
        border: "2px solid var(--kit-shade-2)",
        borderRadius: "10px",
        padding: "0.5rem",
        width: "100%",
      })}
    >
      {all.users.map((x, i) => (
        <Button
          onClick={() => {
            close();
            client.switchAuthenticatedUser(i);
          }}
          label={`Switch to ${x.auth.user}'s account`}
          prefix={<UserCircleIcon />}
          variant="custom"
          mode="secondary"
          class={switchUserCls}
        >
          <span
            class={css({
              marginLeft: ".5rem",
            })}
          >
            {x.auth.user}
          </span>
        </Button>
      ))}
      {children}
    </div>
  );
}
function _SwitchUsers({close}: {close(): void}) {
  return (
    <Modal.Body>
      <Modal.Title>Select User</Modal.Title>
      <SwitchUsersContent close={close}>
        <A
          href="/add-account"
          aria-label={`Add another account`}
          class={[
            switchUserCls,
            "kit-button kit-button-custom kit-button-secondary kit-flex",
            css({alignItems: "center"}),
          ]}
        >
          <PlusCircleIcon />
          <span class={css({marginLeft: ".5rem"})}>add account</span>
        </A>
      </SwitchUsersContent>
    </Modal.Body>
  );
}
