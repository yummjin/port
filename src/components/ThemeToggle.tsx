import { RiComputerFill, RiMoonFill, RiSunFill } from "react-icons/ri";

import { useTheme, type Theme } from "@/lib/theme";

const NEXT: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const ICON = {
  light: RiSunFill,
  dark: RiMoonFill,
  system: RiComputerFill,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      aria-label={`테마: ${theme} (클릭해서 변경)`}
      onClick={() => setTheme(NEXT[theme])}
      className="text-foreground flex h-9 w-8 items-center justify-center transition-opacity hover:opacity-70"
    >
      <Icon size={18} />
    </button>
  );
}
