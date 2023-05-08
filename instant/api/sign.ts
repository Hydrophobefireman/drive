const {randomString} = require("./_util");

const {GetObjectCommand, PutObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const {buildClient} = require("./_build_client");
const {stringToHex} = require("./_util");

const SEVEN_DAYS = 604800;
const r2 = buildClient();
async function signUrl(config: {path: string; bucket: string}, method: string) {
  const conf = {Bucket: config.bucket, Key: config.path};
  const cmd =
    method.toUpperCase() === "GET"
      ? new GetObjectCommand(conf)
      : new PutObjectCommand(conf);
  return await getSignedUrl(r2, cmd, {expiresIn: SEVEN_DAYS});
}

export default async function handle(
  request: import("@vercel/node").VercelRequest,
  response: import("@vercel/node").VercelResponse
) {
  if (request.method.toLowerCase() !== "post")
    return response.status(405).json({error: "invalid method"});
  const {file} = request.body;
  const safe = stringToHex(file);
  const res = await signUrl(
    {
      path: `${randomString()}/${new Date()}/${safe}`,
      bucket: "drive-instant",
    },
    "put"
  );
  return response.json({data: res});
}
