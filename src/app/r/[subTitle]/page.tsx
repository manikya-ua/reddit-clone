import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShowFeed } from "@/components/page/show-feed";
import SubSide from "@/components/page/sub-side";
import { db } from "@/database/drizzle/db";
import { posts, subs } from "@/database/drizzle/schema";

export default async function Page({ params }: PageProps<"/r/[subTitle]">) {
  const { subTitle } = await params;
  const sub = await db.select().from(subs).where(eq(subs.title, subTitle));

  if (!sub || sub.length === 0) {
    notFound();
  }

  const postsResults = await Promise.all(
    sub[0].posts?.map(async (postId) => {
      const res = await db.select().from(posts).where(eq(posts.id, postId));
      if (res.length === 0) {
        throw new Error("Post not found");
      }
      return res[0];
    }) ?? [],
  );

  return (
    <div className="flex-1 relative">
      <div className="flex flex-col gap-3 max-w-6xl mx-auto px-7 py-10">
        <div className="flex items-end gap-4">
          <div className="size-23.5 bg-neutral-600 rounded-full flex items-center justify-center text-4xl">
            <Image
              src="/icons/outline-logo.svg"
              width={58}
              height={58}
              alt="sub main image"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold">r/{sub[0].title}</span>
          </div>
        </div>
        <ShowFeed
          initialData={postsResults}
          postIds={sub[0].posts}
          withEdit={true}
        />
      </div>
      <SubSide subTitle={sub[0].title} />
    </div>
  );
}
