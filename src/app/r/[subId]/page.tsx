"use client";
import { useQueryClient } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import Image from "next/image";
import React from "react";
import { useGetSub } from "@/app/hooks/useGetSub";
import { useGetSubs } from "@/app/hooks/useGetSubs";
import { useGetUser } from "@/app/hooks/useGetUser";
import { useJoinSub } from "@/app/hooks/useJoinSub";
import { useLeaveSub } from "@/app/hooks/useLeaveSub";
import { ShowFeed } from "@/components/page/show-feed";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: PageProps<"/r/[subId]">) {
  const { subId } = React.use(params);
  const { data, isLoading: isLoadingSub } = useGetSub({ title: subId });
  const sub = data?.sub;

  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const subsResult = useGetSubs(user?.subs);
  const userSubs = subsResult.map((sub) => sub.data);
  const isLoadingUserSubs = subsResult.some((sub) => sub.isLoading);

  const isJoinedSub = userSubs.map((sub) => sub?.sub.title).includes(subId);

  const queryClient = useQueryClient();

  const { mutate: leaveSub, isPending: isLeavingSub } = useLeaveSub({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
  });
  const { mutate: joinSub, isPending: isJoiningSub } = useJoinSub({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
  });

  const isModifyingSub = isLeavingSub || isJoiningSub;

  const handleSubJoin = () => {
    if (isLoadingSub || isLoadingUser || isLoadingUserSubs || isModifyingSub)
      return;
    if (isJoinedSub) {
      leaveSub({ userId: user?.id, subId: sub?.id });
    } else {
      joinSub({ userId: user?.id, subId: sub?.id });
    }
  };

  const isLoading = isLoadingSub || isLoadingUserSubs || isLoadingUser;

  return (
    <div className="flex-1 relative">
      <div className="flex flex-col gap-3 max-w-6xl mx-auto px-7 py-10">
        <div className="flex items-end gap-4">
          <div className="size-23.5 bg-neutral-600 rounded-full flex items-center justify-center text-4xl">
            <Image
              src="/icons/outline-logo.svg"
              width={58}
              height={58}
              alt=""
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="inline-block h-5 w-20 mt-1"></Skeleton>
              ) : (
                <>
                  r/{sub?.title}
                </>
              )}
            </span>
          </div>
        </div>
        <ShowFeed isLoading={isLoading} postIds={sub?.posts} />
      </div>
      <div className="fixed top-16 right-2 bg-neutral-700 p-4 rounded-md flex flex-col gap-3 w-68">
        <div className="flex justify-between items-center text-lg">
          {isLoading ? (
            <Skeleton className="inline-block h-5 w-20 mt-1"></Skeleton>
          ) : (
            sub?.title
          )}
        </div>
        <div className="flex gap-2 text-xs">
          <a
            href={`/submit?from=${sub?.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black"
          >
            <Image src="/icons/plus-icon.svg" width={16} height={16} alt="" />
            Create Post
          </a>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer"
            onClick={() => handleSubJoin()}
            disabled={isLoading || isModifyingSub}
          >
            {isJoinedSub ? "Joined" : "Join"}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <Image src="/icons/cake-icon.svg" width={14} height={14} alt="" />
            <span className="text-xs text-neutral-300">
              Created{" "}
              {format(
                parse(sub?.createdAt ?? "2026-01-28", "yyyy-MM-dd", new Date()),
                "MMM dd, yyyy",
              )}
            </span>
          </div>
          <div className="flex gap-3">
            <Image src="/icons/globe-icon.svg" width={14} height={14} alt="" />
            <span className="text-xs text-neutral-300">Public</span>
          </div>
        </div>
      </div>
    </div>
  );
}
