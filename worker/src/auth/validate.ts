import {Context, Next} from "hono";
import type {Environment} from "hono/dist/types";
import {json} from "~/util/json";

import {decodeAuth, validateAuth} from "./index";

export function authGuard<T extends string = "">(
  check?: (
    c: Context<T>,
    user: {user: string; is_approved: boolean}
  ) => Response | null
) {
  return async (c: Context<T, any>, n: Next) => {
    let isValid: boolean;
    try {
      isValid = await validateAuth(c as any);
    } catch (e: any) {
      c.res = json({error: e.message ?? String(e)}, 401);
      return;
    }
    if (!isValid) {
      c.res = json({error: "Not authenticated"}, 401);
      return;
    }
    if (check) {
      const ret = check(c, decodeAuth(c as any));
      if (ret) {
        c.res = ret;
        return;
      }
    }
    await n();
  };
}

export function strictAuth(
  {checkApproval}: {checkApproval?: boolean} = {checkApproval: false}
) {
  return authGuard(function (c: Context<"user", Environment>, user) {
    if (!user) return null;
    const {user: username} = c.req.param();
    if (user.user !== username) {
      return json({error: "Unauthorized"}, 401);
    }
    if (checkApproval && !user.is_approved) return json({error: "Unapproved"});
    return null;
  });
}
