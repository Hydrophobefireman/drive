import {cors} from "./cors";
import {buildClient} from "./r2/client";
import {api} from "./routes/api";
import {r2} from "./routes/r2";
import {buildHono} from "./util/build-hono";
import {json} from "./util/json";

const EXPOSED_HEADERS = [
  "x-file-meta",
  "x-upload-meta",
  "x-stats",
  "x-access-token",
  "x-refresh-token",
];

const app = buildHono();
app.use("*", async (c, n) => {
  c.set("r2", buildClient(c.env));
  return await n();
});
// Middlewares
app.use("*", cors({exposeHeaders: EXPOSED_HEADERS}));
// stats middleware
app.use("*", async (c, n) => {
  const start = +new Date();
  let res = await n();
  const t = +new Date() - start;
  c.res.headers.set("x-stats", JSON.stringify({time: t}));
  return res;
});

// 404
app.notFound((c) =>
  json({error: "Not found", message: "The requested url was not found"}, 404, {
    "access-control-allow-origin": "*",
  })
);

// basic error handler
app.onError((e) => {
  console.warn(e);
  return json({error: e.message, name: e.name, cause: e.cause}, 500, {
    "access-control-allow-origin": "*",
  });
});

// routes

// match `/api/:path`
app.route("/api", api);

// match `/r2/:path`

app.route("/r2", r2);

export default app;
