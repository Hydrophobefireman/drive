import { css } from "catom";
import { useLogin } from "~/hooks/use-login";

import { A, useState } from "@hydrophobefireman/ui-lib";
import { TextButton } from "@kit/button";
import { Box } from "@kit/container";
import { Checkbox, useCheckbox } from "@kit/input";

import { Form } from "../Form";
import { ThemeInput } from "../ThemeInput";

export function Login({addingNew}: {addingNew?: boolean}) {
  const [username, setUsername] = useState("");
  const [accountKey, setAccountKey] = useState("");
  const {checked: saveKey, toggle} = useCheckbox(false);
  const [formState, setFormState] = useState<"idle" | "pending" | "registered">(
    "idle"
  );
  const login = useLogin(setFormState);
  function handleLogin() {
    login(username, accountKey, saveKey);
  }
  return (
    <Form onSubmit={handleLogin}>
      <Box>
        <ThemeInput
          required
          value={username}
          setValue={setUsername}
          label="username"
        />
        <ThemeInput
          value={accountKey}
          required
          setValue={setAccountKey}
          type="password"
          label="account key"
        />
        <div
          class={css({
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flex: 1,
          })}
        >
          <Checkbox onCheck={toggle} checked={saveKey}>
            save my key
          </Checkbox>
          <TextButton
            disabled={formState === "pending"}
            mode="secondary"
            variant="shadow"
          >
            submit
          </TextButton>
        </div>
      </Box>
      <Box horizontal="left">
        <A
          class={css({textDecoration: "underline"})}
          href="/auth?mode=register&new=true"
        >
          register
        </A>
      </Box>
    </Form>
  );
}
