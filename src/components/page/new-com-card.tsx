"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import schema from "@/app/schemas/new-com-schema.json";
import uiSchema from "@/app/schemas/new-com-ui-schema.json";
import { DefaultForm } from "@/components/form/default-form";
import { useGetUser } from "@/hooks/useGetUser";
import { client } from "@/server/client";

type FormData = {
  title: string;
  description: string;
  status: "public" | "private";
};

const NewComCard = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "public",
  });

  const { data: user, isLoading } = useGetUser();

  const router = useRouter();

  const {
    mutate: createSub,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user || !user.id) {
        throw new Error("You need to login to create a sub");
      }
      const result = await client.api.v1.subs.create.$post({
        json: {
          ...data,
          rules: [],
          userId: user.id,
        },
      });
      if (result.status !== 200) {
        throw new Error("Could not create new sub");
      }
    },
    onSuccess: () => router.replace(`/r/${formData.title}`),
  });

  return (
    <div className="flex flex-col rounded-2xl px-18 py-20 max-w-prose">
      <div className="grow shrink-0">
        <DefaultForm
          schema={schema as RJSFSchema}
          uiSchema={uiSchema}
          formData={formData}
          onChange={(data) => {
            setFormData(data);
          }}
          onSubmit={(data) => {
            createSub(data.formData);
          }}
          disabled={isPending || isLoading}
        />
        <div className="text-rose-500 text-center mt-2">
          {error ? error.message : ""}
        </div>
      </div>
    </div>
  );
};

export default NewComCard;
