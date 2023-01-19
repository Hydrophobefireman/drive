S3Client;

import {Hono} from "hono";
import {Env} from "~/types";

import {S3Client} from "@aws-sdk/client-s3";

export function buildHono() {
  return new Hono<{Bindings: Env; Variables: {r2: S3Client}}>({
    strict: false,
  });
}
