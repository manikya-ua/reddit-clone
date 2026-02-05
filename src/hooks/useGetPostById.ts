import { useQuery } from "@tanstack/react-query";
import type { posts } from "@/database/drizzle/schema";
import { client } from "@/server/client";

export function useGetPostById({
  postId,
  initialData,
}: {
  postId: number | undefined;
  initialData?: typeof posts.$inferSelect;
}) {
  return useQuery({
    queryKey: ["get-post", postId],
    queryFn: async () => {
      if (postId === undefined) {
        throw new Error("post id needed");
      }
      const postsResults = await client.api.v1.posts["get-post"].$post({
        json: { id: postId },
      });
      if (postsResults.status !== 200) {
        throw new Error("Could not find the post");
      }
      return await postsResults.json();
    },
    initialData,
  });
}
