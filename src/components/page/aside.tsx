"use client";
import Image from "next/image";
import { useState } from "react";
import { useGetSubs } from "@/app/hooks/useGetSubs";
import { useGetUser } from "@/app/hooks/useGetUser";
import type { subs } from "@/database/drizzle/schema";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Aside({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useGetUser();
  const subsResult = useGetSubs(user?.subs);
  const userSubs = subsResult.map((res) => res.data);
  const isLoadingSubs = subsResult.some((res) => res.isLoading);

  return (
    <>
      <button
        type="button"
        className={cn(
          "z-10 fixed block cursor-pointer top-16 left-69.5 hover:border-neutral-200 rounded-full border border-neutral-500 bg-neutral-950 p-2 transition-transform",
          !expanded && "-translate-x-64",
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <Image
          src="/icons/hamburger-lines.svg"
          width={16}
          height={16}
          alt="Collapse sidebar"
        />
      </button>

      <aside
        className={cn(
          "w-74 mt-14 fixed h-[96vh] border-r border-neutral-700 pl-4 pr-6 overflow-y-auto transition-transform pb-6",
          !expanded && "-translate-x-64",
        )}
      >
        <div className={cn("flex flex-col pt-4", !expanded && "hidden")}>
          <Section
            items={[
              {
                text: "Home",
                icon: "/icons/home-icon.svg",
                href: "/",
                width: 20,
                height: 20,
              },
              {
                text: "Popular",
                icon: "/icons/pop-icon.svg",
                href: "/r/popular",
                width: 20,
                height: 20,
              },
              {
                text: "Explore",
                icon: "/icons/explore-icon.svg",
                href: "/explore",
                width: 20,
                height: 20,
              },
              {
                text: "All",
                icon: "/icons/all-icon.svg",
                href: "/r/all",
                width: 20,
                height: 20,
              },
              {
                text: "Start a community",
                icon: "/icons/plus-icon.svg",
                href: "/new-com",
                width: 20,
                height: 20,
              },
            ]}
          />
          <Separator />
          <Section
            collapseTitle="Games on Reddit"
            items={[
              {
                text: "Riddonkulous",
                icon: "/riddonkulous.webp",
                href: "#",
                width: 24,
                height: 24,
              },
              {
                text: "Hexaword",
                icon: "/hexaword.webp",
                href: "#",
                width: 24,
                height: 24,
              },
              {
                text: "Chess Quiz Plus",
                icon: "/crown.webp",
                href: "#",
                width: 24,
                height: 24,
              },
              {
                text: "Discover More Games",
                icon: "/icons/games-icon.svg",
                href: "#",
                width: 24,
                height: 24,
              },
            ]}
          />
          <Separator />
          <Section
            collapseTitle="Communities"
            items={[
              {
                icon: "/icons/cogwheel-icon.svg",
                href: "/communities",
                text: "Manage Communities",
                width: 20,
                height: 20,
              },
              ...(isLoadingSubs
                ? [
                    {
                      icon: "/icons/outline-logo.svg",
                      href: `$`,
                      text: "Loading...",
                      key: 1,
                      width: 20,
                      height: 20,
                    },
                    {
                      icon: "/icons/outline-logo.svg",
                      href: `$`,
                      text: "Loading...",
                      key: 2,
                      width: 20,
                      height: 20,
                    },
                    {
                      icon: "/icons/outline-logo.svg",
                      href: `$`,
                      text: "Loading...",
                      key: 3,
                      width: 20,
                      height: 20,
                    },
                  ]
                : userSubs
                    .filter(
                      (sub): sub is { sub: typeof subs.$inferSelect } =>
                        sub !== undefined,
                    )
                    .map(({ sub }) => ({
                      icon: "/icons/outline-logo.svg",
                      href: `/r/${sub.title}`,
                      text: sub.title ?? "",
                      width: 20,
                      height: 20,
                    }))),
            ]}
          />
          <Separator />
          <Section
            collapseTitle="Resources"
            items={[
              {
                text: "About Reddit",
                icon: "/icons/outline-logo.svg",
                href: "/about",
                width: 20,
                height: 20,
              },
              {
                text: "Advertise",
                icon: "/icons/advertise.svg",
                href: "#",
                width: 20,
                height: 20,
              },
              {
                text: "Developer Platform",
                icon: "/icons/dev-icon.svg",
                href: "/explore",
                width: 20,
                height: 20,
              },
              {
                text: "Reddit Pro",
                icon: "/icons/pro-icon.svg",
                href: "#",
                width: 20,
                height: 20,
              },
              {
                text: "Help",
                icon: "/icons/help-icon.svg",
                href: "#",
                width: 20,
                height: 20,
              },
              {
                text: "Blog",
                icon: "/icons/blog-icon.svg",
                href: "#",
                width: 20,
                height: 20,
              },
              {
                text: "Careers",
                icon: "/icons/careers.svg",
                href: "#",
                width: 20,
                height: 20,
              },
              {
                text: "Press",
                icon: "/icons/press-icon.svg",
                href: "#",
                width: 20,
                height: 20,
              },
            ]}
          />
        </div>
      </aside>
    </>
  );
}

function Section({
  items,
  collapseTitle,
}: {
  items: {
    href: string;
    icon: string;
    text: string;
    width: number;
    height: number;
    key?: number;
  }[];
  collapseTitle?: string;
}) {
  const pathName = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div>
      {collapseTitle && (
        <button
          type="button"
          className="flex justify-between items-center py-3 px-2 cursor-pointer w-full rounded-lg hover:bg-neutral-900"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="uppercase text-muted-foreground text-sm">
            {collapseTitle}
          </span>
          <Image src="/icons/dropdown-icon.svg" alt="" width={20} height={20} />
        </button>
      )}
      <div
        className={cn(
          "transition-opacity",
          isCollapsed && "opacity-0 h-0 overflow-hidden",
        )}
      >
        {items?.map((item) => (
          <a
            key={item.key ?? item.text}
            href={item.href}
            className={cn(
              "flex gap-2 items-center py-3 px-4 rounded-lg hover:bg-neutral-900",
              item.href === pathName && "bg-neutral-800",
            )}
          >
            <Image
              src={item.icon}
              alt=""
              width={item.width}
              height={item.height}
              className="shrink-0"
            />
            <span className="text-neutral-300 text-sm line-clamp-1 text-ellipsis">
              {item.text}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Separator() {
  return <div className="w-full bg-neutral-800 h-px my-4"></div>;
}
