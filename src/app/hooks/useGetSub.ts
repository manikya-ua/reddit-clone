import { useQuery } from "@tanstack/react-query";
import { client } from "@/server/client";

export const useGetSub = ({ title }: { title: string }) => {
  return useQuery({
    queryFn: async () => {
      const subResult = await client.api.v1.subs["get-sub-title"].$post({
        json: { title },
      });
      if (subResult.status !== 200) {
        throw new Error("Could not get sub");
      }
      return await subResult.json();
    },
    queryKey: ["get-sub-title", title],
  });
};
