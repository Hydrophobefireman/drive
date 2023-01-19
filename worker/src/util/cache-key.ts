import {Context} from "hono";

export function cacheKey(c: Context<any>) {
  return `http://cache.api/${c.req.param("user")}/files`;
}
