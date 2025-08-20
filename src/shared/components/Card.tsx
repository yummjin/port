import React from "react";
import { cn } from "../utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  onClick = () => {},
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-gray-200 p-4 flex flex-col gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-between text-lg">{children}</div>
  );
};

const CardContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

Card.Header = CardHeader;
Card.Content = CardContent;
