import { geistMono, wantedSans } from "@/styles/font";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <div className={`${geistMono.variable} ${wantedSans.variable}`}>
        <Component {...pageProps} />
        <Analytics />
      </div>
    </ThemeProvider>
  );
}
