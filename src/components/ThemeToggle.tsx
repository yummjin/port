import { motion, AnimatePresence } from "motion/react";
import { useMemo } from "react";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const rays = useMemo(() => [0, 45, 90, 135, 180, 225, 270, 315], []);

  return (
    <button
      onClick={toggleTheme}
      className="text-text-muted relative inline-flex size-5 cursor-pointer items-center justify-center transition-colors focus:outline-none"
      aria-label="테마 토글"
      title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      <div className="relative size-5">
        <AnimatePresence initial={false} mode="popLayout">
          {isDark ? (
            <motion.svg
              key="moon"
              viewBox="0 0 24 24"
              className="absolute inset-0 h-5 w-5"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.path
                d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z"
                fill="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              viewBox="0 0 24 24"
              className="absolute inset-0 h-5 w-5"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.circle
                cx="12"
                cy="12"
                r="5"
                fill="currentColor"
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.6 }}
                transition={{ duration: 0.25 }}
              />
              {rays.map((deg) => (
                <motion.line
                  key={deg}
                  x1="12"
                  y1="1"
                  x2="12"
                  y2="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ transformOrigin: "12px 12px", rotate: `${deg}deg` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: 0.04 * (deg / 45) }}
                />
              ))}
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      <span className="sr-only">
        {isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      </span>
    </button>
  );
}
