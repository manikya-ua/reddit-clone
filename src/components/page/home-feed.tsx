"use client";
import { useGetSubs } from "@/app/hooks/useGetSubs";
import { useGetUser } from "@/app/hooks/useGetUser";
import type { subs } from "@/database/drizzle/schema";
import { ShowFeed } from "./show-feed";

export default function HomeFeed() {
  const { data: user, isLoading: isUserLoading } = useGetUser();
  const subsResult = useGetSubs(user?.subs);
  const userSubs = subsResult.map((sub) => sub.data);
  const isSubsLoading = subsResult.some((sub) => sub.isLoading);
  const postIds = userSubs
    .filter(
      (sub): sub is { sub: typeof subs.$inferSelect } =>
        sub !== undefined && sub !== null,
    )
    .flatMap((sub) => sub?.sub.posts ?? []);
  const isLoading = isSubsLoading || isUserLoading;
  return (
    <div className="w-2xl mx-auto">
      <ShowFeed isLoading={isLoading} postIds={postIds} />
    </div>
  );
}
