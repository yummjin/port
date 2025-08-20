import { PROJECTS } from "@/shared/data";
import { cn } from "@/shared/utils";
import { motion } from "motion/react";

interface TimelineItem {
  setSelectedProject: (project: number) => void;
  selectedProject: number;
}

const timeline: { year: string; event: string }[] = [];

PROJECTS.map((project) => {
  timeline.push({
    year: project.period.split(".")[0] + "." + project.period.split(".")[1],
    event: project.title.split(":")[0],
  });
});

export default function Timeline({
  setSelectedProject,
  selectedProject,
}: TimelineItem) {
  return (
    <div className="relative flex-wrap -z-10 md:mt-0 mt-4 w-full gap-4 flex mb-2.5">
      {timeline.map((item, index) => (
        <motion.button
          key={index}
          className={cn(
            "flex flex-col gap-0.5 font-mono items-center cursor-pointer outline-none",
            selectedProject === index && "border-main text-main"
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
