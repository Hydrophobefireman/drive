import {set} from "statedrive";
import {DelayedRender} from "~/components/DelayedRender";
import {
  ACCOUNT_SESSION_STORAGE_KEY,
  accountKeyStore,
} from "~/store/account-key-store";
import {client} from "~/util/bridge";

import {get} from "@hydrophobefireman/flask-jwt-jskit";
import {useState} from "@hydrophobefireman/ui-lib";
import {useMount} from "@kit/hooks";

export function AppLoader({children}: {children?: any}) {
  const [synced, setSynced] = useState(false);
  useMount(async () => {
    await client.syncWithServer();
    set(accountKeyStore, (await get(ACCOUNT_SESSION_STORAGE_KEY)) || null);
    setSynced(true);
  });
  if (synced) return children;
  return <DelayedRender time={1000}>Loading...</DelayedRender>;
}
