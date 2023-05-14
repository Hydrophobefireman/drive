import { set } from "statedrive";
import {
    accountKeyStore, ACCOUNT_SESSION_STORAGE_KEY
} from "~/store/account-key-store";

import { get, set as idbSet } from "@hydrophobefireman/flask-jwt-jskit";

import { client } from "./bridge";

export async function updateAccountKeyState(k: string) {
  const prev = (await get(ACCOUNT_SESSION_STORAGE_KEY)) || {};
  prev[client.getCurrentAuthenticatedUser()?.user] = k;
  idbSet(ACCOUNT_SESSION_STORAGE_KEY, prev);
}

export async function fetchCurrentAccountKey() {
  await client.syncWithServer();
  set(
    accountKeyStore,
    ((await get(ACCOUNT_SESSION_STORAGE_KEY)) || {})[
      client.getCurrentAuthenticatedUser()?.user
    ]
  );
  return;
}

export async function removeUnknownKeys() {
  const prev: object = (await get(ACCOUNT_SESSION_STORAGE_KEY)) || {};
  const usernames = client.getState().users.map((x) => x.auth.user);
  for (const key in prev) {
    if (usernames.includes(key)) {
      continue;
    }
    delete prev[key];
  }
  console.log(prev, usernames);
  idbSet(ACCOUNT_SESSION_STORAGE_KEY, prev);
}
