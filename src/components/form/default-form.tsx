"use client";

import type { IChangeEvent } from "@rjsf/core";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import type { FormEvent } from "react";
import { useGetSubs } from "@/hooks/useGetSubs";
import { useGetUser } from "@/hooks/useGetUser";
import { ThemedForm } from "./themed-form";

type DefaultFormProps<T> = {
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: T;
  onChange: (data: T) => void;
  onSubmit: (data: IChangeEvent, event: FormEvent) => void;
  disabled?: boolean;
};

export function DefaultForm<T>({
  schema,
  uiSchema,
  formData,
  onChange,
  onSubmit,
  disabled,
}: DefaultFormProps<T>) {
  const { data: user } = useGetUser();
  const subsResult = useGetSubs(user?.subs);
  const userSubs = subsResult.map((sub) => sub.data);
  const idToTitleMap = new Map<number, string | null>();
  userSubs.forEach((sub) => {
    if (!sub?.sub.id) return;
    idToTitleMap.set(sub.sub.id, sub.sub.title);
  });
  return (
    <ThemedForm
      formData={formData}
      onChange={(data) => {
        onChange(data.formData as T);
      }}
      formContext={idToTitleMap}
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={onSubmit}
      disabled={disabled}
    />
  );
}
