import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  char,
  date,
  integer,
  pgEnum,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  username: varchar({ length: 20 }).unique(),
  email: varchar({ length: 200 }).unique(),
  password: varchar({ length: 200 }),
  karma: integer().default(0),
  posts: integer()
    .references((): AnyPgColumn => posts.id)
    .array()
    .default([]),
  comments: integer()
    .references((): AnyPgColumn => comments.id)
    .array()
    .default([]),
  subs: integer()
    .references((): AnyPgColumn => subs.id)
    .array()
    .default([]),
  createdAt: date().defaultNow(),
  updatedAt: date().defaultNow(),
});

export const comments = pgTable("comments", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  content: varchar({ length: 200 }),
  upvotes: integer()
    .references(() => users.id)
    .array()
    .default([]),
  downvotes: integer()
    .references(() => users.id)
    .array()
    .default([]),
  comments: integer()
    .references((): AnyPgColumn => comments.id)
    .array()
    .default([]),
  author: integer().references(() => users.id),
  createdAt: date().defaultNow(),
  updatedAt: date().defaultNow(),
});

export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar({ length: 200 }),
  content: varchar({ length: 200 }),
  sub: integer().references((): AnyPgColumn => subs.id),
  upvotes: integer()
    .references(() => users.id)
    .array()
    .default([]),
  downvotes: integer()
    .references(() => users.id)
    .array()
    .default([]),
  comments: integer()
    .references((): AnyPgColumn => comments.id)
    .array()
    .default([]),
  author: integer().references(() => users.id),
  createdAt: date().defaultNow(),
  updatedAt: date().defaultNow(),
});

export const statusEnum = pgEnum("status", ["public", "private"]);

export const subs = pgTable("subs", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar({ length: 200 }),
  description: varchar({ length: 200 }),
  members: integer()
    .references(() => users.id)
    .array()
    .default([]),
  mods: integer()
    .references(() => users.id)
    .array()
    .default([]),
  posts: integer()
    .references(() => posts.id)
    .array()
    .default([]),
  status: statusEnum().default("public"),
  rules: varchar({ length: 200 }).array().default([]),
  createdAt: date().defaultNow(),
  updatedAt: date().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  email: varchar({ length: 200 }),
  descriptor: char({ length: 36 }).default(sql`gen_random_uuid()`),
});
