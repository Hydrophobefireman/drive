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

module.exports = async function handle(
  request: import("@vercel/node").VercelRequest,
  response: import("@vercel/node").VercelResponse
) {
  response = response.setHeader(
    "access-control-allow-origin",
    request.headers["origin"] || "*"
  );

  if (request.method.toLowerCase() === "options") {
    return response.send(null);
  }
  const path = `${+new Date()}/${randomString()}`;
  const res = await signUrl(
    {
      path,
      bucket: "drive-instant",
    },
    "put"
  );
  const url = `https://instant.drive.hpfm.dev/${path}`;
  return response.json({data: {sign: res, path}});
};
