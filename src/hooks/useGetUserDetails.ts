import { useQuery } from "@tanstack/react-query";
import { client } from "@/server/client";

export const useGetUserDetails = ({ username }: { username: string }) => {
  return useQuery({
    queryFn: async () => {
      const response = await client.api.v1.user.$get({
        query: {
          username,
        },
      });
      if (response.status !== 200) {
        throw new Error("Could not get user");
      }
      return (await response.json()).user;
    },
    queryKey: ["get-user-username", username],
  });
};
