"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import loginSchema from "@/app/schemas/login-schema.json";
import loginUiSchema from "@/app/schemas/login-ui-schema.json";
import { DefaultForm } from "@/components/form/default-form";
import { client } from "@/server/client";

export default function LoginCard() {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const session = await client.api.v1.sessions.$post({
        json: { email: data.email, password: data.password },
      });

      if (session.status !== 200) {
        throw new Error("Something wnent wrong");
      }

      const { session: parsedSession } = await session.json();

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: parsedSession.email,
          descriptor: parsedSession.descriptor,
        }),
      );

      queryClient.invalidateQueries({ queryKey: ["get-user"] });
    },
  });

  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    },
  );
  return (
    <div className="flex flex-col bg-[#181c1f] rounded-2xl px-18 py-20">
      <div className="grow shrink-0">
        <DefaultForm
          schema={loginSchema as RJSFSchema}
          uiSchema={loginUiSchema}
          formData={formData}
          onChange={(data) => {
            setFormData(data);
          }}
          onSubmit={(data) => {
            login(data.formData);
          }}
          disabled={isPending}
        />
        <div className="text-rose-500 text-center mt-2">
          {error ? error.message : ""}
        </div>
      </div>
    </div>
  );
}
