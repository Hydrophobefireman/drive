import kv from "@vercel/kv";

export const config = {runtime: "edge"};

const randomString = () => crypto.randomUUID();

export default async function handle(request: Request) {
  const u = new URL(request.url);
  const key = u.searchParams.get("session");
  await kv.set(key, {
    url: u.searchParams.get("url"),
    name: u.searchParams.get("name")?.substring(50) || "download",
    createdAt: +new Date(),
  });
  return new Response(JSON.stringify({data: key, createdAt: +new Date()}), {
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": request.headers.get("origin") || "*",
    },
  });
}
