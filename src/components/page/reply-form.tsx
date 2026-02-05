"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import schema from "@/schemas/reply-schema.json";
import uiSchema from "@/schemas/reply-ui-schema.json";
import { client } from "@/server/client";
import { DefaultForm } from "../form/default-form";

type FormData = {
  content: string;
};

/**
 * Must have either commentId or postId to attach comment to
 */
const ReplyForm = React.memo(
  ({
    commentId,
    authorId,
    postId,
  }: {
    commentId?: number;
    postId?: number;
    authorId: number | undefined;
  }) => {
    const [formData, setFormData] = useState<FormData>({
      content: "",
    });

    const queryClient = useQueryClient();

    const { mutate: addCommentToComment, isPending: isAddingCommentToComment } =
      useMutation({
        mutationFn: async (data: FormData) => {
          if (!commentId || !authorId) return;
          const result = await client.api.v1.comments[
            "comment-to-comment"
          ].$post({
            json: {
              commentId,
              authorId,
              content: data.content,
            },
          });
          if (result.status !== 200) {
            throw new Error("Could not comment");
          }
        },
        onSuccess: () =>
          queryClient.invalidateQueries({
            queryKey: ["get-comment", commentId],
          }),
      });

    const { mutate: addCommentToPost, isPending: isAddingCommentToPost } =
      useMutation({
        mutationFn: async (data: FormData) => {
          if (!postId || !authorId) return;
          const result = await client.api.v1.comments["comment-to-post"].$post({
            json: {
              postId,
              authorId,
              content: data.content,
            },
          });
          if (result.status !== 200) {
            throw new Error("Could not comment");
          }
        },
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["get-post", postId] }),
      });

    const onSubmit = useCallback(() => {
      if (commentId && postId) {
        throw new Error("Only one of commentId or postId needed");
      } else if (commentId) {
        addCommentToComment(formData);
      } else if (postId) {
        addCommentToPost(formData);
      } else {
        throw new Error("Either commentId or postId needed");
      }
    }, [commentId, postId, formData, addCommentToComment, addCommentToPost]);

    return (
      <DefaultForm
        schema={schema as RJSFSchema}
        uiSchema={uiSchema}
        onChange={(formData) => {
          setFormData(formData);
        }}
        disabled={isAddingCommentToPost || isAddingCommentToComment}
        onSubmit={onSubmit}
        formData={formData}
      />
    );
  },
);

export default ReplyForm;
