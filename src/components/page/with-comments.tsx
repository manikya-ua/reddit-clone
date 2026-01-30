"use client";
import { formatDistance, parse } from "date-fns";
import Image from "next/image";
import { useGetPostById } from "@/app/hooks/useGetPostById";
import { useGetSub } from "@/app/hooks/useGetSub";
import { useGetUser } from "@/app/hooks/useGetUser";
import Comments from "@/components/page/comments";
import VotesSection from "@/components/page/votes-section";
import type { posts, subs } from "@/database/drizzle/schema";
import BackButton from "./back-button";
import Indeterminate from "./indeterminate";

export function WithComments({
  subTitle,
  postId,
  initialData,
}: {
  subTitle: string;
  postId: number;
  initialData?: {
    sub: typeof subs.$inferSelect;
    post: typeof posts.$inferSelect;
  };
}) {
  const { data: sub, isLoading: isSubLoading } = useGetSub({
    title: subTitle,
    initialData: initialData?.sub,
  });

  const { data: post, isLoading: isPostLoading } = useGetPostById({
    postId,
    initialData: initialData?.post,
  });

  const { data: user, isLoading: isUserLoading } = useGetUser();

  const isLoading = isSubLoading || isPostLoading || isUserLoading;

  return (
    <div className="flex gap-3 max-w-6xl mx-auto px-7 py-10">
      <Indeterminate isLoading={isLoading} />
      <div>
        <BackButton />
      </div>
      <div className="grow flex flex-col gap-1">
        <div className="flex gap-5">
          <Image src="/icons/outline-logo.svg" width={20} height={20} alt="" />
          <div className="flex flex-col gap-0.5">
            <span>r/{sub?.title}</span>
            <span className="text-xs">{user?.username}</span>
          </div>
          <div className="text-sm text-neutral-400">
            {formatDistance(
              parse(post?.createdAt ?? "2026-01-28", "yyyy-MM-dd", new Date()),
              new Date(),
              {
                addSuffix: true,
              },
            )}
          </div>
        </div>
        <div className="text-2xl font-semibold mt-5 mb-3">{post?.title}</div>
        <div className="text-pretty text-base text-neutral-300">
          {post?.content}
        </div>
        <div className="mb-5">
          <VotesSection postId={post?.id} withEdit={true} canComment={true} />
        </div>
        <Comments comments={post?.comments} />
      </div>
    </div>
  );
}
