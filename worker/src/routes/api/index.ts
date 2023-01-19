import {getUserData, login, refreshToken, register, revokeToken} from "~/auth";
import {listUserFiles} from "~/auth/list-files";
import {authGuard, strictAuth} from "~/auth/validate";
import {buildHono} from "~/util/build-hono";

const api = buildHono();

api.post("/-/auth/register", async (c) => {
  const {user, accountKey} = (await c.req.json()) as any;
  const ret = await register(user, accountKey, c);
  return ret;
});
api.post("/-/auth/login", async (c) => {
  const {user, password: accountKey} = (await c.req.json()) as any;
  return login(user, accountKey, c);
});
api.get("/-/auth/refresh", (c) => {
  return refreshToken(c);
});
api.get("/-/auth/revoke-token", authGuard(), async (c) => {
  return revokeToken(c);
});
api.get("/-/auth/me", authGuard(), (c) => {
  return getUserData(c);
});
api.get("/user/:user/list", strictAuth(), async (c) => {
  return listUserFiles(c as any);
});

export {api};
