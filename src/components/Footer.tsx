import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="px-content mx-auto max-w-[1000px] py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <span className="text-body-small bg-foreground text-canvas dark:bg-white/80 w-fit px-1.5 py-0.5 font-medium">
            Yujin Han
          </span>

          <nav className="flex flex-col gap-3 md:flex-row md:gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-body-small text-muted transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <a
              href="https://github.com/yummjin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-small text-muted transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>

        <p className="text-caption text-muted mt-10">
          © {new Date().getFullYear()} Yujin Han
        </p>
      </div>
    </footer>
  );
}
