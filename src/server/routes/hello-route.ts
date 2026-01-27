import { Hono } from "hono";

const helloRouteApp = new Hono().get("/hello", (c) => {
  return c.json("Hello World");
});

export { helloRouteApp };
