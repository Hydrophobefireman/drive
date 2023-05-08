const {S3Client} = require("@aws-sdk/client-s3");
const {env} = process;
export function buildClient() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_ACCESS_KEY_SECRET,
    },
  });
}
