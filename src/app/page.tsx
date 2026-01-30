import { eq } from "drizzle-orm";
import HomeFeed from "@/components/page/home-feed";
import { db } from "@/database/drizzle/db";
import { posts, subs } from "@/database/drizzle/schema";

export default async function Home() {
  const allSubs = await db.select().from(subs);
  const allPostIds = allSubs.flatMap((sub) => sub.posts);
  const result: Array<typeof posts.$inferSelect> = [];
  const allPosts = await Promise.all(
    allPostIds.map(async (postId) => {
      if (!postId) {
        throw new Error("Postid needed");
      }
      return await db.select().from(posts).where(eq(posts.id, postId));
    }),
  );
  for (const row of allPosts) {
    if (!row) continue;
    result.push(...row);
  }
  return (
    <div className="flex justify-between">
      <div className="grow max-w-4xl">
        <HomeFeed initialData={result} withEdit={true} />
      </div>
      <div className="w-100 shrink-0 hidden xl:block">
        <div className="m-5 rounded-lg bg-black pt-7">
          <div className="uppercase text-sm text-neutral-300 ml-5">
            Recent Posts
          </div>
          <HomeFeed initialData={result} className="w-70 flex flex-col ml-4" />
        </div>
      </div>
    </div>
  );
}
