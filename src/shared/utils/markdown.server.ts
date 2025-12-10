import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { extractTableOfContents, MarkdownData } from "./markdown";

export const getMarkdownContent = (projectId: string): MarkdownData => {
  try {
    const markdownPath = path.join(
      process.cwd(),
      "src",
      "shared",
      "assets",
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
