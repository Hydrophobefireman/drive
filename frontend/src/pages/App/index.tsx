import {FileListRenderer} from "~/components/FileListRenderer";
import {GetAccKey} from "~/components/GetAccKey";
import {Nav} from "~/components/Nav";
import {ProgressInfo} from "~/components/ProgressInfo";
import {Uploader} from "~/components/Uploader";
import {
  DecryptedFileListProvider,
  EncryptedFileListProvider,
} from "~/context/file-list";
import {useAuthGuard} from "~/hooks/use-auth-guard";
import {useAccountKeys} from "~/store/account-key-store";

function $App() {
  return (
    <>
      <Nav />
      <Uploader />
      <FileListRenderer />
      <ProgressInfo />
    </>
  );
}

function AppRenderer() {
  const [accKey, setKey] = useAccountKeys();
  if (!accKey) return <GetAccKey setKey={setKey} />;
  return (
    <DecryptedFileListProvider accountKey={accKey}>
      <$App />
    </DecryptedFileListProvider>
  );
}

export default function App() {
  const isLoggedIn = useAuthGuard("/app");
  if (!isLoggedIn) return <></>;
  return (
    <EncryptedFileListProvider>
      <AppRenderer />
    </EncryptedFileListProvider>
  );
}
