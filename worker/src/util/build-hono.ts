S3Client;

import {Hono} from "hono";
import {Env} from "~/types";

import {S3Client} from "@aws-sdk/client-s3";
export interface HonoType {
  Bindings: Env;
  Variables: {r2: S3Client};
}
export function buildHono() {
  return new Hono<HonoType>({
    strict: false,
  });
}
