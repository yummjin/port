import fs from "fs";
import path from "path";

import matter from "gray-matter";

const EXPERIENCES_DIR = path.join(process.cwd(), "content/experiences");

export type ExperienceMeta = {
  slug: string;
  title: string;
  period: string;
};

function readExperience(slug: string) {
  return matter(
    fs.readFileSync(path.join(EXPERIENCES_DIR, `${slug}.md`), "utf8"),
  );
}

function getSlugs() {
  return fs
    .readdirSync(EXPERIENCES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllExperiences(): ExperienceMeta[] {
  return getSlugs()
    .map((slug) => {
      const { data } = readExperience(slug);
      return {
        slug,
        title: data.title as string,
        period: data.period as string,
      };
    })
    .sort((a, b) => (a.period < b.period ? 1 : -1));
}

export function getExperienceBySlug(slug: string) {
  const { data, content } = readExperience(slug);
  return {
    title: data.title as string,
    period: data.period as string,
    content,
  };
}
