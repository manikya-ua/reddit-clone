"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="mr-2 mt-1 rounded-full p-1 hover:bg-neutral-600 cursor-pointer"
      onClick={() => router.back()}
    >
      <Image
        src="/icons/back-icon.svg"
        width={20}
        height={20}
        alt="back button"
      />
    </button>
  );
}
