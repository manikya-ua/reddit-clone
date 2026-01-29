"use client";

import { useGetCommentById } from "@/app/hooks/useGetCommentById";
import { useGetUserDetailsById } from "@/app/hooks/useGetUserDetailsById";
import ProfilePic from "./ProfilePic";
import VotesSectionComment from "./votes-section-comment";

export default function Comments({
  comments,
  nesting = 0,
}: {
  comments: number[] | null | undefined;
  nesting?: number;
}) {
  return (
    <div style={{ marginLeft: `1.5rem` }}>
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
  return (
    <div className="relative flex flex-col gap-2">
      <div className="absolute inset-y-0 w-px bg-neutral-600 -left-2"></div>
      <div className="flex gap-1">
        <ProfilePic firstChar={author?.username?.[0] ?? ""} />
        <span className="text-sm">{author?.username}</span>
      </div>
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
