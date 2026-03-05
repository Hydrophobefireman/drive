/// <reference path="../.sst/platform/config.d.ts" />

export async function driveFrontend() {
  const {local} = await import("@pulumi/command");
  const domain = $dev ? "dev.drive.hpfm.dev" : "drive.hpfm.dev";

  const frontendBuild = local.runOutput({
    // the code is run at: /drive/.sst/platform'
    dir: "../../frontend",
    command: "npm run build",
    logging: "stdoutAndStderr",
  });

  const frontend = new sst.cloudflare.Worker("drive/frontend", {
    handler: "./infra/worker.ts",
    url: true,
    domain,
    transform: {
      worker: {
        assets: {
          directory: frontendBuild.apply((_) => "../../frontend/build"),
          config: {
            notFoundHandling: "single-page-application",
          },
        },
      },
    },
  });

  return {
    frontend: frontend.url,
  };
}
