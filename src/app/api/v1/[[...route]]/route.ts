import { Hono } from "hono";
import { hc } from "hono/client";
import { handle } from "hono/vercel";
import { helloRouteApp } from "@/server/routes/hello-route";

export const app = new Hono()
  .basePath("/api/v1")
  .route("/helloRoute", helloRouteApp);

export type AppType = typeof app;

export const client = hc<AppType>("");

export const GET = handle(app);
export const POST = handle(app);
