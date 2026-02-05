import { useMutation } from "@tanstack/react-query";
import { client } from "@/server/client";

export const useLeaveSub = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: async ({
      userId,
      subId,
    }: {
      userId: number | undefined | null;
      subId: number | undefined | null;
    }) => {
      if (!userId || !subId) {
        throw new Error("User not logged in!");
      }
      const result = await client.api.v1.subs.leave.$post({
        json: {
          userId,
          subId,
        },
      });
      if (result.status !== 200) {
        throw new Error("Could not leave sub");
      }
      return await result.json();
    },
    onSuccess,
  });
};
