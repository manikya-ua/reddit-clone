import { formatDistance, parse } from "date-fns";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { ShowFeed } from "@/components/page/show-feed";
import { db } from "@/database/drizzle/db";
import { posts } from "@/database/drizzle/schema";
import { getUserByUsername } from "@/lib/actions/auth";

export default async function Page({ params }: PageProps<"/user/[username]">) {
  const { username } = await params;
  const user = await getUserByUsername({ username });

  const userPosts = await Promise.all(
    user?.posts?.map(async (postId) => {
      const res = await db.select().from(posts).where(eq(posts.id, postId));
      if (!res) {
        throw new Error("post not found");
      }
      return res[0];
    }) ?? [],
  );

  return (
    <div className="flex-1 relative">
      <div className="flex flex-col gap-3 max-w-6xl mx-auto px-7 py-10">
        <div className="flex items-end gap-4">
          <div className="size-23.5 bg-neutral-600 rounded-full flex items-center justify-center text-4xl">
            {user?.username?.[0]}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-2xl font-bold">{user?.username}</span>
            <span className="text-lg">u/{user?.username}</span>
          </div>
        </div>
        <ShowFeed
          initialData={userPosts}
          withEdit={true}
          postIds={user?.posts}
        />
      </div>
      <div className="fixed top-16 right-2 bg-black p-4 rounded-md flex flex-col gap-3 w-68">
        <div className="flex justify-between items-center text-lg">
          {user?.username}
          <button
            className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors"
            type="button"
          >
            <Image
              src="/icons/hamburger-icon.svg"
              width={20}
              height={20}
              alt="hamburger"
            />
          </button>
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-600"
          >
            <Image
              src="/icons/chat-icon.svg"
              width={16}
              height={16}
              alt="Follow"
            />
            Follow
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900"
          >
            <Image
              src="/icons/chat-icon.svg"
              width={16}
              height={16}
              alt="Chat"
            />
            Start Chat
          </button>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-3">
          <div className="flex flex-col">
            <span className="text-white">{user?.karma}</span>
            <span className="text-neutral-400 text-xs">Karma</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white">{user?.posts?.length}</span>
            <span className="text-neutral-400 text-xs">posts</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white">
              {formatDistance(
                parse(
                  user?.createdAt ?? "2026-01-28",
                  "yyyy-MM-dd",
                  new Date(),
                ),
                new Date(),
                {
                  addSuffix: true,
                },
              )}
            </span>
            <span className="text-neutral-400 text-xs">Reddit Age</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white">{user?.subs?.length}</span>
            <span className="text-neutral-400 text-xs">Active in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
