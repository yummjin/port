import { ReactNode } from "react";

import Header from "../components/Header";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex justify-center bg-[#000000] p-4 md:p-6">
      <div className="bg-background scrollbar-hide relative flex w-full flex-col overflow-y-scroll rounded-2xl md:rounded-[2rem]">
        <Header />
        <main className="scrollbar-hide flex-1 pt-2">{children}</main>
      </div>
    </div>
  );
}
