import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import type { AppProps } from "next/app";

import { Header } from "@/components/Header";
import { ThemeProvider } from "@/lib/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Header />
      <Component {...pageProps} />
      <Analytics />
    </ThemeProvider>
  );
}
