import React, { useEffect, useState } from "react";
import { TableOfContentsItem } from "@/shared/utils/markdown";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
      },
    );

    // 모든 헤딩 요소를 관찰
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 헤더 높이만큼 오프셋
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="border-border bg-card-background/50 rounded-lg border p-4">
        <h3 className="text-foreground mb-4 text-sm font-semibold">목차</h3>
        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={`hover:text-foreground block w-full text-left text-sm transition-colors ${
                activeId === item.id
                  ? "text-foreground font-medium"
                  : "text-text-muted"
              }`}
              style={{
                paddingLeft: `${(item.level - 1) * 12}px`,
              }}
            >
              <span className="truncate">{item.text}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TableOfContents;
