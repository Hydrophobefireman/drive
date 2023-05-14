import {set} from "statedrive";
import {accountKeyStore} from "~/store/account-key-store";
import {client} from "~/util/bridge";
import {updateAccountKeyState} from "~/util/update-account-key-state";

import {redirect} from "@hydrophobefireman/ui-lib";
import {useAlerts} from "@kit/alerts";

export function useLogin(setFormState: (a: "pending" | "idle") => void) {
  const {persist} = useAlerts();
  return async function login(user: string, key: string, saveKey?: boolean) {
    setFormState("pending");
    const {error} = await client.login(user, key).result;
    setFormState("idle");
    if (error) {
      return persist({
        content: error,
        cancelText: "Okay",
        actionText: "retry",
        type: "error",
        onActionClick() {
          login(user, key, saveKey);
        },
      });
    }
    if (saveKey) {
      updateAccountKeyState(key);
    }
    set(accountKeyStore, key);
    return redirect("/app");
  };
}
