import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { z } from "zod";
import { db } from "@/database/drizzle/db";
import { sessions, users } from "@/database/drizzle/schema";

const userRouteApp = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        username: z.string().optional(),
        email: z.email().optional(),
      }),
    ),
    async (c) => {
      const { username, email } = c.req.valid("query");
      let usersResult:
        | Omit<typeof users.$inferSelect, "password" | "updatedAt">[]
        | null = null;
      if (email) {
        usersResult = await db
          .select({
            email: users.email,
            username: users.username,
            subs: users.subs,
            posts: users.posts,
            comments: users.comments,
            id: users.id,
            karma: users.karma,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.email, email));
      }
      if (username) {
        usersResult = await db
          .select({
            email: users.email,
            username: users.username,
            subs: users.subs,
            posts: users.posts,
            comments: users.comments,
            id: users.id,
            karma: users.karma,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(eq(users.username, username));
      }
      if (!usersResult || usersResult.length === 0) {
        return c.json({ message: "Not found" }, 404);
      }
      return c.json({ user: usersResult[0] });
    },
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        username: z.string().min(5),
        email: z.email(),
        password: z.string().min(5),
      }),
    ),
    async (c) => {
      const data = c.req.valid("json");
      const user = { ...data };
      try {
        await db.insert(users).values(user);
        return c.json({ message: "ok" });
      } catch (e) {
        console.error(e);
        return c.json({ message: "Something went wrong" }, 500);
      }
    },
  )
  .get("/auth-user", async (c) => {
    const sessionCookie = getCookie(c, "user");
    if (!sessionCookie) {
      return c.json({ message: "Not allowed!" }, 403);
    }
    const { email, descriptor } = JSON.parse(sessionCookie);
    const existingSession = await db
      .select()
      .from(sessions)
      .where(
        and(eq(sessions.email, email), eq(sessions.descriptor, descriptor)),
      );
    if (!existingSession || existingSession.length === 0) {
      return c.json({ message: "Not allowed!" }, 403);
    }
    const usersResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (!usersResult || usersResult.length === 0) {
      return c.json({ message: "Not found" }, 404);
    }
    return c.json({ user: usersResult[0] });
  });

export { userRouteApp };
