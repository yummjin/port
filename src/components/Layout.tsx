import { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="scrollbar-hide flex h-screen w-screen flex-col overflow-y-auto">
      <div className="mx-auto mb-20 h-full w-full max-w-[1020px] flex-1 p-4 pt-6">
        <NavBar />
        {children}
      </div>
      <Footer />
    </main>
  );
}
