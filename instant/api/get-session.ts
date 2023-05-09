import kv from "@vercel/kv";

export const config = {runtime: "edge"};

export default async function handle(request: Request) {
  const key = new URL(request.url).searchParams.get("session");
  const data = await kv.get(key);
  return new Response(
    JSON.stringify({
      data: data || {error: "no such session"},
      fetchedAt: +new Date(),
    }),
    {
      headers: {
        "content-type": "application/json",
        "access-control-allow-origin": request.headers.get("origin") || "*",
      },
    }
  );
}
