import fs from "fs";
import path from "path";

import matter from "gray-matter";

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface MarkdownData {
  content: string;
  data: {
    title?: string;
    period?: string;
    role?: string;
    stack?: string[];
    [key: string]: string | string[] | undefined;
  };
  tableOfContents: TableOfContentsItem[];
}

export const extractTableOfContents = (
  content: string,
): TableOfContentsItem[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();

    toc.push({
      id,
      text,
      level,
    });
  }

  return toc;
};

export const getMarkdownContent = (projectId: string): MarkdownData => {
  try {
    const markdownPath = path.join(
      process.cwd(),
      "src",
      "shared",
      "data",
      "markdown",
      `${projectId}.md`,
    );
    const fileContent = fs.readFileSync(markdownPath, "utf8");
    const { data, content } = matter(fileContent);
    const tableOfContents = extractTableOfContents(content);

    return {
      content,
      data: data || {},
      tableOfContents,
    };
  } catch (error) {
    console.error(
      `Error reading markdown file for project ${projectId}:`,
      error,
    );
    return {
      content: "",
      data: {},
      tableOfContents: [],
    };
  }
};
