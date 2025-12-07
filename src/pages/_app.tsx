import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { AppProps } from "next/app";

import { geistMono, wantedSans } from "@/styles/font";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geistMono.variable} ${wantedSans.variable}`}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
