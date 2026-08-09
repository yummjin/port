import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { ThemeToggle } from "./ThemeToggle";

import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  const isLinkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-border bg-surface/70 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="px-content mx-auto flex h-14 max-w-[1000px] items-center justify-between">
        <Link
          href="/"
          className="text-tile-heading text-sm"
          onClick={() => setOpen(false)}
        >
          Yujin Han
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-marketing-pill px-control-inline py-compact text-body-small transition-opacity hover:opacity-70",
                isLinkActive(href) ? "text-primary" : "text-secondary",
              )}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 md:hidden">
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
        <nav className="border-border px-content flex flex-col gap-1 border-t py-2 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-control px-control-inline py-compact text-body",
                isLinkActive(href) ? "text-primary" : "text-secondary",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
