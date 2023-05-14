import { requests } from "~/util/bridge";

import { signUrlRoute } from "./routes";

export function requestSignedURL({
  file,
  method = "PUT",
  user,
}: {
  file: string;
  method: "PUT" | "GET";
  user: string;
}) {
  return requests.get<{url: string; preview: string; key: string}>(
    signUrlRoute(file, method, user)
  );
}
