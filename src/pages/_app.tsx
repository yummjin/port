import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { AppProps } from "next/app";

import { geistMono, geistSans, wantedSans } from "@/styles/font";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${geistMono.variable} ${geistSans.variable} ${wantedSans.variable}`}
    >
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
