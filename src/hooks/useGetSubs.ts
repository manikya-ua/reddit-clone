import { useQueries } from "@tanstack/react-query";
import { client } from "@/server/client";

export const useGetSubs = (subs: Array<number> | undefined | null) => {
  return useQueries({
    queries: (subs ?? []).map((sub) => ({
      queryKey: ["get-sub", sub],
      queryFn: async () => {
        const result = await client.api.v1.subs["get-sub"].$post({
          json: {
            id: sub,
          },
        });
        if (result.status !== 200) {
          throw new Error("Could not get sub");
        }
        return await result.json();
      },
    })),
  });
};
