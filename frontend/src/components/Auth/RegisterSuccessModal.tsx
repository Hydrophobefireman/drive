import {css} from "catom";
import {User} from "~/types/user";

import {useAlerts} from "@kit/alerts";
import {Button} from "@kit/button";
import {ClipboardCopyIcon} from "@kit/icons";
import {Modal} from "@kit/modal";
import {Text} from "@kit/text";

export function RegisterSuccessModal({
  registrationInfo,
  login,
}: {
  registrationInfo: {
    user: User;
    accountKey: string;
  };
  login(user: string, key: string);
}) {
  const {show} = useAlerts();
  return (
    <Modal active>
      <Modal.Body>
        <Modal.Title>Registered</Modal.Title>
        <Text> Thanks for registering!</Text>
        <Text>
          Please save the following account key. It will <strong>NOT</strong> be
          stored or displayed again{" "}
        </Text>
        <Text
          class={css({
            wordBreak: "break-all",
            background: "var(--kit-shade-2)",
            padding: ".5rem",
            borderRadius: "10px",
          })}
        >
          {registrationInfo.accountKey}
        </Text>
        <Button
          class={css({marginTop: ".5rem", marginBottom: ".5rem"})}
          mode="secondary"
          variant="shadow"
          prefix={<ClipboardCopyIcon />}
          label="Copy"
          onClick={async () => {
            const {accountKey} = registrationInfo;
            await navigator.clipboard.writeText(accountKey);
            show({content: "Copied!"});
          }}
        >
          Copy
        </Button>
        <Modal.Actions>
          <Modal.Action
            onClick={async () => {
              const {accountKey} = registrationInfo;
              login(registrationInfo.user.user, accountKey);
            }}
            class={css({
              display: "flex",
              margin: "auto",
              alignItems: "center",
              flexDirection: "column",
            })}
          >
            <Text.span>I've saved it.</Text.span>
            <Text.span> Log me in</Text.span>
          </Modal.Action>
        </Modal.Actions>
      </Modal.Body>
    </Modal>
  );
}
