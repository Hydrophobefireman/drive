import {Context} from "hono";

import {Env} from "../types";
import {json} from "../util/json";

// const cache = caches.default;

async function listAll(options: R2ListOptions, bucket: R2Bucket) {
  const opt = {...options};
  const ret = await bucket.list(opt);
  let c = 1;
  let {cursor, truncated} = ret;
  while (truncated) {
    c++;
    const opt = {...options, cursor};
    const res = await bucket.list(opt);
    ret.objects = ret.objects.concat(res.objects);
    cursor = res.cursor;
    truncated = res.truncated;
  }
  return ret;
}
function objectsByKeys(obj: R2Object[]): Record<string, R2Object> {
  return Object.fromEntries(obj.map((d) => [d.key, d]));
}
interface ObjectInfo {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  checksums: R2Checksums;
  uploaded: Date;
  httpMetadata?: R2HTTPMetadata | undefined;
  customMetadata?: Record<string, any> | undefined;
  range?: R2Range | undefined;
  previewMetadata?: Record<string, string> | null;
}
export async function listUserFiles(c: Context<"user", {Bindings: Env}>) {
  // const maybe = await cache.match(cacheKey(c));
  // if (maybe) {
  //   console.log(`[cache] hit for ${cacheKey(c)}`);
  //   return new Response(maybe.body);
  // }
  const {user} = c.req.param();
  if (!user) return json({error: "Missing username"}, 400);

  const {B_GALLERY, B_PREVIEWS} = c.env;

  const driveOpt: R2ListOptions = {
    prefix: `${user}/`,
    include: ["customMetadata", "httpMetadata"],
  } as any;

  const previewOpt: R2ListOptions = {
    prefix: `${user}/`,
    include: ["customMetadata"],
  } as any;

  const drive = await listAll(driveOpt, B_GALLERY);
  const previews = await listAll(previewOpt, B_PREVIEWS);

  const previewsByKeys = objectsByKeys(previews.objects);
  const objects = [];
  for (const obj of drive.objects) {
    const cl: ObjectInfo = {...obj};
    cl.previewMetadata = previewsByKeys?.[obj.key]?.customMetadata || null;
    objects.push(cl);
  }

  const res = {
    cursor: drive.cursor,
    delimitedPrefixes: drive.delimitedPrefixes,
    objects,
    trucated: drive.truncated,
  };
  const resp = json(res);
  // await cache.put(cacheKey(c), resp.clone());
  return resp;
}
