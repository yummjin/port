import { geistMono, geistSans, gothicA1 } from "@/styles/font";
import AboutHeader from "@/widgets/menu/AboutHeader";
import type { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${gothicA1.variable} min-w-screen min-h-screen p-10`}
    >
      <AboutHeader />
      <div className="pt-10">{children}</div>
    </div>
  );
}
