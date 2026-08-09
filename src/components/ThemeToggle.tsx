import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";

import { useTheme, type Theme } from "@/lib/theme";

const NEXT: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const ICON = {
  light: FiSun,
  dark: FiMoon,
  system: FiMonitor,
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      aria-label={`테마: ${theme} (클릭해서 변경)`}
      onClick={() => setTheme(NEXT[theme])}
      className="text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-70"
    >
      <Icon size={18} />
    </button>
  );
}
