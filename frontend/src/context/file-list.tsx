import { createState } from "statedrive";
import { DelayedRender } from "~/components/DelayedRender";
import { dec_string } from "~/crypto/string_enc";
import { getFileList } from "~/handlers/files";
import { FileListResponse, FileMetadata } from "~/types/files";
import { useAuthState } from "~/util/bridge";
import { cloneObject } from "~/util/clone";

import {
    createContext,
    useContext,
    useEffect,
    useState
} from "@hydrophobefireman/ui-lib";
import { useCachingResource } from "@kit/hooks";
import { Modal } from "@kit/modal";

const unencryptedContext = createContext<{
  fileList: FileMetadata[];
  fetchFiles<T extends boolean>(
    returnPromise?: T
  ): `${T}` extends `true` ? Promise<void> : void;
}>(null);

const decryptedFlContext = createContext<{
  fileList: FileMetadata[];
  fetchFiles<T extends boolean>(
    returnPromise?: T
  ): `${T}` extends `true` ? Promise<void> : void;
}>(null);

const store = createState<FileListResponse>({initialValue: null});
export function EncryptedFileListProvider({children}: {children?: any}) {
  const [user] = useAuthState();
  const {resp, fetchResource, error} = useCachingResource(
    getFileList,
    [user?.user],
    store,
    [user?.user]
  );

  if (error)
    return (
      <Modal active>
        <Modal.Body>
          An error occured {" ( "}
          {error}
          {" ) "}
          <div>
            <a href="/app?_">Try reloading</a>
          </div>
          <Modal.Actions>
            <Modal.Action onClick={() => (location.href = "/?")}>
              Reload
            </Modal.Action>
          </Modal.Actions>
        </Modal.Body>
      </Modal>
    );
  if (!resp) return <DelayedRender time={1000}>Fetching files</DelayedRender>;
  return (
    <unencryptedContext.Provider
      value={{fileList: resp.objects, fetchFiles: fetchResource} as any}
    >
      {children}
    </unencryptedContext.Provider>
  );
}

export function DecryptedFileListProvider({
  children,
  accountKey,
}: {
  children?: any;
  accountKey: string;
}) {
  const {fetchFiles, fileList} = useEncryptedFileList();
  const [decrypted, setDecrypted] = useState<FileMetadata[]>(null);
  useEffect(async () => {
    setDecrypted(null);
    const res = await Promise.all(
      fileList?.map(async (file) => {
        const hash = file?.previewMetadata?.upload.hash;
        if (!hash) return file;
        const clone: typeof file = {
          checksums: cloneObject(file.checksums),
          customMetadata: {upload: cloneObject(file.customMetadata.upload)},
          etag: file.etag,
          httpEtag: file.httpEtag,
          httpMetadata: cloneObject(file.httpMetadata),
          key: file.key,
          previewMetadata: {upload: cloneObject(file.previewMetadata.upload)},
          size: file.size,
          uploaded: file.uploaded,
          version: file.version,
        };

        clone.previewMetadata.upload.hash = await dec_string(hash, accountKey);
        return clone;
      })
    );
    setDecrypted(res);
  }, [fileList, accountKey]);
  useEffect(() => {});
  if (decrypted)
    return (
      <decryptedFlContext.Provider
        value={
          {
            fetchFiles,
            fileList: decrypted,
          } as any
        }
      >
        {children}
      </decryptedFlContext.Provider>
    );
}
function useEncryptedFileList() {
  return useContext(unencryptedContext);
}
export function useFileList() {
  return useContext(decryptedFlContext);
}
