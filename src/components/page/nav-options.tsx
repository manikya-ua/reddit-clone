"use client";

import Image from "next/image";
import React from "react";
import { Routes } from "@/client/routes";
import { useGetLogout } from "@/hooks/useGetLogout";
import { useGetUser } from "@/hooks/useGetUser";
import { cn } from "@/lib/utils";
import LoginCard from "./login-card";
import ProfilePic from "./profile-pic";
import UserDropdown from "./user-dropdown";
import WithTooltip from "./with-tooltip";

const NavOptions = React.memo(() => {
  const { data: user, isLoading } = useGetUser();
  const { mutate: logout } = useGetLogout({
    onSuccess: () => {
      window.location.reload();
    },
  });
  return (
    <div className="flex items-center justify-end gap-2 min-w-76.75">
      {user ? (
        <>
          <NavButton tooltipText="Advertise on Reddit" disabled={isLoading}>
            <Image src="/icons/ads-icon.svg" width={20} height={20} alt="Ads" />
          </NavButton>
          <NavButton tooltipText="Open chat" disabled={isLoading}>
            <Image
              src="/icons/chat-icon.svg"
              width={20}
              height={20}
              alt="Chat"
            />
          </NavButton>
          <NavButton tooltipText="Create post" disabled={isLoading}>
            <a href={Routes.NEW_POST} className="flex gap-2">
              <Image
                src="/icons/plus-round.svg"
                width={20}
                height={20}
                alt="Create post"
              />
              <span className="text-sm">Create</span>
            </a>
          </NavButton>
          <NavButton tooltipText="Open inbox" disabled={isLoading}>
            <Image
              src="/icons/inbox-icon.svg"
              width={20}
              height={20}
              alt="Inbox"
            />
          </NavButton>
          <UserDropdown user={user} logout={() => logout()}>
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
                alt="Get app"
              />
              <span className="text-sm">Get App</span>
            </div>
          </NavButton>
          <NavButton
            className="bg-orange-600 hover:bg-orange-800"
            tooltipText="Log in to reddit"
          >
            <LoginCard>
              <button type="button" className="text-sm">
                Log In
              </button>
            </LoginCard>
          </NavButton>
          <NavButton tooltipText="Open settings menu">
            <Image
              src="/icons/hamburger-icon.svg"
              width={20}
              height={20}
              alt="Hamburger"
            />
          </NavButton>
        </>
      )}
    </div>
  );
});

const NavButton = React.memo(
  ({
    children,
    tooltipText,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    tooltipText: string;
    disabled?: boolean;
    className?: string;
  }) => {
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
  },
);

export default NavOptions;
