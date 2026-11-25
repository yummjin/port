import Link from "next/link";

import { cn } from "@/lib/cn";

export function BackLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-caption text-muted hover:text-foreground w-fit transition-colors",
        className,
      )}
    >
      ‹ {label}
    </Link>
  );
}
