import fs from "fs";
import path from "path";

import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

function getSlugs() {
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
}

export function getAllPosts(): PostMeta[] {
  return getSlugs()
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data } = matter(
        fs.readFileSync(path.join(BLOG_DIR, file), "utf8"),
      );
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        tags: (data.tags as string[] | undefined) ?? [],
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostSlugs() {
  return getSlugs().map((file) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string) {
  const { data, content } = matter(
    fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8"),
  );
  return {
    slug,
    meta: data as Omit<PostMeta, "slug">,
    content,
  };
}
