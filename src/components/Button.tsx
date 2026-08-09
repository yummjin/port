import Link from "next/link";
import { type ComponentProps } from "react";

import { cn } from "@/lib/cn";

const VARIANTS = {
  // DESIGN.md marketing-primary
  primary:
    "h-11 bg-primary text-on-primary px-pill-inline py-pill-block text-body",
  // DESIGN.md marketing-outline
  outline:
    "h-11 border border-link text-link px-pill-inline py-pill-block text-body",
  // DESIGN.md marketing-compact
  compact:
    "h-9 bg-primary text-on-primary px-control-inline py-compact text-body-small",
} as const;

type Variant = keyof typeof VARIANTS;

const buttonClass = (variant: Variant, className?: string) =>
  cn(
    "inline-flex items-center justify-center rounded-marketing-pill font-medium transition-opacity hover:opacity-80 disabled:opacity-40",
    VARIANTS[variant],
    className,
  );

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClass(variant, className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
