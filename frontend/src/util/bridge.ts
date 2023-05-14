import {set} from "statedrive";
import {
  initialAuthCheckRoute,
  loginRoute,
  refreshTokenRoute,
} from "~/handlers/routes";
import {accountKeyStore} from "~/store/account-key-store";
import {User} from "~/types/user";

import {AuthBridge} from "@hydrophobefireman/flask-jwt-jskit";

import {
  fetchCurrentAccountKey,
  removeUnknownKeys,
} from "./update-account-key-state";

const client = new AuthBridge<User>().withDefaultBackingStore();

// change these according to your backend
client.routes = {
  loginRoute,
  refreshTokenRoute,
  initialAuthCheckRoute,
};
client.onLogout = async () => {
  await removeUnknownKeys();
  set(accountKeyStore, null);
  document.body.textContent = "";
  location.href = "/";
};
client.onAuthUserSwitch = async () => {
  fetchCurrentAccountKey();
};
const {useCurrentAuthState, useIsLoggedIn, useAllAuthState} = client.getHooks();
const requests = client.getHttpClient();
const useAuthState = () => {
  const currentAuth = useCurrentAuthState();
  return [currentAuth[0]?.auth, currentAuth[1]] as const;
};
export {useAuthState, useIsLoggedIn, useAllAuthState, requests, client};
