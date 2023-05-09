const kv: typeof import("@vercel/kv").default =
  require("@vercel/kv")?.default || require("@vercel/kv");

async function handleKv() {
  const keys = await kv.keys("*");
  const toDel = (
    await Promise.all(
      keys.map(async (key) => {
        const resp: any = await kv.get(key);

        if (resp.createdAt < +new Date()) {
          console.log(key);
          return key;
        }
        return null;
      })
    )
  ).filter(Boolean);
  kv.del(...toDel);
  return toDel;
}
module.exports = async function handler(
  req: import("@vercel/node").VercelRequest,
  res: import("@vercel/node").VercelResponse
) {
  const w = await Promise.all([handleKv()]);
  return res.json({ok: w});
};
