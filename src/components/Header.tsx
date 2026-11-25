import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { RiGithubFill, RiLinkedinBoxFill } from "react-icons/ri";

import { ThemeToggle } from "./ThemeToggle";

import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
];

const EXTERNAL_LINKS = [
  { href: "https://github.com/yummjin", label: "GitHub", Icon: RiGithubFill },
  {
    href: "https://www.linkedin.com/in/yummjin/",
    label: "LinkedIn",
    Icon: RiLinkedinBoxFill,
  },
];

export function Header() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  const isLinkActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="px-content relative mx-auto flex h-14 max-w-[1000px] items-center justify-between">
        <Link
          href="/"
          className="text-body-small bg-foreground text-canvas px-1.5 py-0.5 font-medium dark:bg-white/80"
          onClick={() => setOpen(false)}
        >
          Yujin Han
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
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
        </nav>

        <div className="hidden items-center md:flex">
          <ExternalIconLinks />
          <ThemeToggle />
        </div>

        <div className="flex items-center md:hidden">
          <ExternalIconLinks />
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
        </nav>
      )}
    </header>
  );
}

function ExternalIconLinks() {
  return EXTERNAL_LINKS.map(({ href, label, Icon }) => (
    <a
      key={href}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-foreground flex h-9 w-8 items-center justify-center transition-opacity hover:opacity-70"
    >
      <Icon size={18} />
    </a>
  ));
}
