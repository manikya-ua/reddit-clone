"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useGetSubs } from "@/app/hooks/useGetSubs";
import { useGetUser } from "@/app/hooks/useGetUser";
import schema from "@/app/schemas/new-post-schema.json";
import uiSchema from "@/app/schemas/new-post-ui-schema.json";
import { DefaultForm } from "@/components/form/default-form";
import { client } from "@/server/client";

type FormData = {
  title: string;
  content: string;
  sub: string | undefined;
};

export default function NewPostCard() {
  const [formData, setFormData] = useState<FormData>();

  const { data: user, isLoading } = useGetUser();
  const subResult = useGetSubs(user?.subs);
  const userSubs = subResult.map((sub) => sub.data);

  const newSchema = {
    ...schema,
    properties: {
      ...schema.properties,
      sub: {
        enum: userSubs.map((sub) => String(sub?.sub.id)),
      },
    },
  } as RJSFSchema;

  const newUiSchema = {
    ...uiSchema,
  };

  const {
    mutate: createPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user || !user.id) {
        throw new Error("You need to login to create a post");
      }
      if (!data.sub) {
        throw new Error("Need to post to a sub");
      }
      await client.api.v1.posts.$post({
        json: { ...data, userId: user.id, subId: data.sub },
      });
    },
  });

  return (
    <div className="flex flex-col rounded-2xl px-18 py-20 max-w-prose">
      <div className="grow shrink-0">
        <DefaultForm
          schema={newSchema}
          uiSchema={newUiSchema}
          formData={formData}
          onChange={(data) => {
            setFormData(data);
          }}
          onSubmit={(data) => {
            createPost(data.formData);
          }}
          disabled={isPending || isLoading}
        />
        <div className="text-rose-500 text-center mt-2">
          {error ? error.message : ""}
        </div>
      </div>
    </div>
  );
}
