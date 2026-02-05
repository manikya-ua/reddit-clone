"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { getDefaultForm } from "@/components/form/default-form";
import loginSchema from "@/schemas/login-schema.json";
import loginUiSchema from "@/schemas/login-ui-schema.json";
import { client } from "@/server/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import SignupCard from "./sign-up-card";

type FormData = {
  email: string;
  password: string;
};

const LoginCard = React.memo(({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData | undefined) => {
      if (!data) {
        throw new Error("form data needed");
      }
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
    onError: () => {
      toast.error("Invalid credentials");
    },
  });

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const DefaultForm = useMemo(() => getDefaultForm<FormData>(), []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col bg-[#181c1f] rounded-2xl px-18 py-20 border-none">
        <DialogTitle className="text-center text-2xl">Login</DialogTitle>
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
          <SignupCard>
            <div className="text-center mt-2">
              <button
                type="button"
                className="cursor-pointer underline hover:no-underline"
              >
                Sign up instead
              </button>
            </div>
          </SignupCard>
          <div className="text-rose-500 text-center mt-2">
            {error ? error.message : ""}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default LoginCard;
