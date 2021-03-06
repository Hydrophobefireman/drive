import {set} from "statedrive";

import {User} from "@/api-types/user";
import {previewCache} from "@/hooks/use-file-decrypt";
import {accountKeyStore} from "@/store/account-key-store";
import {fileMetaStore} from "@/store/file-meta-data-store";
import {uploadJobStore} from "@/store/upload-job-store";
import {Bridge, clear} from "@hydrophobefireman/flask-jwt-jskit";
import {redirect} from "@hydrophobefireman/ui-lib";

import {initialAuthCheckRoute, loginRoute, refreshTokenRoute} from "./routes";

const client = new Bridge<User>(null);

// change these according to your backend
client.setRoutes({
  loginRoute,
  refreshTokenRoute,
  initialAuthCheckRoute,
});
client.onLogout(async () => {
  set(fileMetaStore, null);
  set(uploadJobStore, null);
  set(accountKeyStore, null);
  sessionStorage.clear();
  previewCache.clear();
  await clear();
  redirect("/");
});

const {useAuthState, useIsLoggedIn} = client.getHooks();

const requests = client.getHttpClient();

export {useAuthState, useIsLoggedIn, requests, client};
