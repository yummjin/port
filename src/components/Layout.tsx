import { ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <main className="scrollbar-hide h-screen flex-1 overflow-y-auto px-6">
        {children}
      </main>
    </div>
  );
}
