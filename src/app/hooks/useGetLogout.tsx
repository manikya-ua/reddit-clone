import { useMutation } from "@tanstack/react-query";
import { client } from "@/server/client";
import { useRouter } from "next/navigation";

export function useGetLogout({ onSuccess }: { onSuccess: () => void }) {
  return useMutation({
    mutationFn: async () => {
      const response = await client.api.v1.sessions.logout.$post();
      if (response.status !== 200) {
        throw new Error("Could not logout");
      }
    },
    onSuccess,
  });
}
