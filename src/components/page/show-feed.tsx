"use client";

import { useQueries } from "@tanstack/react-query";
import { formatDistance, parse } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetSubById } from "@/app/hooks/useGetSub";
import type { posts } from "@/database/drizzle/schema";
import { client } from "@/server/client";
import VotesSection from "./votes-section";

export function ShowFeed({
  postIds,
  isLoading: isLoadingMeta,
  withEdit,
}: {
  postIds: Array<number> | null | undefined;
  isLoading?: boolean;
  withEdit?: boolean;
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
    <div className="flex flex-col gap-5 w-full max-w-2xl relative">
      {isLoading ? (
        <div className="h-40">
          <Loader2 className="size-10 animate-spin w-fit absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState />
      ) : (
        posts
          .filter((post) => post !== undefined)
          .map((post) => (
            <div key={post.id}>
              <div className="h-px bg-neutral-700 w-full mb-2"></div>
              <Post post={post} withEdit={withEdit} />
            </div>
          ))
      )}
    </div>
  );
}

function EmptyState() {
  return <div>No posts yet, begin the communication!</div>;
}

function Post({
  post,
  withEdit,
}: {
  post: typeof posts.$inferSelect | undefined;
  withEdit?: boolean;
}) {
  const { data: sub } = useGetSubById({
    id: post?.sub,
  });

  return (
    <div className="block p-2 pb-2 mb-3 rounded-md hover:bg-neutral-800">
      <div>
        <a
          href={`/r/${sub?.sub.title}`}
          className="text-xs flex gap-2 hover:text-blue-300"
        >
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
        </a>
        <a
          href={`/r/${sub?.sub.title}/comments/${post?.id}`}
          className="block text-3xl"
        >
          {post?.title}
        </a>
        <a
          href={`/r/${sub?.sub.title}/comments/${post?.id}`}
          className="block mt-5 text-ellipsis max-w-full overflow-hidden"
        >
          {post?.content}
        </a>

        <VotesSection withEdit={withEdit} postId={post?.id} />
      </div>
    </div>
  );
}
