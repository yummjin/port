import { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="p-4">
        <NavBar />
        <div className="size-full">
          <main className="relative mx-auto min-h-[calc(100vh-280px)] w-full max-w-[1020px] pb-20">
            {children}
          </main>
        </div>
      </main>
      <Footer />
    </>
  );
}
