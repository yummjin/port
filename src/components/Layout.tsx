import { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen w-screen flex-col overflow-y-auto">
      <div className="w-full flex-1 p-4 pt-6 pb-20">
        <NavBar />
        {children}
      </div>

      <Footer />
    </main>
  );
}
