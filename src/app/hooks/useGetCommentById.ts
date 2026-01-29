import { useQuery } from "@tanstack/react-query";
import { client } from "@/server/client";

export function useGetCommentById(commentId: number | undefined | null) {
  return useQuery({
    queryKey: ["get-comment", commentId],
    queryFn: async () => {
      if (!commentId) {
        throw new Error("Comment id needef");
      }
      const postsResults = await client.api.v1.comments["get-comment"].$post({
        json: { id: commentId },
      });
      if (postsResults.status !== 200) {
        throw new Error("Could not find the comment");
      }
      return (await postsResults.json()).comment;
    },
    enabled: Boolean(commentId),
  });
}
