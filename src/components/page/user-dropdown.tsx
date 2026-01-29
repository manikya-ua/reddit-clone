"use client";
import Image from "next/image";
import type { users } from "@/database/drizzle/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ProfilePic from "./ProfilePic";

export default function UserDropdown({
  user,
  children,
  logout,
  asChild,
}: {
  user: typeof users.$inferSelect;
  children: React.ReactNode;
  asChild?: boolean;
  logout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus-visible:outline-0"
        asChild={asChild}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark pl-4 pr-6">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <a
              href={`/user/${user.username}`}
              className="flex items-center gap-2"
            >
              <ProfilePic firstChar={user.username?.[0] ?? ""} />
              <div className="flex flex-col gap-0.5">
                <span>View Profile</span>
                <span className="text-xs text-muted-foreground">
                  u/{user.username}
                </span>
              </div>
            </a>
          </DropdownMenuLabel>
          <DropdownMenuItem className="flex items-center gap-3 px-2 py-4">
            <Image src="/icons/cloth.svg" width={16} height={16} alt="" />
            <span>Edit Avatar</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 px-2 py-4">
            <Image src="/icons/notebook.svg" width={16} height={16} alt="" />
            <span>Drafts</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 px-2 py-2">
            <Image src="/icons/cup.svg" width={16} height={16} alt="" />
            <span className="flex flex-col gap-0.5">
              <span>Achievements</span>
              <span className="text-xs text-muted-foreground">11 unlocked</span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-3 px-2 py-2">
            <Image src="/icons/money.svg" width={16} height={16} alt="" />
            <span className="flex flex-col gap-0.5">
              <span>Earn</span>
              <span className="text-xs text-muted-foreground">
                Earn cash on Reddit
              </span>
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => logout()}
            className="flex items-center gap-3 px-2 py-4 cursor-pointer"
          >
            <Image src="/icons/logout.svg" width={16} height={16} alt="" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
