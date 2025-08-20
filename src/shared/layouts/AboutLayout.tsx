import { geistMono, geistSans, gothicA1 } from "@/styles/font";
import AboutHeader from "@/widgets/menu/AboutHeader";
import Head from "next/head";
import type { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>한유진</title>
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} ${gothicA1.variable} min-w-screen min-h-screen p-5 md:p-10 md:pt-5`}
      >
        <AboutHeader />
        <div className="pt-5 md:pt-10 font-sans flex flex-col gap-4">
          {children}
        </div>
      </div>
    </>
  );
}
