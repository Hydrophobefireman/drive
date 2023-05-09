{
  const kv: typeof import("@vercel/kv").default =
    require("@vercel/kv")?.default || require("@vercel/kv");

  const {ListObjectsCommand, DeleteObjectsCommand} =
    require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");

  const {buildClient} = require("./_build_client");
  const client: import("@aws-sdk/client-s3").S3Client = buildClient();
  function isMoreThanADayOld(timestamp: number): boolean {
    const oneDayInMs = 200; // (debugging)
    const currentTime = Date.now();
    const diffInMs = currentTime - timestamp;
    return diffInMs >= oneDayInMs;
  }

  async function handleR2() {
    const bucketName = "drive-instant";
    const objects = await client.send(
      new ListObjectsCommand({Bucket: bucketName})
    );

    const objectsToDelete = [];

    for (const object of objects.Contents) {
      const lastModified = +object.LastModified;
      if (isMoreThanADayOld(lastModified)) {
        objectsToDelete.push({Key: object.Key});
      }
    }

    if (objectsToDelete.length > 0) {
      console.log(`Deleting ${objectsToDelete.length} objects...`);
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {Objects: objectsToDelete},
        })
      );
      console.log("Objects deleted.");
    } else {
      console.log("No objects to delete.");
    }
  }

  async function handleKv() {
    const keys = await kv.keys("*");
    const toDel = (
      await Promise.all(
        keys.map(async (key) => {
          const resp: any = await kv.get(key);

          if (isMoreThanADayOld(resp.createdAt)) {
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
}
