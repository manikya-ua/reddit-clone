"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Routes } from "@/client/routes";
import { useGetSub } from "@/hooks/useGetSub";
import { useGetSubs } from "@/hooks/useGetSubs";
import { useGetUser } from "@/hooks/useGetUser";
import { useJoinSub } from "@/hooks/useJoinSub";
import { useLeaveSub } from "@/hooks/useLeaveSub";

const SubSide = React.memo(({ subTitle }: { subTitle: string | null }) => {
  const { data: sub, isLoading: isLoadingSub } = useGetSub({
    title: subTitle,
  });

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

  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const subsResult = useGetSubs(user?.subs);
  const userSubs = useMemo(
    () => subsResult.map((sub) => sub.data),
    [subsResult],
  );
  const isJoinedSub = useMemo(
    () => userSubs.map((sub) => sub?.sub.title).includes(sub?.title),
    [userSubs, sub?.title],
  );

  const userId = user?.id;

  const handleSubJoin = useCallback(() => {
    if (isModifyingSub || !userId) {
      toast.error("You need to be logged in to join a sub");
    }
    if (isJoinedSub) {
      leaveSub({ userId, subId: sub?.id });
    } else {
      joinSub({ userId, subId: sub?.id });
    }
  }, [isModifyingSub, userId, leaveSub, joinSub, sub?.id, isJoinedSub]);

  return (
    <div className="fixed top-16 right-2 bg-black p-4 rounded-md flex flex-col gap-3 w-68">
      <div className="flex justify-between items-center text-lg">
        {sub?.title}
      </div>
      <div className="flex gap-2 text-xs">
        <a
          href={Routes.NEW_POST}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
          onClick={(e) => {
            if (!userId) {
              toast.error("You need to login to post");
              e.preventDefault();
            }
          }}
        >
          <Image src="/icons/plus-icon.svg" width={16} height={16} alt="New post" />
          Create Post
        </a>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-800 cursor-pointer"
          onClick={() => handleSubJoin()}
          disabled={isModifyingSub}
        >
          {isLoadingUser ? "....." : isJoinedSub ? "Joined" : "Join"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Image src="/icons/cake-icon.svg" width={14} height={14} alt="Birthday" />
          <span className="text-xs text-neutral-300">
            Created{" "}
            {format(
              parse(sub?.createdAt ?? "2026-01-28", "yyyy-MM-dd", new Date()),
              "MMM dd, yyyy",
            )}
          </span>
        </div>
        <div className="flex gap-3">
          <Image src="/icons/globe-icon.svg" width={14} height={14} alt="Visibility" />
          <span className="text-xs text-neutral-300">
            {sub?.status === "private" ? "Private" : "Public"}
          </span>
        </div>
      </div>
    </div>
  );
});

export default SubSide;
