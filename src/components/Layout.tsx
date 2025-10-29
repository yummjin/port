import { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <main className="p-6">
        <NavBar />
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
