import {
  DecryptedFileListProvider,
  EncryptedFileListProvider,
} from "~/context/file-list";
import {useAuthGuard} from "~/hooks/use-auth-guard";
import {useAccountKeys} from "~/store/account-key-store";

import {GetAccKey} from "../GetAccKey";

function Keys({children}: {children?: any}) {
  const [accKey, setKey] = useAccountKeys();
  if (!accKey) return <GetAccKey setKey={setKey} />;
  return (
    <DecryptedFileListProvider accountKey={accKey}>
      {children}
    </DecryptedFileListProvider>
  );
}

export function SafeLayout({
  route = "/app",
  children,
}: {
  route?: string;
  children?: any;
}) {
  const isLoggedIn = useAuthGuard(route);
  if (!isLoggedIn) return <></>;
  return (
    <EncryptedFileListProvider>
      <Keys>{children}</Keys>
    </EncryptedFileListProvider>
  );
}
