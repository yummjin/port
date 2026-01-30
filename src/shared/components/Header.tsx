"use client";

import Link from "next/link";
import { useState } from "react";

import { MenuButton } from "../assets";
import { PATH } from "../constants";

const MOBILE_LINKS = [
  { href: PATH.BLOG, label: "Blog" },
  { href: PATH.PROJECTS, label: "Experiences" },
  { href: PATH.USER, label: "Contact" },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="fixed top-6 left-1/2 z-50 flex w-[calc(100%-48px)] max-w-[1200px] -translate-x-1/2 flex-col">
      <header className="bg-background/50 h-header flex flex-shrink-0 items-center justify-between rounded-full border border-white/10 px-6 py-4 backdrop-blur-xl lg:border-none">
        <Link href={PATH.HOME} className="cursor-pointer" onClick={closeMenu}>
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
        <button
          type="button"
          className="cursor-pointer focus:outline-none lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <MenuButton />
        </button>
        <Link
          href={PATH.USER}
          className="text-background hidden cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium focus:outline-none lg:block"
        >
          Contact
        </Link>
      </header>

      {/* 모바일 드롭다운 메뉴 */}
      <div
        id="mobile-menu"
        role="menu"
        className={`bg-background/95 mt-2 overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl transition-[max-height,opacity] duration-200 ease-out lg:hidden ${
          isMenuOpen
            ? "max-h-64 opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3">
          {MOBILE_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              role="menuitem"
              className="text-foreground rounded-xl px-4 py-3 text-sm transition-colors hover:bg-white/10"
              onClick={closeMenu}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
