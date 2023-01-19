import {useObjectUrl} from "~/hooks/use-object-url";

import {PreviewURL} from "../PreviewURL";

export function PreviewBlob({blob}: {blob: Blob}) {
  const [url, type] = useObjectUrl(blob);
  if (!url) return <></>;
  return <PreviewURL type={type} url={url} />;
}
