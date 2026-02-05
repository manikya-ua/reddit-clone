"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { Routes } from "@/client/routes";
import type { subs } from "@/database/drizzle/schema";
import { useGetSubs } from "@/hooks/useGetSubs";
import { useGetUser } from "@/hooks/useGetUser";
import { useLeaveSub } from "@/hooks/useLeaveSub";
import { Skeleton } from "../ui/skeleton";
import WithTooltip from "./with-tooltip";

export const CommunityList = React.memo(() => {
  const { data: user, isLoading: isLoadingUser } = useGetUser();
  const subsResult = useGetSubs(user?.subs);
  const userSubs = useMemo(
    () => subsResult.map((sub) => sub.data),
    [subsResult],
  );
  const isLoadingSubs = useMemo(
    () => subsResult.some((sub) => sub.isLoading),
    [subsResult],
  );
  const queryClient = useQueryClient();
  const { mutate: leaveSub, isPending } = useLeaveSub({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
  const leaveSubWithUser = useCallback(
    ({ subId }: { subId: number | null | undefined }) => {
      leaveSub({ userId: user?.id, subId });
    },
    [user?.id, leaveSub],
  );

  const isLoading = isLoadingUser || isLoadingSubs;

  return (
    <ul className="flex flex-col gap-2">
      {isLoading
        ? Array(5)
            .fill(null)
            .map((_, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: Index is the key
              <LoadingSkeleton key={idx} />
            ))
        : userSubs
            .filter(
              (sub): sub is { sub: typeof subs.$inferSelect } =>
                sub !== undefined,
            )
            .map(({ sub }) => (
              <Row
                key={sub.id}
                sub={sub}
                leaveSub={leaveSubWithUser}
                isPending={isPending}
              />
            ))}
    </ul>
  );
});

const Row = React.memo(
  ({
    sub,
    leaveSub,
    isPending,
  }: {
    sub: typeof subs.$inferSelect;
    leaveSub: (inp: { subId: number | null | undefined }) => void;
    isPending: boolean;
  }) => {
    return (
      <li key={sub.id} className="flex">
        <a
          href={Routes.SUBREDDIT({ subTitle: sub.title ?? "" })}
          className="flex gap-2 group"
        >
          <Image src="/icons/outline-logo.svg" width={20} height={20} alt="" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm group-hover:text-blue-400">
              {sub.title}
            </span>
            <span className="text-xs text-neutral-400">
              {sub.description?.slice(0, 30)}
            </span>
          </div>
        </a>
        <div className="flex gap-2 items-center ml-auto">
          <WithTooltip tooltipText={`Favourite r/${sub.title}`}>
            <Image
              src={"/icons/star-icon.svg"}
              width={16}
              height={16}
              alt="star"
            />
          </WithTooltip>
          <WithTooltip tooltipText={`Leave r/${sub.title}`}>
            <button
              type="button"
              className="rounded-full border-neutral-400 border hover:border-white cursor-pointer px-4 py-2 text-xs"
              disabled={isPending}
              onClick={() => {
                leaveSub({ subId: sub.id });
              }}
            >
              Joined
            </button>
          </WithTooltip>
        </div>
      </li>
    );
  },
);

const LoadingSkeleton = React.memo(() => {
  return (
    <li className="flex">
      <a href={Routes.HOMEPAGE} className="flex gap-2 group">
        <Skeleton className="size-5 rounded-full"></Skeleton>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm group-hover:text-blue-400">
            <Skeleton className="h-3 w-20"></Skeleton>
          </span>
          <span className="text-xs text-neutral-400">
            <Skeleton className="h-3 w-48"></Skeleton>
          </span>
        </div>
      </a>
      <div className="flex gap-2 items-center ml-auto">
        <Skeleton className="size-4 rounded-full"></Skeleton>
        <Skeleton className="rounded-full  borderpx-4 py-2 text-xs">
          <span className="block w-12 h-3"></span>
        </Skeleton>
      </div>
    </li>
  );
});
