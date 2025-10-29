import { BsGithub } from "react-icons/bs";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { SiVelog } from "react-icons/si";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [activeSection, setActiveSection] = useState<string>("");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["skills", "projects"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="border-border bg-background/70 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-50 mx-auto flex h-16 w-full max-w-6xl items-center justify-between border-b backdrop-blur md:h-20">
      <Link href="/" className="cursor-pointer focus:outline-none">
        <Image
          src="/images/logo-light.png"
          className="opacity-80"
          alt="logo"
          width={18}
          height={18}
        />
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollToSection("skills")}
            className={`cursor-pointer text-sm transition-colors ${
              activeSection === "skills"
                ? "text-foreground"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => scrollToSection("projects")}
            className={`cursor-pointer text-sm transition-colors ${
              activeSection === "projects"
                ? "text-foreground"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            Projects
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/yummjin"
            className="text-text-muted hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub size={16} />
          </a>
          <a
            href="https://velog.io/@yummjin"
            className="text-text-muted hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiVelog size={16} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
