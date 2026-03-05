import {ExportedHandler} from "@cloudflare/workers-types";
export default {
  async fetch() {
    // assets should catchall so this worker should never be hit
    return new Response("?") as any;
  },
} satisfies ExportedHandler;
