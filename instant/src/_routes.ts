import {dynamic} from "@kit/router";
export default {
  "/": dynamic(() => import("@/pages/Landing")),
  "/sessions/:id": dynamic(() => import("@/pages/Sessions")),
};
