import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card-background h-[30vh] max-h-[240px] min-h-[170px] overflow-hidden rounded-[10px]">
      {children}
    </div>
  );
}
