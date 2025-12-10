import { ReactNode } from "react";

import { Sidebar } from "@/shared/components";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <main className="scrollbar-hide h-screen flex-1 overflow-y-auto px-6">
        {children}
      </main>
    </div>
  );
}
