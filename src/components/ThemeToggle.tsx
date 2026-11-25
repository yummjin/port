import { RiComputerFill, RiMoonFill, RiSunFill } from "react-icons/ri";

import { useTheme, type Theme } from "@/lib/theme";

const NEXT: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABEL: Record<Theme, string> = {
  light: "라이트",
  dark: "다크",
  system: "시스템 설정",
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
      aria-label={`현재 테마 ${LABEL[theme]}, ${LABEL[NEXT[theme]]}(으)로 전환`}
      title={`${LABEL[NEXT[theme]]}(으)로 전환`}
      onClick={() => setTheme(NEXT[theme])}
      className="text-foreground flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-70"
    >
      <Icon size={18} />
    </button>
  );
}
