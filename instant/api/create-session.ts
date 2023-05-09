import kv from "@vercel/kv";

export const config = {runtime: "edge"};

const randomString = () => crypto.randomUUID();

export default async function handle(request: Request) {
  const key = randomString();
  await kv.set(key, {url: null, createdAt: +new Date()});
  return new Response(JSON.stringify({data: key, createdAt: +new Date()}), {
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": request.headers.get("origin") || "*",
    },
  });
}
