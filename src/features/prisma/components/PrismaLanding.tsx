import { PrismaAbout } from "./PrismaAbout";
import { PrismaFeatures } from "./PrismaFeatures";
import { PrismaHero } from "./PrismaHero";

export function PrismaLanding() {
  return (
    <div className="bg-[#000000]" style={{ color: "#ffffff" }}>
      <PrismaHero />
      <PrismaAbout />
      <PrismaFeatures />
    </div>
  );
}
