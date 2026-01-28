"use client";

import type { RJSFSchema } from "@rjsf/utils";
import { useState } from "react";
import schema from "@/app/schemas/new-com-schema.json";
import uiSchema from "@/app/schemas/new-com-ui-schema.json";
import { DefaultForm } from "@/components/form/default-form";

export default function NewComCard() {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: "public" | "private";
  }>({
    title: "",
    description: "",
    status: "public",
  });
  const isPending = false;
  const error = null;
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
            alert(JSON.stringify(data.formData));
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
