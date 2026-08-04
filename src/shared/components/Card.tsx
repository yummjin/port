import { ReactNode } from "react";

import { cn } from "@/shared/utils";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card-background border-border relative h-[30vh] max-h-[240px] min-h-[170px] overflow-hidden rounded-2xl border",
        className,
      )}
    >
      {children}
    </div>
  );
}
