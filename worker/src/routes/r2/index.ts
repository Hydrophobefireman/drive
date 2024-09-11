import {decodeAuth} from "~/auth";
import {strictAuth} from "~/auth/validate";
import {signUrl} from "~/r2/sign-url";
import {CONFIG} from "~/util/bucket-config";
import {buildFilePath} from "~/util/build-file-path";
import {buildHono} from "~/util/build-hono";
import {json} from "~/util/json";
import {uuid} from "~/util/uuid";

const router = buildHono();

// const cache = caches.default;
router.post(
  "/:user/:file/:method/sign",
  strictAuth<"/:user/:file/:method/sign">({checkApproval: true}),
  async (c) => {
    // console.log("[cache] clearing cache");
    // await cache.delete(cacheKey(c));
    const r2 = c.get("r2");
    const {file, method, user} = c.req.param();
    const body = await c.req.json();

    const url = buildFilePath(user, `${uuid()}-${uuid()}`, file);
    return json({
      url: await signUrl(
        r2,
        {
          path: url,
          bucket: CONFIG.PUBLIC_BUCKET_NAME,
          metadata: body.uploadMetadata,
        },
        method
      ),
      preview: await signUrl(
        r2,
        {
          path: url,
          bucket: CONFIG.PREVIEW_BUCKET_NAME,
          metadata: body.previewMetadata,
        },
        method
      ),
      key: url,
    });
  }
);

// router.post("/:user/file/metadata", strictAuth(), async (c) => {
//   const {
//     env: {B_GALLERY, B_PREVIEWS},
//   } = c;
//   const {fileId}: {fileId: string} = await c.req.json();
//   if (fileId?.split("/")[0] !== c.req.param("user")) {
//     return json({error: "Unauthorized"}, 401);
//   }
//   const fileMetadata = await B_GALLERY.head(fileId);
//   if (fileMetadata == null) {
//     return c.json({error: "Not found"}, 404);
//   }
//   let {customMetadata, httpMetadata} = fileMetadata;
//   customMetadata = customMetadata || {};
//   const previewMetadata = await B_PREVIEWS.head(fileId);

//   return json({customMetadata, previewMetadata, httpMetadata});
// });

router.post("/:user/batch-delete", strictAuth(), async (c) => {
  const {
    env: {B_GALLERY, B_PREVIEWS},
  } = c;
  // await cache.delete(cacheKey(c));
  const keys: string[] = await c.req.json();
  const {user} = decodeAuth(c as any);
  if (keys.some((x) => x.split("/")[0] !== user))
    return json({error: "Unauthorized"}, 401);
  await Promise.all(
    keys.map((objectName) => {
      return Promise.all([
        B_GALLERY.delete(objectName),
        B_PREVIEWS.delete(objectName),
      ]);
    })
  );
  return json({});
});

export {router as r2};
