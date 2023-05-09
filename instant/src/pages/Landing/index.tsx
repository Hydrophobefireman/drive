import {createSession} from "@/handlers/create-session";
import {redirect, useEffect, useState} from "@hydrophobefireman/ui-lib";

export default function Landing() {
  useEffect(() => {
    (async () => {
      const data = await createSession();
      return redirect(`/sessions/${data}`);
    })();
  }, []);
  return <section>Loading...</section>;
}
