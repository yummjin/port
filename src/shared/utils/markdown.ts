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
