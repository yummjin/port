import { cn } from "@/shared/utils";

const ChevronRight = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center", className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      focusable="false"
      fill="currentColor"
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        display: "inherit",
        width: "100%",
        height: "100%",
      }}
    >
      <path d="M8.793 5.293a1 1 0 000 1.414L14.086 12l-5.293 5.293a1 1 0 101.414 1.414L16.914 12l-6.707-6.707a1 1 0 00-1.414 0Z"></path>
    </svg>
  </div>
);

export default ChevronRight;
