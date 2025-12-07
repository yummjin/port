import { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

interface TitleProps {
  children: ReactNode;
  subTitle?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const sizeClasses = {
  sm: "text-xl font-bold",
  md: "text-2xl font-bold",
  lg: "text-3xl font-bold",
  xl: "text-4xl font-bold tracking-tight md:text-5xl",
  "2xl": "text-4xl leading-11 font-semibold md:text-6xl md:leading-17",
  "3xl": "text-5xl leading-tight font-bold tracking-tight",
};

export default function Title({
  children,
  subTitle,
  className,
  size = "lg",
  as: Component = "h2",
}: TitleProps) {
  const spacingClass =
    size === "sm" || size === "md" || size === "lg" ? "space-y-2" : "space-y-4";
  return (
    <div className={cn(spacingClass, className)}>
      <Component
        className={cn("text-foreground text-start", sizeClasses[size])}
      >
        {children}
      </Component>
      {subTitle && (
        <p className="text-text-muted text-lg leading-relaxed">{subTitle}</p>
      )}
    </div>
  );
}
