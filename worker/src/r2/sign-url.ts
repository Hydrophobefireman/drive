import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const SEVEN_DAYS = 604800;

export async function signUrl(
  r2: S3Client,
  config: {
    path: string;
    bucket: string;
    metadata?: Record<string, string>;
  },
  method: string
) {
  const conf = {Bucket: config.bucket, Key: config.path};
  const cmd =
    method.toUpperCase() === "GET"
      ? new GetObjectCommand(conf satisfies GetObjectCommandInput)
      : new PutObjectCommand({
          ...conf,
          Metadata: {upload: JSON.stringify(config.metadata)},
        } satisfies PutObjectCommandInput);

  return await getSignedUrl(r2, cmd, {
    expiresIn: SEVEN_DAYS,
    unhoistableHeaders: new Set(["x-amz-meta-upload"]),
  });
}
