import { ReactNode } from "react";

import Header from "../components/Header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background scrollbar-hide absolute relative inset-0 mx-auto flex max-w-[1200px] flex-col overflow-y-scroll">
      <Header />
      <main className="scrollbar-hide flex-1 pt-[calc(64px+24px)]">
        {children}
      </main>
    </div>
  );
}
