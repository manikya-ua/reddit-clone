"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { notFound, unauthorized } from "next/navigation";
import { cache } from "react";
import { db } from "@/database/drizzle/db";
import { sessions, users } from "@/database/drizzle/schema";

export const getUser = cache(async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user");
  if (!sessionCookie) {
    return { user: null };
  }
  const { email, descriptor } = JSON.parse(sessionCookie.value);
  const existingSession = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.email, email), eq(sessions.descriptor, descriptor)));
  if (!existingSession || existingSession.length === 0) {
    unauthorized();
  }
  const usersResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (!usersResult || usersResult.length === 0) {
    notFound();
  }
  return { user: usersResult[0] };
});

export const getUserByUsername = cache(
  async ({ username }: { username: string }) => {
    const usersResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (!usersResult || usersResult.length === 0) {
      return null;
    }
    return usersResult[0];
  },
);
