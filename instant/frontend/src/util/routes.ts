const BASE = process.env.API_URL;

function getURL(path: string) {
  return new URL(path, BASE).href;
}

export const createSessionRoute = getURL("/create-session");
export const getSessionDetailsRoute = (x: string) =>
  getURL(`/get-session?session=${encodeURIComponent(x)}`);

export const signURLRoute = getURL("/sign");

export const updateSessionRoute = (s: string, u: string, name: string) =>
  getURL(`/update-session?${new URLSearchParams({session: s, url: u, name})}`);
