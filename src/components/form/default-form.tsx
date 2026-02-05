"use client";

import type { IChangeEvent } from "@rjsf/core";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import React, { type FormEvent, useCallback } from "react";
import { useGetSubs } from "@/hooks/useGetSubs";
import { useGetUser } from "@/hooks/useGetUser";
import { getThemedForm } from "./themed-form";

type DefaultFormProps<T> = {
  schema: RJSFSchema;
  uiSchema: UiSchema;
  formData: T;
  onChange: (data: T) => void;
  onSubmit: (data: IChangeEvent, event: FormEvent) => void;
  disabled?: boolean;
};

export function getDefaultForm<T>() {
  return React.memo(
    ({
      schema,
      uiSchema,
      formData,
      onChange,
      onSubmit,
      disabled,
    }: DefaultFormProps<T>) => {
      const { data: user } = useGetUser();
      const subsResult = useGetSubs(user?.subs);
      const userSubs = subsResult.map((sub) => sub.data);
      const idToTitleMap = new Map<number, string | null>();
      userSubs.forEach((sub) => {
        if (!sub?.sub.id) return;
        idToTitleMap.set(sub.sub.id, sub.sub.title);
      });
      const onChangeForm = useCallback(
        (data: IChangeEvent) => {
          onChange(data.formData as T);
        },
        [onChange],
      );
      const ThemedForm = getThemedForm<T>();
      return (
        <ThemedForm
          formData={formData}
          onChange={onChangeForm}
          formContext={idToTitleMap}
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
          onSubmit={onSubmit}
          disabled={disabled}
        />
      );
    },
  );
}
