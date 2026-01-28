import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/database/drizzle/db";
import { subs, users } from "@/database/drizzle/schema";

const subsRouteApp = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum(["public", "private"]),
        userId: z.number(),
        rules: z.array(z.string()),
      }),
    ),
    async (c) => {
      const { title, description, status, rules, userId } = c.req.valid("json");
      const userResults = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (!userResults || userResults.length === 0) {
        return c.json({ message: "user not found" }, 404);
      }
      const existingUser = userResults[0];
      const obtainedSub = (
        await db
          .insert(subs)
          .values({
            title,
            description,
            status,
            rules,
            members: [userId],
            mods: [userId],
          })
          .returning()
      )[0];
      await db
        .update(users)
        .set({ subs: [...(existingUser.subs ?? []), obtainedSub.id] })
        .where(eq(users.id, userId));
      return c.json({ message: "ok" });
    },
  )
  .post(
    "/get-sub",
    zValidator("json", z.object({ id: z.number() })),
    async (c) => {
      const { id } = c.req.valid("json");
      const result = await db.select().from(subs).where(eq(subs.id, id));
      if (!result || result.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      return c.json({ sub: result[0] });
    },
  )
  .post(
    "/get-sub-title",
    zValidator("json", z.object({ title: z.string() })),
    async (c) => {
      const { title } = c.req.valid("json");
      const result = await db.select().from(subs).where(eq(subs.title, title));
      if (!result || result.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      return c.json({ sub: result[0] });
    },
  )
  .post(
    "/leave",
    zValidator(
      "json",
      z.object({
        subId: z.number(),
        userId: z.number(),
      }),
    ),
    async (c) => {
      const { userId, subId } = c.req.valid("json");
      const userResults = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (!userResults || userResults.length === 0) {
        return c.json({ message: "user not found" }, 404);
      }
      const user = userResults[0];
      const existingSubs = user.subs;
      if (!user.subs?.includes(subId)) {
        return c.json({ message: "sub not joined" }, 404);
      }
      const newSubs = existingSubs?.filter((sub) => sub !== subId);
      await db.update(users).set({ subs: newSubs }).where(eq(users.id, userId));
      return c.json({ message: "Ok" });
    },
  )
  .post(
    "/join",
    zValidator(
      "json",
      z.object({
        subId: z.number(),
        userId: z.number(),
      }),
    ),
    async (c) => {
      const { userId, subId } = c.req.valid("json");
      const userResults = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (!userResults || userResults.length === 0) {
        return c.json({ message: "user not found" }, 404);
      }
      const user = userResults[0];
      const existingSubs = user.subs;
      if (user.subs?.includes(subId)) {
        return c.json({ message: "sub already joined" }, 400);
      }
      const newSubs = [...(existingSubs ?? []), subId];
      await db.update(users).set({ subs: newSubs }).where(eq(users.id, userId));
      return c.json({ message: "Ok" });
    },
  );

export { subsRouteApp };
