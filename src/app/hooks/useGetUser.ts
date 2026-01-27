import { useQuery } from "@tanstack/react-query";
import { client } from "@/server/client";

export function useGetUser() {
  return useQuery({
    queryFn: async () => {
      const response = await client.api.v1.user["auth-user"].$get();
      if (response.status !== 200) {
        localStorage.removeItem("user");
        throw new Error("Invalid session stored");
      }
      const { user } = await response.json();
      return user;
    },
    queryKey: ["get-user"],
    retry: 1,
  });
}
