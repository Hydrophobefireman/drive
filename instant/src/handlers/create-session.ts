import {createSessionRoute} from "@/util/routes";

export async function createSession() {
  const resp = await fetch(createSessionRoute);
  const json = await resp.json();
  return json.data;
}
