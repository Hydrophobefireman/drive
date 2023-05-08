import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {random} from "@hydrophobefireman/kit/dist/src/util";
import type {VercelRequest, VercelResponse} from "@vercel/node";

import {buildClient} from "./_build_client";
import {stringToHex} from "./_util";

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
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method.toLowerCase() !== "post")
    return response.status(405).json({error: "invalid method"});
  const {file} = request.body;
  const safe = stringToHex(file);
  const res = await signUrl(
    {
      path: `${random()}/${new Date()}/${safe}`,
      bucket: "drive-instant",
    },
    "put"
  );
  return response.json({data: res});
}
