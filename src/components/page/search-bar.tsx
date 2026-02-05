import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Routes } from "@/client/routes";

const SearchBar = React.memo(() => {
  return (
    <div className="flex-2 h-10 min-w-fit rounded-full flex p-1 relative bg-inherit before:absolute before:-inset-[0.1rem] before:bg-linear-to-r before:from-red-600 before:to-yellow-600 before:-z-10 before:rounded-full hover:bg-neutral-800 transition-colors">
      <label className="flex shrink-0 items-center" htmlFor="search-bar-input">
        <Image src="/logo-sm.svg" width={28} height={28} alt="Reddit logo" />
      </label>
      <input
        id="search-bar-input"
        className="placeholder:text-center grow placeholder:text-neutral-400 focus-visible:outline-0 px-2 focus-visible:placeholder:text-left"
        placeholder="Find anything"
      />
      <div
        role="presentation"
        className="w-px h-4/5 my-auto bg-neutral-600 text-red-600"
      ></div>
      <Link
        href={Routes.NONE}
        className="flex items-center gap-2 shrink-0 px-2 ml-1 mr-0.5 rounded-full hover:bg-neutral-700 transition-colors"
      >
        <Image src="/icons/ask-icon.svg" width={16} height={16} alt="Ask" />
        <span className="text-xs">Ask</span>
      </Link>
    </div>
  );
});

export default SearchBar;
