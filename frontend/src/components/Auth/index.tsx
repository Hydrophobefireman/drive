import {css} from "catom";

import {redirect, useMemo} from "@hydrophobefireman/ui-lib";
import {Box} from "@kit/container";
import {useLocation} from "@kit/hooks";
import {Text} from "@kit/text";

import {SwitchUsersContent} from "../SwitchUsers";
import {Login} from "./Login";
import {Register} from "./Register";

export function Auth({addingNew}: {addingNew?: boolean}) {
  const location = useLocation();

  const params = useMemo(() => new URLSearchParams(location.qs), [location.qs]);
  const mode: "register" | "login" =
    params.get("mode") === "register" ? "register" : "login";

  return (
    <Box>
      {mode === "login" ? (
        <Login addingNew={addingNew} />
      ) : (
        <Register addingNew={addingNew} />
      )}
      <div class={css({marginTop: "2rem"})}>You are also logged in as</div>
      <SwitchUsersContent
        close={() => {
          redirect("/app");
        }}
      />
      <Disclosure />
    </Box>
  );
}

function Disclosure() {
  return (
    <Box
      element="footer"
      class={css({
        background: "var(--kit-success-lightest)",
        fontSize: "0.9rem",
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        minHeight: "2rem",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      })}
    >
      <Text.p color="kit-shade-6">
        looking for the original drive account? check out the{" "}
        <a
          class={css({textDecoration: "underline"})}
          target="_blank"
          rel="noopener"
          href="https://0.drive.hpfm.dev"
        >
          previous version of drive
        </a>
      </Text.p>
    </Box>
  );
}
