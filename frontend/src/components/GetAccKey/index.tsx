import { css } from "catom";
import { client } from "~/util/bridge";
import { updateAccountKeyState } from "~/util/update-account-key-state";

import { useState } from "@hydrophobefireman/ui-lib";
import { TextButton } from "@kit/button";
import { Box } from "@kit/container";
import { Checkbox, Input, useCheckbox } from "@kit/input";
import { Modal } from "@kit/modal";
import { Text } from "@kit/text";

import { Form } from "../Form";

export function GetAccKey({setKey}: {setKey(k: string): void}) {
  const [localKey, _setKey] = useState("");
  const {checked, toggle} = useCheckbox(false);

  return (
    <Modal active={true}>
      <Modal.Body>
        <Modal.Title>Enter Account Key</Modal.Title>
        <Text class={css({marginBottom: ".5rem"})}>
          Your account key is needed to encrypt and decrypt your files for{" "}
          <span class={css({textDecoration: "underline"})}>
            {client.getCurrentAuthenticatedUser()?.user ?? "your account"}
          </span>
        </Text>
        <Form
          onSubmit={async () => {
            setKey(localKey);
            if (checked) {
              updateAccountKeyState(localKey);
            }
          }}
        >
          <Input
            value={localKey}
            required
            setValue={_setKey}
            class={css({
              boxShadow: "var(--kit-shadow)",
              marginTop: ".75rem",
            })}
            variant="material"
            label="Account Key"
            type="password"
          />
          <Checkbox onCheck={toggle} checked={checked}>
            Save my key
          </Checkbox>
          <Box row>
            <TextButton
              onClick={() => {
                client.logoutCurrent();
              }}
              type="button"
              class={css({
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: ".5rem",
                pseudo: {
                  ".kit-flex.kit-button-alert": {
                    color: "black",
                  },
                },
              })}
              variant="shadow"
              mode="alert"
            >
              Log out
            </TextButton>
            <TextButton
              class={css({
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: ".5rem",
              })}
              variant="shadow"
              mode="secondary"
            >
              Submit
            </TextButton>
          </Box>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
