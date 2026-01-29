"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetLogout } from "@/app/hooks/useGetLogout";
import { useGetUser } from "@/app/hooks/useGetUser";
import { cn } from "@/lib/utils";
import LoginCard from "./login-card";
import Modal from "./modal";
import ProfilePic from "./ProfilePic";
import SignupCard from "./sign-up-card";
import UserDropdown from "./user-dropdown";
import WithTooltip from "./with-tooltip";

export default function NavOptions() {
  const { data: user, isLoading } = useGetUser();
  const [showModal, setShowModal] = useState<"none" | "login" | "signup">(
    "none",
  );
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: logout } = useGetLogout({
    onSuccess: () => {},
  });
  return (
    <div className="flex items-center justify-end gap-2 min-w-76.75">
      {showModal === "login" ? (
        <Modal>
          <LoginCard setShowModal={setShowModal} />
        </Modal>
      ) : showModal === "signup" ? (
        <Modal>
          <SignupCard setShowModal={setShowModal} />
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
            <a href="/submit" className="flex gap-2">
              <Image src="/icons/chat-icon.svg" width={20} height={20} alt="" />
              <span className="text-sm">Create</span>
            </a>
          </NavButton>
          <NavButton tooltipText="Open inbox" disabled={isLoading}>
            <Image src="/icons/inbox-icon.svg" width={20} height={20} alt="" />
          </NavButton>
          <UserDropdown
            user={user}
            logout={() => {
              logout();
              queryClient.invalidateQueries();
              router.refresh();
            }}
          >
            <WithTooltip tooltipText="Open profile menu">
              <ProfilePic firstChar={user.username?.[0] ?? ""} />
            </WithTooltip>
          </UserDropdown>
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
