import { type ComponentProps } from "react";

import { cn } from "@/lib/cn";

// DESIGN.md hig-reference-card
function CardRoot({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-docs-card border-border bg-surface overflow-hidden border",
        className,
      )}
      {...props}
    />
  );
}

function CardImage({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-canvas relative aspect-[16/10] w-full overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("py-3 px-4", className)} {...props} />;
}

function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-tile-heading text-foreground", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-body-small text-secondary", className)}
      {...props}
    />
  );
}

export const Card = Object.assign(CardRoot, {
  Image: CardImage,
  Content: CardContent,
  Title: CardTitle,
  Description: CardDescription,
});
