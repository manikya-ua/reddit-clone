import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/database/drizzle/db";
import { comments, posts } from "@/database/drizzle/schema";

const commentsRouteApp = new Hono()
  .post(
    "/get-comment",
    zValidator("json", z.object({ id: z.number() })),
    async (c) => {
      const { id } = c.req.valid("json");
      const commentsResults = await db
        .select()
        .from(comments)
        .where(eq(comments.id, id));
      if (!commentsResults || commentsResults.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      return c.json({ comment: commentsResults[0] });
    },
  )
  .post(
    "/comment-to-post",
    zValidator(
      "json",
      z.object({
        postId: z.number(),
        content: z.string(),
        authorId: z.number(),
      }),
    ),
    async (c) => {
      const { postId, content, authorId } = c.req.valid("json");
      const postsResult = await db
        .select()
        .from(posts)
        .where(eq(posts.id, postId));
      if (!postsResult || postsResult.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      const post = postsResult[0];
      const comment = (
        await db
          .insert(comments)
          .values({ author: authorId, content })
          .returning()
      )[0];
      await db
        .update(posts)
        .set({ comments: [...(post.comments ?? []), comment.id] })
        .where(eq(posts.id, postId));
      return c.json({ message: "ok" });
    },
  )
  .post(
    "/comment-to-comment",
    zValidator(
      "json",
      z.object({
        commentId: z.number(),
        content: z.string(),
        authorId: z.number(),
      }),
    ),
    async (c) => {
      const { commentId, content, authorId } = c.req.valid("json");
      const parentCommentResult = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId));
      if (!parentCommentResult || parentCommentResult.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      const parentComment = parentCommentResult[0];
      const comment = (
        await db
          .insert(comments)
          .values({ author: authorId, content })
          .returning()
      )[0];
      await db
        .update(comments)
        .set({ comments: [...(parentComment.comments ?? []), comment.id] })
        .where(eq(comments.id, commentId));
      return c.json({ message: "ok" });
    },
  )
  .post(
    "/upvote",
    zValidator("json", z.object({ commentId: z.number(), userId: z.number() })),
    async (c) => {
      const { commentId, userId } = c.req.valid("json");
      const commentsResults = await db
        .select()
        .from(comments)
        .where(eq(comments.id, commentId));
      if (!commentsResults || commentsResults.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      const comment = commentsResults[0];
      if (comment.downvotes?.includes(userId)) {
        await db
          .update(comments)
          .set({ downvotes: comment.downvotes.filter((id) => id !== userId) })
          .where(eq(comments.id, commentId));
      }
      if (comment.upvotes?.includes(userId)) {
        await db
          .update(comments)
          .set({ upvotes: comment.upvotes.filter((id) => id !== userId) })
          .where(eq(comments.id, commentId));
      } else {
        await db
          .update(comments)
          .set({ upvotes: [...(comment.upvotes ?? []), userId] })
          .where(eq(comments.id, commentId));
      }
      return c.json({ message: "ok" });
    },
  )
  .post(
    "/downvote",
    zValidator("json", z.object({ commentId: z.number(), userId: z.number() })),
    async (c) => {
      const { commentId: postId, userId } = c.req.valid("json");
      const commentsResult = await db
        .select()
        .from(comments)
        .where(eq(comments.id, postId));
      if (!commentsResult || commentsResult.length === 0) {
        return c.json({ message: "not found" }, 404);
      }
      const comment = commentsResult[0];
      if (comment.upvotes?.includes(userId)) {
        await db
          .update(comments)
          .set({ upvotes: comment.upvotes.filter((id) => id !== userId) })
          .where(eq(comments.id, postId));
      }
      if (comment.downvotes?.includes(userId)) {
        await db
          .update(comments)
          .set({ downvotes: comment.downvotes.filter((id) => id !== userId) })
          .where(eq(comments.id, postId));
      } else {
        await db
          .update(comments)
          .set({ downvotes: [...(comment.downvotes ?? []), userId] })
          .where(eq(comments.id, postId));
      }
      return c.json({ message: "ok" });
    },
  );

export { commentsRouteApp };
