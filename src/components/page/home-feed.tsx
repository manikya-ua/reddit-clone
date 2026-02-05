"use client";
import React, { useMemo } from "react";
import type { posts } from "@/database/drizzle/schema";
import { useGetAllSubs } from "@/hooks/useGetAllSubs";
import { ShowFeed } from "./show-feed";

const HomeFeed = React.memo(
  ({
    className,
    withEdit,
    initialData,
  }: {
    className?: string;
    withEdit?: boolean;
    initialData: Array<typeof posts.$inferSelect>;
  }) => {
    const { data, isLoading } = useGetAllSubs();
    const postIds = useMemo(
      () => data?.result.flatMap((sub) => sub.posts ?? []),
      [data],
    );
    return (
      <div className={className ? className : "w-2xl mx-auto"}>
        <ShowFeed
          initialData={initialData}
          withEdit={withEdit}
          isLoading={isLoading}
          postIds={postIds}
        />
      </div>
    );
  },
);

export default HomeFeed;
