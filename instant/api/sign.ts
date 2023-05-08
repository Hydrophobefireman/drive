import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {random} from "@hydrophobefireman/kit/dist/src/util";

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

export default async function handle(request: Request) {
  const {file} = await request.json();
  const safe = stringToHex(file);
  const res = await signUrl(
    {
      path: random() + "/" + new Date() + "/" + file,
      bucket: "drive-instant",
    },
    "put"
  );
  return new Response(JSON.stringify({data: res}), {
    headers: {"content-type": "application/json"},
  });
}
