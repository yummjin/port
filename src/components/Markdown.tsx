import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={String(src)}
              alt={alt ?? ""}
              loading="lazy"
              className="block max-h-[400px] w-auto max-w-full object-contain object-left"
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
}
