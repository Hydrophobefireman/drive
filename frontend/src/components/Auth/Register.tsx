import { css } from "catom";
import { register } from "~/handlers/auth";
import { useCancellableControllerRef } from "~/hooks/use-cancellable-controller";
import { useLogin } from "~/hooks/use-login";
import { User } from "~/types/user";
import { generateAccountKey } from "~/util/generate-account-key";

import { A, useState } from "@hydrophobefireman/ui-lib";
import { useAlerts } from "@kit/alerts";
import { TextButton } from "@kit/button";
import { Box } from "@kit/container";

import { Form } from "../Form";
import { ThemeInput } from "../ThemeInput";
import { RegisterSuccessModal } from "./RegisterSuccessModal";

export function Register({addingNew}: {addingNew?: boolean}) {
  const [username, setUsername] = useState("");
  const [formState, setFormState] = useState<"idle" | "pending" | "registered">(
    "idle"
  );
  const [registrationInfo, setRegistrationInfo] = useState<{
    user: User;
    accountKey: string;
  }>();
  const ctrl = useCancellableControllerRef();
  const {persist} = useAlerts();
  const login = useLogin(setFormState);
  async function handleRegister() {
    if (formState === "pending") return;
    setFormState("pending");
    const accountKey = generateAccountKey();
    const res = register(username, accountKey);
    ctrl.current = res.controller;
    const {data, error} = await res.result;
    if (error) {
      setFormState("idle");
      return persist({
        content: error,
        cancelText: "Okay",
        actionText: "retry",
        type: "error",
        onActionClick() {
          handleRegister();
        },
      });
    }
    setFormState("registered");
    setRegistrationInfo({user: data.user_data.user, accountKey});
  }

  return (
    <>
      {formState === "registered" && (
        <RegisterSuccessModal
          registrationInfo={registrationInfo}
          login={login}
        />
      )}
      <Form onSubmit={handleRegister}>
        <Box>
          <ThemeInput
            required
            value={username}
            setValue={setUsername}
            label="username"
          />
          <div
            class={css({
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              flex: 1,
            })}
          >
            <span></span>
            <TextButton
              disabled={formState === "pending"}
              mode="secondary"
              variant="shadow"
            >
              Submit
            </TextButton>
          </div>
        </Box>
        <Box horizontal="left">
          <A
            class={css({textDecoration: "underline"})}
            href="/auth?mode=login&new=true"
          >
            Login
          </A>
        </Box>
      </Form>
    </>
  );
}
