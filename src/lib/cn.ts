import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// DESIGN.md typography (`text-display-hero`, `text-body`, ...) and custom
// theme colors (`text-primary`, `text-on-primary`, ...) both start with
// `text-`. Without this, tailwind-merge's default heuristics lump them into
// one group and silently drop whichever comes first when combined via cn()
// (e.g. `cn("text-on-primary", "text-body")` dropped the color, killing
// button contrast; `cn("text-body-small", "text-secondary")` dropped the
// size, making text render at the browser default size).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display-hero",
        "text-section",
        "text-tile-heading",
        "text-body",
        "text-body-small",
        "text-caption",
      ],
      "text-color": [
        "text-primary",
        "text-on-primary",
        "text-canvas",
        "text-surface",
        "text-foreground",
        "text-muted",
        "text-secondary",
        "text-link",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
