import { PROJECTS } from "@/shared/data";
import { getMarkdownContent } from "@/shared/utils/markdown";
import { cn } from "@/shared/utils";
import { motion } from "motion/react";

interface TimelineItem {
  setSelectedProject: (project: number) => void;
  selectedProject: number;
}

const timeline: { year: string; event: string }[] = [];

PROJECTS.map((project) => {
  const md = getMarkdownContent(project.id);
  const period = md.data.period as string;
  if (period) {
    timeline.push({
      year: period.split(".")[0] + "." + period.split(".")[1],
      event: project.title.split(":")[0],
    });
  } else {
    timeline.push({
      year: "",
      event: project.title.split(":")[0],
    });
  }
});

export default function Timeline({
  setSelectedProject,
  selectedProject,
}: TimelineItem) {
  return (
    <div className="relative -z-10 mt-4 mb-2.5 flex w-full flex-wrap gap-4 md:mt-0">
      {timeline.map((item, index) => (
        <motion.button
          key={index}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-0.5 font-mono transition-colors outline-none",
            selectedProject === index
              ? "border-main text-main"
              : "text-text-muted hover:text-foreground",
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3, duration: 0.8 }}
          onClick={() => setSelectedProject(index)}
        >
          <div className="text-sm underline">{item.event}</div>
          {/* <div className="text-xs font-light">{item.year}</div> */}
        </motion.button>
      ))}
    </div>
  );
}
