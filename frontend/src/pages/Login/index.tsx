import {css} from "catom";
import {Auth} from "~/components/Auth";
import {useIsLoggedIn} from "~/util/bridge";

import {redirect, useEffect} from "@hydrophobefireman/ui-lib";
import {Box} from "@kit/container";
import {Text} from "@kit/text";

export default function Landing() {
  const isLoggedIn = useIsLoggedIn();
  useEffect(() => {
    if (isLoggedIn) return redirect("/app");
  }, [isLoggedIn]);
  return (
    <Box class={css({marginTop: "2rem"})}>
      <Text.h1
        class={css({
          fontSize: "max(5vw,45px)",
          fontWeight: "bold",
          margin: "0",
        })}
      >
        drive
      </Text.h1>
      <Text.p class={css({fontSize: "1.25rem", marginBottom: "1rem"})}>
        encrypted storage
      </Text.p>
      <Auth />
    </Box>
  );
}
