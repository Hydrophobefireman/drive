import {Env} from "~/types";

import {S3Client} from "@aws-sdk/client-s3";

export function buildClient(env: Env) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_ACCESS_KEY_SECRET,
    },
  });
}
