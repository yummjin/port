import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/shared/utils";

interface SidebarButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  target?: string;
}

export default function SidebarButton({
  href,
  icon,
  label,
  isActive,
  target = "_self",
}: SidebarButtonProps) {
  return (
    <Link
      target={target}
      href={href}
      className={cn(
        "hover:bg-card-background box-border flex h-10 w-full items-center gap-6 rounded-[10px] px-3 text-sm active:bg-white/20",
        isActive && "bg-card-background text-foreground",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}

function SidebarButtonMobile({
  href,
  icon,
  label,
  isActive,
}: SidebarButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-card-background ml-1 box-border flex h-[74px] w-full flex-col items-center justify-center gap-1 rounded-[10px] pr-3 pl-3 text-sm active:bg-white/20",
        isActive && "text-foreground",
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

SidebarButton.Mobile = SidebarButtonMobile;

SidebarButtonMobile.displayName = "SidebarButtonMobile";
SidebarButton.displayName = "SidebarButton";
