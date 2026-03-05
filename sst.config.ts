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
    const {instant} = await import("./infra/instant");
    const {driveFrontend} = await import("./infra/drive-frontend");

    return {
      ...(await instant()),
      ...(await driveFrontend()),
    };
  },
});
