"use client";

import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { getDefaultForm } from "@/components/form/default-form";
import signupSchema from "@/schemas/signup-schema.json";
import signupUiSchema from "@/schemas/signup-ui-schema.json";
import { client } from "@/server/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type FormData = {
  username: string;
  email: string;
  password: string;
};

const SignupCard = React.memo(
  ({
    children,
    schema = signupSchema as RJSFSchema,
    uiSchema = signupUiSchema,
  }: {
    children: React.ReactNode;
    schema?: RJSFSchema;
    uiSchema?: UiSchema;
  }) => {
    const {
      mutate: signUp,
      isPending,
      error,
    } = useMutation({
      mutationFn: async (data: FormData | undefined) => {
        if (!data) {
          throw new Error("form data required");
        }
        const res = await client.api.v1.user.$post({ json: data });
        if (res.status !== 200) {
          throw new Error("Invalid username or email");
        }
      },
      onSuccess: () => window.location.reload(),
    });

    const [formData, setFormData] = useState<FormData>({
      username: "",
      email: "",
      password: "",
    });

    const DefaultForm = useMemo(() => getDefaultForm<FormData>(), []);

    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="flex flex-col bg-[#181c1f] rounded-2xl px-18 py-20 border-none">
          <DialogTitle className="text-center text-2xl">Sign up</DialogTitle>
          <div className="grow shrink-0">
            <DefaultForm
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              onChange={(data) => {
                setFormData(data);
              }}
              onSubmit={(data) => {
                signUp(data.formData);
              }}
              disabled={isPending}
            />
            <div className="text-rose-500 text-center mt-2">
              {error ? error.message : ""}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  },
);

export default SignupCard;
