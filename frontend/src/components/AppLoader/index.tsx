import { DelayedRender } from "~/components/DelayedRender";
import { fetchCurrentAccountKey } from "~/util/update-account-key-state";

import { useState } from "@hydrophobefireman/ui-lib";
import { useMount } from "@kit/hooks";

export function AppLoader({children}: {children?: any}) {
  const [synced, setSynced] = useState(false);
  useMount(async () => {
    await fetchCurrentAccountKey();
    setSynced(true);
  });
  if (synced) return children;
  return <DelayedRender time={1000}>Loading...</DelayedRender>;
}
