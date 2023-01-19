const BASE = location.href.includes("localhost")
  ? "http://localhost:8787"
  : "https://r2.api.hpfm.dev/";

export const CONFIG = {
  PUBLIC_BUCKET_NAME: "drive-1",
  PREVIEW_BUCKET_NAME: "previews-1",
  PUBLIC_BUCKET_URL: "https://v1.drive.r2.cdn.hpfm.dev/",
  PREVIEW_BUCKET_URL: "https://v1.previews.r2.cdn.hpfm.dev/",
};

function getURL(path: string) {
  return new URL(path, BASE).href;
}

export const loginRoute = getURL("/api/-/auth/login");
export const registerRoute = getURL("/api/-/auth/register");
export const revokeTokenRoute = getURL("/api/-/auth/revoke-token");
export const refreshTokenRoute = getURL("/api/-/auth/refresh");
export const initialAuthCheckRoute = getURL("/api/-/auth/me");

export const listFilesRoute = (u: string) => getURL(`/api/user/${u}/list`);
export const batchDeleteRoute = (u: string) =>
  getURL(`/r2/${u}/batch-delete`);
export const signUrlRoute = (file: string, method: string, u: string) =>
  getURL(
    `/r2/${encodeURIComponent(u)}/${encodeURIComponent(
      file
    )}/${encodeURIComponent(method)}/sign`
  );

export function publicFileURL(key: string) {
  return new URL(key, CONFIG.PUBLIC_BUCKET_URL).href;
}

export function previewFileURL(key: string) {
  return new URL(key, CONFIG.PREVIEW_BUCKET_URL).href;
}
