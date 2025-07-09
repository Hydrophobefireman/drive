/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "drive",
      removal: input?.stage === "production" ? "retain" : "remove",
      // protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const domain = $dev
      ? "dev.instant.drive.hpfm.dev"
      : "cdn.instant.drive.hpfm.dev";
    const {R2BucketCors, R2CustomDomain, PagesProject} = await import(
      "@pulumi/cloudflare"
    );
    const bucket = new sst.cloudflare.Bucket("InstantDrive");

    const kv = new sst.cloudflare.Kv("InstantDriveSessions");
    const R2AccessKeyId = new sst.Secret("R2_ACCESS_KEY_ID");
    const R2AccessKeySecret = new sst.Secret("R2_ACCESS_KEY_SECRET");
    const r2S3Creds = new sst.Linkable("InstantDriveS3Compat", {
      properties: {
        AccountId: sst.cloudflare.DEFAULT_ACCOUNT_ID,
        BucketName: bucket.name,
      },
    });

    const customDomain = new R2CustomDomain("InstantDriveCustomDomain", {
      accountId: sst.cloudflare.DEFAULT_ACCOUNT_ID,
      bucketName: bucket.name,
      domain,
      enabled: true,
      zoneId: "2cadf7f6abbd1cade4f1641ee2594b71",
      minTls: "1.2",
    });

    const bucketURL = new sst.Linkable("InstantDriveBucketURL", {
      properties: {url: customDomain.domain},
    });

    const instant = new sst.cloudflare.Worker("InstantDriveWorker", {
      url: true,
      link: [
        bucket,
        kv,
        r2S3Creds,
        R2AccessKeyId,
        R2AccessKeySecret,
        bucketURL,
      ],
      handler: "./instant/worker/src/index.ts",
      domain: $dev
        ? "api.dev.instant.drive.hpfm.dev"
        : "api.instant.drive.hpfm.dev",
    });

    const frontend = new sst.cloudflare.StaticSite("InstantDriveFrontend", {
      domain: $dev
        ? "frontend.dev.instant.drive.hpfm.dev"
        : "instant.drive.hpfm.dev",
      path: "instant/frontend",
      build: {
        command: "npm run build",
        output: "build",
      },
      environment: {API_URL: instant.url, BUCKET_DOMAIN: domain},
    });
    const cron = new sst.cloudflare.Cron("InstantDriveCron", {
      job: {
        handler: "./instant/worker/src/cron.ts",
        link: [bucket, kv, r2S3Creds, R2AccessKeyId, R2AccessKeySecret],
      },
      schedules: ["0 0 * * *"],
    });

    const cors = new R2BucketCors("InstantDriveCors", {
      accountId: sst.cloudflare.DEFAULT_ACCOUNT_ID,
      bucketName: bucket.name,
      rules: [
        {
          allowed: {
            origins: ["*"],
            methods: ["GET", "PUT", "POST", "DELETE"],
            headers: ["*"],
          },
        },
      ],
    });
    return {
      frontend: frontend.url,
      api: instant.url,
      cron: cron.urn,
      cors: cors.id,
      customDomain: customDomain.domain,
    };
  },
});
