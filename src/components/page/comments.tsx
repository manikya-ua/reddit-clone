"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Routes } from "@/client/routes";
import { useGetCommentById } from "@/hooks/useGetCommentById";
import { useGetUserDetailsById } from "@/hooks/useGetUserDetailsById";
import { cn } from "@/lib/utils";
import ProfilePic from "./profile-pic";
import VotesSectionComment from "./votes-section-comment";

const Comments = React.memo(
  ({
    comments,
    nesting = 0,
    isParentHover = false,
  }: {
    comments: number[] | null | undefined;
    nesting?: number;
    isParentHover?: boolean;
  }) => {
    return (
      <div style={{ marginLeft: `3rem` }}>
        {comments?.map((comment) => (
          <Comment
            isParentHover={isParentHover}
            nesting={nesting}
            commentId={comment}
            key={comment}
          />
        ))}
      </div>
    );
  },
);

const Comment = React.memo(
  ({
    commentId,
    nesting,
    isParentHover = false,
  }: {
    commentId: number;
    nesting: number;
    isParentHover?: boolean;
  }) => {
    const { data: comment, isLoading: isLoadingComment } =
      useGetCommentById(commentId);
    const { data: author, isLoading: isLoadingAuthor } = useGetUserDetailsById({
      id: comment?.author,
    });
    const isLoading = isLoadingComment || isLoadingAuthor;

    const [collapsed, setCollapsed] = useState(false);
    const [isHover, setIsHover] = useState(false);

    const hovered = isHover || isParentHover;

    if (isLoading) {
      return <Loader2 className="size-4 animate-spin m-5" />;
    }

    return (
      <div className="relative flex flex-col gap-2">
        {collapsed ? (
          <button
            className="flex items-center gap-3 my-2"
            type="button"
            onClick={() => setCollapsed(false)}
          >
            <Image src="/icons/plus-round.svg" width={20} height={20} alt="Expand" />
            <span className="text-sm">{author?.username}</span>
          </button>
        ) : (
          <>
            <button
              className="group cursor-pointer block"
              type="button"
              onMouseOver={() => setIsHover(true)}
              onMouseOut={() => setIsHover(false)}
              onFocus={() => setIsHover(true)}
              onBlur={() => setIsHover(false)}
              onClick={() => setCollapsed(true)}
            >
              <div className="absolute top-4 py-2 -left-2">
                <div
                  className={cn(
                    "h-px bg-neutral-600 w-2",
                    hovered && "bg-neutral-200",
                  )}
                ></div>
              </div>
              <div className="absolute top-6 px-2 bottom-4 -left-4">
                <div
                  className={cn(
                    "w-px bg-neutral-600 h-full",
                    hovered && "bg-neutral-200",
                  )}
                ></div>
              </div>
              <div className="absolute bottom-4 w-1 h-3 border-3 bg-transparent border-transparent border-b-neutral-600 -left-[0.67rem]"></div>
            </button>
            <a
              href={Routes.USER({ username: author?.username ?? "" })}
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
              <Comments
                isParentHover={hovered}
                nesting={nesting + 1}
                comments={comment?.comments}
              />
            </div>
          </>
        )}
      </div>
    );
  },
);

export default Comments;
