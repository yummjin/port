import { Geist, Geist_Mono, Gothic_A1 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gothicA1 = Gothic_A1({
  variable: "--font-gothic-a1",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${gothicA1.variable} min-w-screen min-h-screen`}
    >
      <main>
        <div className="font-mono p-10 flex flex-col gap-4 text-main">
          <Image
            src="/profile.jpeg"
            alt="profile"
            width={180}
            height={180}
            className="grayscale mb-2"
          />
          <h1 className="text-3xl font-sans font-bold ">한유진</h1>
          <h4 className="text-2xl">Frontend Developer</h4>
          <p className="font-normal text-xl ">
            Always learning, <br />
            always building.
          </p>
          <div className="flex gap-4 text-black">
            <a
              href="https://github.com/yummjin"
              className="underline hover:text-main"
              target="_blank"
            >
              github
            </a>
            <Link
              href="/about"
              className="underline hover:text-main"
              target="_blank"
            >
              skills
            </Link>{" "}
            <Link
              href="/about"
              className="underline hover:text-main"
              target="_blank"
            >
              projects
            </Link>
            <Link
              href="/about"
              className="underline hover:text-main"
              target="_blank"
            >
              contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
