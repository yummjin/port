import { Geist, Geist_Mono, Gothic_A1 } from "next/font/google";
import localFont from "next/font/local";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const gothicA1 = Gothic_A1({
  variable: "--font-gothic-a1",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const wantedSans = localFont({
  src: [
    {
      path: "../../public/font/WantedSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/WantedSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/WantedSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/WantedSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/WantedSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/font/WantedSans-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/font/WantedSans-ExtraBlack.ttf",
      weight: "950",
      style: "normal",
    },
  ],
  variable: "--font-wanted-sans",
});
