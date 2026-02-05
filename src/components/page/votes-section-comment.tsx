"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useGetCommentById } from "@/hooks/useGetCommentById";
import { useGetUser } from "@/hooks/useGetUser";
import { cn } from "@/lib/utils";
import { client } from "@/server/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ReplyForm from "./reply-form";

const VotesSectionComment = React.memo(
  ({ commentId }: { commentId: number | undefined }) => {
    const { data: user, isLoading: isLoadingUser } = useGetUser();
    const queryClient = useQueryClient();

    const { data: comment } = useGetCommentById(commentId);

    const isLoading = isLoadingUser;

    const upvote = useCallback(async () => {
      if (!comment?.id || !user?.id) {
        toast.error("You need to login to cast votes");
        return;
      }
      await client.api.v1.comments.upvote.$post({
        json: { commentId: comment.id, userId: user.id },
      });
      queryClient.invalidateQueries({ queryKey: ["get-comment", comment.id] });
    }, [comment?.id, user?.id, queryClient]);

    const downvote = useCallback(async () => {
      if (!comment?.id || !user?.id) {
        toast.error("You need to login to cast votes");
        return;
      }
      await client.api.v1.comments.downvote.$post({
        json: { commentId: comment.id, userId: user.id },
      });
      queryClient.invalidateQueries({ queryKey: ["get-comment", comment.id] });
    }, [comment?.id, user?.id, queryClient]);

    const isUpvoted = useMemo(
      () => comment?.upvotes?.includes(user?.id ?? -1),
      [comment?.upvotes, user?.id],
    );
    const isDownvoted = useMemo(
      () => comment?.downvotes?.includes(user?.id ?? -1),
      [comment?.downvotes, user?.id],
    );
    return (
      <div className="flex gap-2">
        <div
          className={cn(
            "rounded-full flex gap-1 items-center text-xs",
            isUpvoted ? "bg-orange-400" : isDownvoted ? "bg-blue-400" : "",
          )}
        >
          <button
            disabled={isLoading}
            type="button"
            className="p-1.5 hover:bg-neutral-600 rounded-full group"
            onClick={() => upvote()}
          >
            <Image
              src="/icons/up-icon.svg"
              width={12}
              height={12}
              alt=""
              className="block group-hover:hidden"
            />
            <Image
              src="/icons/up-icon-red.svg"
              width={12}
              height={12}
              alt=""
              className="group-hover:block hidden"
            />
          </button>
          {(comment?.upvotes?.length ?? 0) - (comment?.downvotes?.length ?? 0)}
          <button
            disabled={isLoading}
            type="button"
            className="p-1.5 hover:bg-neutral-600 rounded-full group"
            onClick={() => downvote()}
          >
            <Image
              src="/icons/down-icon.svg"
              width={12}
              height={12}
              alt=""
              className="block group-hover:hidden"
            />
            <Image
              src="/icons/down-icon-blue.svg"
              width={12}
              height={12}
              alt=""
              className="group-hover:block hidden"
            />
          </button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex gap-1 px-2 py-1 rounded-full text-xs items-center cursor-pointer hover:bg-neutral-800"
              onClick={() => {
                if (!user) {
                  toast.error("You need to login to comment");
                  throw new Error("unauthorized");
                }
              }}
            >
              <Image
                src="/icons/reply-icon.svg"
                width={12}
                height={12}
                alt=""
              />
              <span>Reply</span>
            </button>
          </DialogTrigger>
          <DialogContent className="dark">
            <DialogTitle>Reply</DialogTitle>
            <ReplyForm authorId={user?.id} commentId={commentId} />
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);

export default VotesSectionComment;
