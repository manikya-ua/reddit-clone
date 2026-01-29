import { formatDistance, parse } from "date-fns";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import Comments from "@/components/page/comments";
import SubSide from "@/components/page/sub-side";
import VotesSection from "@/components/page/votes-section";
import { db } from "@/database/drizzle/db";
import { posts, subs, type users } from "@/database/drizzle/schema";
import { getUser } from "@/lib/server-actions";
import BackButton from "@/components/page/back-button";

export default async function Page({
  params,
}: PageProps<"/r/[subTitle]/comments/[postId]">) {
  const { subTitle, postId } = await params;

  const parsedPostId = parseInt(postId, 10);

  const subResult = await db
    .select()
    .from(subs)
    .where(eq(subs.title, subTitle));

  if (!subResult || subResult.length === 0) {
    notFound();
  }
  const sub = subResult[0];

  const postResult = await db
    .select()
    .from(posts)
    .where(eq(posts.id, parsedPostId));

  if (!postResult || postResult.length === 0) {
    notFound();
  }
  const post = postResult[0];

  const { user } = await getUser();

  return (
    <div className="flex-1 relative">
      <WithComments sub={sub} post={post} user={user} />
      <SubSide sub={sub} />
    </div>
  );
}

function WithComments({
  sub,
  user,
  post,
}: {
  sub: typeof subs.$inferSelect | undefined;
  user: typeof users.$inferSelect | undefined;
  post: typeof posts.$inferSelect | undefined;
}) {
  return (
    <div className="flex gap-3 max-w-6xl mx-auto px-7 py-10">
      <div>
        <BackButton />
      </div>
      <div className="grow flex flex-col gap-1">
        <div className="flex gap-5">
          <Image src="/icons/outline-logo.svg" width={20} height={20} alt="" />
          <div className="flex flex-col gap-0.5">
            <span>r/{sub?.title}</span>
            <span className="text-xs">{user?.username}</span>
          </div>
          <div className="text-sm text-neutral-400">
            {formatDistance(
              parse(post?.createdAt ?? "2026-01-28", "yyyy-MM-dd", new Date()),
              new Date(),
              {
                addSuffix: true,
              },
            )}
          </div>
        </div>
        <div className="text-2xl font-semibold mt-5 mb-3">{post?.title}</div>
        <div className="text-pretty text-base text-neutral-300">
          {post?.content}
        </div>
        <div className="mb-5">
          <VotesSection postId={post?.id} withEdit={true} canComment={true} />
        </div>
        <Comments comments={post?.comments} />
      </div>
    </div>
  );
}
