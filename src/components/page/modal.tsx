"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { useOutsideCapture } from "@/hooks/useOutsideCapture";

// TODO: Can try using native modal element
const Modal = React.memo(
  ({
    children,
    setShowModal,
  }: {
    children: React.ReactNode;
    setShowModal: React.Dispatch<
      React.SetStateAction<"none" | "login" | "signup">
    >;
  }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    useOutsideCapture({
      ref: modalRef,
      onClickOutside: () => {
        setShowModal("none");
      },
    });
    return (
      <div
        ref={modalRef}
        className="fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 max-w-135"
      >
        <div className="absolute top-3 right-3">
          <button
            type="button"
            onClick={() => setShowModal("none")}
            className="cursor-pointer p-2 bg-neutral-800 hover:bg-neutral-600 rounded-full transition-colors"
          >
            <Image
              src="/icons/close-icon.svg"
              width={20}
              height={20}
              alt="Close modal"
            />
          </button>
        </div>
        {children}
      </div>
    );
  },
);

export default Modal;
