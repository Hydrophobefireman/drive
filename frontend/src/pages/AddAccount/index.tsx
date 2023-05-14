import {css} from "catom";
import {Auth} from "~/components/Auth";

import {Box} from "@kit/container";
import {Text} from "@kit/text";

export default function AddAccount() {
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
      <Auth addingNew />
    </Box>
  );
}
