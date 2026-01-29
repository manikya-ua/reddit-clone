import { useQuery } from "@tanstack/react-query";
import { client } from "@/server/client";

export const useGetUserDetailsById = ({
  id,
}: {
  id: number | null | undefined;
}) => {
  return useQuery({
    queryFn: async () => {
      if (id === null || id === undefined) {
        throw new Error("id needed");
      }
      const response = await client.api.v1.user["get-by-id"].$post({
        json: {
          id,
        },
      });
      if (response.status !== 200) {
        throw new Error("Could not get user");
      }
      return (await response.json()).user;
    },
    queryKey: ["get-user-id", id],
  });
};
