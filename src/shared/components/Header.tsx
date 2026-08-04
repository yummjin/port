"use client";

import Link from "next/link";

import { PATH } from "../constants";

const NAV_ITEMS = [
  { label: "Home", href: PATH.HOME },
  { label: "About me", href: PATH.USER },
  { label: "Blog", href: PATH.BLOG },
  { label: "Project", href: PATH.PROJECTS },
  { label: "Playground", href: PATH.PLAYGROUND },
] as const;

export default function Header() {
  return (
    <nav className="sticky top-0 z-20 flex justify-center">
      <div className="rounded-b-2xl bg-[#000000] px-4 py-2 md:rounded-b-3xl md:px-8">
        <div className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] transition-colors sm:text-xs md:text-sm"
              style={{ color: "rgba(225, 224, 204, 0.8)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E1E0CC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(225, 224, 204, 0.8)";
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
