"use client";

import { useGetCommentById } from "@/app/hooks/useGetCommentById";
import { useGetUserDetailsById } from "@/app/hooks/useGetUserDetailsById";
import Indeterminate from "./indeterminate";
import ProfilePic from "./profile-pic";
import VotesSectionComment from "./votes-section-comment";

export default function Comments({
  comments,
  nesting = 0,
}: {
  comments: number[] | null | undefined;
  nesting?: number;
}) {
  return (
    <div style={{ marginLeft: `3rem` }}>
      {comments?.map((comment) => (
        <Comment nesting={nesting} commentId={comment} key={comment} />
      ))}
    </div>
  );
}

function Comment({
  commentId,
  nesting,
}: {
  commentId: number;
  nesting: number;
}) {
  const { data: comment, isLoading: isLoadingComment } =
    useGetCommentById(commentId);
  const { data: author, isLoading: isLoadingAuthor } = useGetUserDetailsById({
    id: comment?.author,
  });
  const isLoading = isLoadingComment || isLoadingAuthor;
  return (
    <div className="relative flex flex-col gap-2">
      <Indeterminate isLoading={isLoading} />
      <div className="absolute top-4 h-px bg-neutral-600 -left-2 w-2"></div>
      <div className="absolute top-4 bottom-4 w-px bg-neutral-600 -left-2"></div>
      <div className="absolute bottom-4 w-1 h-3 border-3 border-transparent border-b-neutral-600 -left-[0.67rem]"></div>
      <a
        href={`/user/${author?.username}`}
        className="flex gap-1 cursor-pointer hover:text-green-400"
      >
        <ProfilePic firstChar={author?.username?.[0] ?? ""} />
        <span className="text-sm">{author?.username}</span>
      </a>
      <div className="ml-2">{comment?.content}</div>
      <div>
        <VotesSectionComment commentId={comment?.id} />
      </div>
      <div>
        <Comments nesting={nesting + 1} comments={comment?.comments} />
      </div>
    </div>
  );
}
