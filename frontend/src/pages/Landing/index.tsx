import {useIsLoggedIn} from "~/util/bridge";

import {redirect, useEffect} from "@hydrophobefireman/ui-lib";

export default function Landing() {
  const isLoggedIn = useIsLoggedIn();
  useEffect(() => {
    if (isLoggedIn) return redirect("/app");
    return redirect("/auth");
  }, [isLoggedIn]);
  return <></>;
}
