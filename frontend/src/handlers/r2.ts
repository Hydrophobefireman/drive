import {requests} from "~/util/bridge";

import {signUrlRoute} from "./routes";

export function requestSignedURL({
  file,
  method = "PUT",
  user,
  data,
}: {
  file: string;
  method: "PUT" | "GET";
  user: string;
  data: {previewMetadata: object; uploadMetadata: object};
}) {
  return requests.postJSON<{url: string; preview: string; key: string}>(
    signUrlRoute(file, method, user),
    data,
  );
}
