import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/database/drizzle/db";
import { subs, users } from "@/database/drizzle/schema";
import { eq } from "drizzle-orm";

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
  );

export { subsRouteApp };
