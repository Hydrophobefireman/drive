import { User } from "~/types/user";
import { requests } from "~/util/bridge";

import { registerRoute, revokeTokenRoute } from "./routes";

export function register(user: string, accountKey: string) {
  return requests.postJSON<{
    user_data: {user: User; accountKey: string; kv: string};
  }>(registerRoute, {user, accountKey});
}

export function revokeIntegrityToken() {
  return requests.get(revokeTokenRoute);
}
