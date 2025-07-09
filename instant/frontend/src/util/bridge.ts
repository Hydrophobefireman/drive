import {Bridge} from "@hydrophobefireman/flask-jwt-jskit";
import {redirect} from "@hydrophobefireman/ui-lib";

const client = new Bridge<any>(null);

// change these according to your backend
client.setRoutes({
  loginRoute: "/login",
  refreshTokenRoute: "/refresh",
  initialAuthCheckRoute: "/accounts/me",
});
client.onLogout(() => redirect("/login"));

const {useAuthState, useIsLoggedIn} = client.getHooks();

const requests = client.getHttpClient();

export {useAuthState, useIsLoggedIn, requests, client};
