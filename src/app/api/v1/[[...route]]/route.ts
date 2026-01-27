import { Hono } from "hono";
import { handle } from "hono/vercel";
import { helloRouteApp } from "@/server/routes/hello-route";
import { userRouteApp } from "@/server/routes/user-route";
import { sessionsRouteApp } from "@/server/routes/sessions-route";

export const app = new Hono()
  .basePath("/api/v1")
  .route("/helloRoute", helloRouteApp)
  .route("/user", userRouteApp)
  .route("/sessions", sessionsRouteApp);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
