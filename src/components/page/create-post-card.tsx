"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { getDefaultForm } from "@/components/form/default-form";
import { useGetSubs } from "@/hooks/useGetSubs";
import { useGetUser } from "@/hooks/useGetUser";
import schema from "@/schemas/new-post-schema.json";
import uiSchema from "@/schemas/new-post-ui-schema.json";
import { client } from "@/server/client";

type FormData = {
  title: string;
  content: string;
  sub: string | undefined;
};

const NewPostCard = React.memo(() => {
  const [formData, setFormData] = useState<FormData>();

  const { data: user, isLoading } = useGetUser();
  const subResult = useGetSubs(user?.subs);
  const userSubs = useMemo(() => subResult.map((sub) => sub.data), [subResult]);
  const isLoadingUserSubs = useMemo(
    () => subResult.some((sub) => sub.isLoading),
    [subResult],
  );

  const newSchema = useMemo(
    () =>
      ({
        ...schema,
        properties: {
          ...schema.properties,
          sub: {
            enum: userSubs.map((sub) => String(sub?.sub.id)),
          },
        },
      }) as RJSFSchema,
    [userSubs],
  );

  const newUiSchema = uiSchema;

  const router = useRouter();

  const {
    mutate: createPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData | undefined) => {
      if (!user || !user.id) {
        throw new Error("You need to login to create a post");
      }
      if (!data) {
        throw new Error("form data required");
      }
      if (!data.sub) {
        throw new Error("Need to post to a sub");
      }
      await client.api.v1.posts.$post({
        json: { ...data, userId: user.id, subId: data.sub },
      });
    },
    onSuccess: async () => {
      const parsedSubId = parseInt(formData?.sub ?? "", 10);
      const subResult = await client.api.v1.subs["get-sub"].$post({
        json: { id: parsedSubId },
      });
      if (subResult.status !== 200) {
        // in the worst case, move the user away from this page
        router.replace("/");
        return;
      }
      const { sub } = await subResult.json();
      router.replace(`/r/${sub.title}`);
    },
  });

  const DefaultForm = useMemo(() => getDefaultForm<FormData | undefined>(), []);

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
});

export default NewPostCard;
