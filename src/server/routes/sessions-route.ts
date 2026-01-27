import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { db } from "@/database/drizzle/db";
import { sessions, users } from "@/database/drizzle/schema";

const sessionsRouteApp = new Hono()
  .get("/", (c) => {
    return c.json("Hello World");
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        email: z.email(),
        password: z.string(),
      }),
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const result = await db
        .select({ password: users.password })
        .from(users)
        .where(eq(users.email, email));
      if (!result || result.length === 0) {
        return c.json({ message: "Not found" }, 404);
      }
      const { password: obtainedPassword } = result[0];
      if (password !== obtainedPassword) {
        return c.json({ message: "wrong password" }, 403);
      }
      const session = (
        await db.insert(sessions).values({ email }).returning()
      )[0];
      setCookie(c, "user", JSON.stringify(session));
      return c.json({ session });
    },
  )
  .post("/logout", async (c) => {
    deleteCookie(c, "user");
    return c.json({ message: "ok" });
  });

export { sessionsRouteApp };
