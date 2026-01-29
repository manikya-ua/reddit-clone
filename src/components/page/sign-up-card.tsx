"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import signUpSchema from "@/app/schemas/signup-schema.json";
import signUpUiSchema from "@/app/schemas/signup-ui-schema.json";
import { DefaultForm } from "@/components/form/default-form";
import { client } from "@/server/client";
import { useRouter } from "next/navigation";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function SignupCard({
  setShowModal,
}: {
  setShowModal: React.Dispatch<
    React.SetStateAction<"none" | "login" | "signup">
  >;
}) {
  const [formData, setFormData] = useState<FormData>();

  const router = useRouter();

  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await client.api.v1.user.$post({ json: data });
      if (res.status !== 200) {
        throw new Error("Invalid username or email");
      }
    },
  });

  return (
    <div className="flex flex-col bg-[#181c1f] rounded-2xl px-18 py-20">
      <div className="grow shrink-0">
        <DefaultForm
          schema={signUpSchema as RJSFSchema}
          uiSchema={signUpUiSchema}
          formData={formData}
          onChange={(data) => {
            setFormData(data);
          }}
          onSubmit={(data) => {
            signUp(data.formData);
            router.refresh();
          }}
          disabled={isPending}
        />
        <div className="text-center mt-2">
          <button
            type="button"
            className="cursor-pointer underline hover:no-underline"
            onClick={() => setShowModal("login")}
          >
            Login instead
          </button>
        </div>
        <div className="text-rose-500 text-center mt-2">
          {error ? error.message : ""}
        </div>
      </div>
    </div>
  );
}
