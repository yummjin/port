import Link from "next/link";

import { EXTERNAL_LINKS, NAV_LINKS } from "@/lib/nav";

const FOOTER_LINKS = [{ href: "/", label: "Home" }, ...NAV_LINKS];

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="px-content mx-auto max-w-[1000px] py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <span className="text-body-small bg-foreground text-canvas w-fit px-1.5 py-0.5 font-medium dark:bg-white/80">
            Yujin Han
          </span>

          <nav className="flex flex-col gap-3 md:flex-row md:gap-6">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-body-small text-muted hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
            {EXTERNAL_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-small text-muted hover:text-foreground transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <p className="text-caption text-muted mt-10">
          © {new Date().getFullYear()} Yujin Han
        </p>
      </div>
    </footer>
  );
}
