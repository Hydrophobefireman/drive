import { createState, useSharedState } from "statedrive";
export const ACCOUNT_SESSION_STORAGE_KEY = "auth::v2::account.key";
export const accountKeyStore = createState<string>({
  name: "account-key",
});

export function useAccountKeys() {
  return useSharedState(accountKeyStore);
}
