import {dynamic} from "@kit/router";
export default {
  "/": dynamic(() => import("~/pages/Landing")),
  "/app": dynamic(() => import("~/pages/App")),
  "/auth": dynamic(() => import("~/pages/Login")),
  "/viewer": dynamic(() => import("~/pages/Viewer")),
};
