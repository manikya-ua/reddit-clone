"use client";

import { LoaderIcon } from "lucide-react";

export default function Indeterminate({
  isLoading = true,
}: {
  isLoading?: boolean;
}) {
  return isLoading ? (
    <div className="fixed z-50 inset-0 backdrop-blur-sm bg-black/20 flex flex-col items-center justify-center">
      <LoaderIcon className="size-10 animate-spin" />
    </div>
  ) : null;
}
