"use client";

import Image from "next/image";
import { useGetUser } from "../hooks/useGetUser";
import WithTooltip from "./with-tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LoginCard from "./login-card";
import Modal from "./modal";
import SignupCard from "./sign-up-card";
import { useGetLogout } from "../hooks/useGetLogout";
import { useRouter } from "next/navigation";

export default function NavOptions() {
  const { data: user, isLoading } = useGetUser();
  const [showModal, setShowModal] = useState<"none" | "login" | "signup">(
    "none",
  );
  const router = useRouter();
  const { mutate: logout } = useGetLogout({
    onSuccess: () => router.refresh(),
  });
  return (
    <div className="flex items-center gap-2">
      {showModal === "login" ? (
        <Modal>
          <LoginCard setShowModal={setShowModal} />
        </Modal>
      ) : showModal === "signup" ? (
        <Modal>
          <SignupCard />
        </Modal>
      ) : null}
      {user ? (
        <>
          <NavButton tooltipText="Advertise on Reddit" disabled={isLoading}>
            <Image src="/icons/ads-icon.svg" width={20} height={20} alt="" />
          </NavButton>
          <NavButton tooltipText="Open chat" disabled={isLoading}>
            <Image src="/icons/chat-icon.svg" width={20} height={20} alt="" />
          </NavButton>
          <NavButton tooltipText="Create post" disabled={isLoading}>
            <div className="flex gap-2">
              <Image src="/icons/chat-icon.svg" width={20} height={20} alt="" />
              <span className="text-sm">Create</span>
            </div>
          </NavButton>
          <NavButton tooltipText="Open inbox" disabled={isLoading}>
            <Image src="/icons/inbox-icon.svg" width={20} height={20} alt="" />
          </NavButton>
          <NavButton tooltipText="Open profile menu" disabled={isLoading}>
            <button
              type="button"
              onClick={() => logout()}
              className="size-6 flex items-center justify-center rounded-full"
            >
              {user.username?.[0]}
            </button>
          </NavButton>
        </>
      ) : (
        <>
          <NavButton tooltipText="Get the reddit app">
            <div className="flex gap-2">
              <Image
                src="/icons/get-app-icon.svg"
                width={20}
                height={20}
                alt=""
              />
              <span className="text-sm">Get App</span>
            </div>
          </NavButton>
          <NavButton
            className="bg-orange-600 hover:bg-orange-800"
            tooltipText="Log in to reddit"
          >
            <button
              type="button"
              onClick={() => setShowModal("login")}
              className="text-sm"
            >
              Log In
            </button>
          </NavButton>
          <NavButton tooltipText="Open settings menu">
            <Image
              src="/icons/hamburger-icon.svg"
              width={20}
              height={20}
              alt=""
            />
          </NavButton>
        </>
      )}
    </div>
  );
}

function NavButton({
  children,
  tooltipText,
  disabled,
  className,
}: {
  children: React.ReactNode;
  tooltipText: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <WithTooltip tooltipText={tooltipText}>
      <div
        className={cn(
          "px-3 py-2.5 hover:bg-neutral-700 rounded-full transition-colors cursor-pointer relative",
          disabled &&
            "before:block before:absolute before:inset-0 before:rounded-full before:bg-black/30 z-10 hover:cursor-auto hover:bg-inherit",
          className,
        )}
      >
        {children}
      </div>
    </WithTooltip>
  );
}
