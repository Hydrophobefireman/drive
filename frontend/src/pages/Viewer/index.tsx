import {css} from "catom";
import {FileViewer} from "~/components/FileViewer";
import {SafeLayout} from "~/components/SafeLayout";
import {useFileList} from "~/context/file-list";

import {useLocation} from "@hydrophobefireman/kit/hooks";
import {A, loadURL, useMemo} from "@hydrophobefireman/ui-lib";

function Viewer() {
  const {fileList} = useFileList();
  const qs = useLocation().qs;
  const key = useMemo(() => new URLSearchParams(qs).get("key"), [qs]);
  const file = fileList.find((file) => file.key === key);
  if (!file)
    return (
      <div>
        File not found{" "}
        <div>
          <A href="/" class={css({textDecoration: "underline"})}>
            go back
          </A>
        </div>
      </div>
    );
  return <FileViewer close={() => loadURL("/app")} file={file} />;
}

export default function () {
  const p = useLocation();
  return (
    <SafeLayout route={`${p.path}?${p.qs}`}>
      <Viewer />
    </SafeLayout>
  );
}
