import { useQuery } from "@tanstack/react-query";
import { client } from "@/server/client";

export function useGetAllSubs() {
  return useQuery({
    queryKey: ["get-all-subs"],
    queryFn: async () => {
      const result = await client.api.v1.subs.all.$get();
      return await result.json();
    },
  });
}
