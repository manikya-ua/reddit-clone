import { eq } from "drizzle-orm";
import { PostWithComments } from "@/components/page/post-with-comments";
import SubSide from "@/components/page/sub-side";
import { db } from "@/database/drizzle/db";
import { posts, subs } from "@/database/drizzle/schema";

export default async function Page({
  params,
}: PageProps<"/r/[subTitle]/comments/[postId]">) {
  const { subTitle, postId } = await params;
  const parsedPostId = parseInt(postId, 10);

  const subsResult = await db
    .select()
    .from(subs)
    .where(eq(subs.title, subTitle));
  const sub = subsResult[0];

  const postsResult = await db
    .select()
    .from(posts)
    .where(eq(posts.id, parsedPostId));
  const post = postsResult[0];

  return (
    <div className="flex-1 relative">
      <PostWithComments
        subTitle={subTitle}
        postId={parsedPostId}
        initialData={{ sub, post }}
      />
      <SubSide subTitle={subTitle} />
    </div>
  );
}
