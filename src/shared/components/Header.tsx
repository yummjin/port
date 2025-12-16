"use client";

import Link from "next/link";

import { MenuButton } from "../assets";
import { PATH } from "../constants";

export default function Header() {
  return (
    <header className="bg-background/50 h-header fixed top-6 z-50 flex w-[calc(100%-48px)] max-w-[1200px] flex-shrink-0 items-center justify-between rounded-full border border-white/10 px-6 py-4 backdrop-blur-xl lg:border-none">
      <Link href={PATH.HOME} className="cursor-pointer">
        <span className="font-bold">yummjin</span>
      </Link>
      <div className="hidden w-full flex-1 items-center justify-center gap-1 text-sm lg:flex">
        <Link
          className="rounded-full px-4 py-2 transition-colors hover:border-white hover:bg-white/10"
          href={PATH.BLOG}
        >
          Blog
        </Link>
        <Link
          className="rounded-full px-4 py-2 transition-colors hover:border-white hover:bg-white/10"
          href={PATH.PROJECTS}
        >
          Experiences
        </Link>
      </div>
      <button className="cursor-pointer focus:outline-none lg:hidden">
        <MenuButton />
      </button>
      <Link
        href={PATH.USER}
        className="text-background hidden cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium focus:outline-none lg:block"
      >
        Contact
      </Link>
    </header>
  );
}
