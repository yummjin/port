import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { ThemeToggle } from "./ThemeToggle";

import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="px-content mx-auto flex h-14 max-w-[1000px] items-center justify-between">
        <Link
          href="/"
          className="text-body-small bg-foreground text-canvas px-1.5 py-0.5 font-medium dark:bg-white/80"
          onClick={() => setOpen(false)}
        >
          Yujin Han
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-body-small transition-colors",
                isLinkActive(href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/yummjin"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-body-small text-foreground border px-3 py-1 transition-opacity hover:opacity-70"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground flex h-9 w-9 items-center justify-center"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-border px-content flex flex-col border-t md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "text-body-small border-border border-b py-3",
                isLinkActive(href) ? "text-foreground" : "text-muted",
              )}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://github.com/yummjin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-body-small py-3"
          >
            GitHub
          </a>
        </nav>
      )}
    </header>
  );
}
