const BASE = location.href.includes("localhost")
  ? "http://localhost:3000"
  : location.origin;

function getURL(path: string) {
  return new URL(path, BASE).href;
}

export const createSessionRoute = getURL("/api/create-session");
export const getSessionDetailsRoute = (x: string) =>
  getURL(`/api/get-session?session=${encodeURIComponent(x)}`);

export const signURLRoute = getURL("/api/sign");

export const updateSessionRoute = (s: string, u: string) =>
  getURL(
    `/api/update-session?session=${encodeURIComponent(
      s
    )}&url=${encodeURIComponent(u)}`
  );
