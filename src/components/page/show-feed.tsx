"use client";

import { useQueries, useQueryClient } from "@tanstack/react-query";
import { formatDistance, parse } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetSubById } from "@/app/hooks/useGetSub";
import type { posts } from "@/database/drizzle/schema";
import { client } from "@/server/client";

export function ShowFeed({
  postIds,
  isLoading: isLoadingMeta,
}: {
  postIds: Array<number> | null | undefined;
  isLoading?: boolean;
}) {
  const postsResults = useQueries({
    queries: (postIds ?? []).map((postId) => ({
      queryKey: ["get-post", postId],
      queryFn: async () => {
        const postsResults = await client.api.v1.posts["get-post"].$post({
          json: { id: postId },
        });
        if (postsResults.status !== 200) {
          throw new Error("Could not find the post");
        }
        return await postsResults.json();
      },
    })),
  });

  const posts = postsResults.map((post) => post.data);
  const isLoadingPosts = postsResults.some((post) => post.isLoading);

  const isLoading = isLoadingMeta || isLoadingPosts;

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mt-20">
      {isLoading ? (
        <Loader2 className="size-10 animate-spin w-fit mx-auto" />
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        posts.map((post) => (
          <div key={post?.post.id}>
            <div className="h-px bg-neutral-700 w-full mb-2"></div>
            <Post post={post?.post} />
          </div>
        ))
      )}
    </div>
  );
}

function EmptyState() {
  return <div>No posts yet, begin the communication!</div>;
}

function Post({ post }: { post: typeof posts.$inferSelect | undefined }) {
  const { data: sub } = useGetSubById({ id: post?.sub });
  const queryClient = useQueryClient();

  const upvote = async () => {
    if (!post?.id) return;
    await client.api.v1.posts.upvote.$post({ json: { postId: post.id } });
    queryClient.invalidateQueries({ queryKey: ["get-post", post.id] });
  };

  const downvote = async () => {
    if (!post?.id) return;
    await client.api.v1.posts.downvote.$post({ json: { postId: post.id } });
    queryClient.invalidateQueries({ queryKey: ["get-post", post.id] });
  };

  return (
    <div className="block p-5 pb-2 rounded-md hover:bg-neutral-800">
      <a href={`/r/${sub?.sub.title}/comments/${post?.id}`}>
        <div className="text-xs flex gap-2 hover:text-blue-300">
          <Image src="/icons/outline-logo.svg" width={12} height={12} alt="" />
          r/{sub?.sub.title}
          <span>-</span>
          <span>
            {formatDistance(
              parse(post?.createdAt ?? "2026-01-28", "yyyy-MM-dd", new Date()),
              new Date(),
              {
                addSuffix: true,
              },
            )}
          </span>
        </div>
        <div className="text-3xl">{post?.title}</div>
        <div className="mt-5">{post?.content}</div>
      </a>
      <div className="flex gap-3 mt-5">
        <div className="rounded-full flex gap-2 items-center text-sm bg-neutral-700">
          <button
            type="button"
            className="p-2 hover:bg-neutral-600 rounded-full group"
            onClick={() => upvote()}
          >
            <Image
              src="/icons/up-icon.svg"
              width={16}
              height={16}
              alt=""
              className="block group-hover:hidden"
            />
            <Image
              src="/icons/up-icon-red.svg"
              width={16}
              height={16}
              alt=""
              className="group-hover:block hidden"
            />
          </button>
          {(post?.upvotes ?? 0) - (post?.downvotes ?? 0)}
          <button
            type="button"
            className="p-2 hover:bg-neutral-600 rounded-full group"
            onClick={() => downvote()}
          >
            <Image
              src="/icons/down-icon.svg"
              width={16}
              height={16}
              alt=""
              className="block group-hover:hidden"
            />
            <Image
              src="/icons/down-icon-blue.svg"
              width={16}
              height={16}
              alt=""
              className="group-hover:block hidden"
            />
          </button>
        </div>
        <a
          href={`/r/${sub?.sub.title}/comments/${post?.id}`}
          className="rounded-full flex gap-2 items-center text-sm bg-neutral-700 px-4 hover:bg-neutral-600"
        >
          <Image src="/icons/comments-icon.svg" width={16} height={16} alt="" />
          {post?.comments?.length}
        </a>
      </div>
    </div>
  );
}
