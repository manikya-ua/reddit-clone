"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Routes } from "@/client/routes";
import { useGetPostById } from "@/hooks/useGetPostById";
import { useGetSubById } from "@/hooks/useGetSub";
import { useGetUser } from "@/hooks/useGetUser";
import { cn } from "@/lib/utils";
import { client } from "@/server/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Indeterminate from "./indeterminate";
import ReplyForm from "./reply-form";

const VotesSection = React.memo(
  ({
    postId,
    withEdit,
    canComment,
  }: {
    postId: number | undefined;
    withEdit?: boolean;
    canComment?: boolean;
  }) => {
    const { data: user, isLoading: isLoadingUser } = useGetUser();
    const queryClient = useQueryClient();

    const { data: post } = useGetPostById({ postId });

    const { data: sub, isLoading: isLoadingSub } = useGetSubById({
      id: post?.sub,
    });

    const isLoading = isLoadingUser || isLoadingSub;

    const upvote = useCallback(async () => {
      if (!post?.id || !user?.id) {
        toast.error("You need to login to cast votes");
        return;
      }
      await client.api.v1.posts.upvote.$post({
        json: { postId: post.id, userId: user.id },
      });
      queryClient.invalidateQueries({ queryKey: ["get-post", post.id] });
    }, [post?.id, user?.id, queryClient]);

    const downvote = useCallback(async () => {
      if (!post?.id || !user?.id) {
        toast.error("You need to login to cast votes");
        return;
      }
      await client.api.v1.posts.downvote.$post({
        json: { postId: post.id, userId: user.id },
      });
      queryClient.invalidateQueries({ queryKey: ["get-post", post.id] });
    }, [post?.id, user?.id, queryClient]);

    const isUpvoted = useMemo(
      () => post?.upvotes?.includes(user?.id ?? -1),
      [post?.upvotes, user?.id],
    );
    const isDownvoted = useMemo(
      () => post?.downvotes?.includes(user?.id ?? -1),
      [post?.downvotes, user?.id],
    );
    return (
      <div className="flex gap-3 mt-5">
        <Indeterminate isLoading={isLoading} />
        {withEdit ? (
          <div
            className={cn(
              "rounded-full flex gap-2 items-center text-sm",
              isUpvoted
                ? "bg-orange-400"
                : isDownvoted
                  ? "bg-blue-400"
                  : "bg-neutral-700",
            )}
          >
            <button
              disabled={isLoading}
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
            {(post?.upvotes?.length ?? 0) - (post?.downvotes?.length ?? 0)}
            <button
              disabled={isLoading}
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
        ) : (
          <div className="text-xs">
            {(post?.upvotes?.length ?? 0) - (post?.downvotes?.length ?? 0)}{" "}
            upvotes
          </div>
        )}
        {withEdit ? (
          canComment ? (
            <Dialog>
              <DialogTrigger
                onClick={() => {
                  if (!user) {
                    toast.error("You need to login to comment");
                    throw new Error("unauthorized");
                  }
                }}
              >
                <div className="rounded-full flex gap-2 items-center text-sm bg-neutral-700 px-4 hover:bg-neutral-600 py-3">
                  <Image
                    src="/icons/comments-icon.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                  {post?.comments?.length}
                </div>
              </DialogTrigger>
              <DialogContent className="dark">
                <DialogTitle>Reply</DialogTitle>
                <ReplyForm authorId={user?.id} postId={postId} />
              </DialogContent>
            </Dialog>
          ) : (
            <a
              href={Routes.COMMENTS({
                subTitle: sub?.sub.title ?? "",
                postId: post?.id ?? "",
              })}
              className="rounded-full flex gap-2 items-center text-sm bg-neutral-700 px-4 hover:bg-neutral-600"
            >
              <Image
                src="/icons/comments-icon.svg"
                width={16}
                height={16}
                alt=""
              />
              {post?.comments?.length}
            </a>
          )
        ) : (
          <div className="text-xs">{post?.comments?.length ?? 0} Comments</div>
        )}
      </div>
    );
  },
);

export default VotesSection;
