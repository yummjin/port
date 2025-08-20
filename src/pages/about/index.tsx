import { AboutLayout } from "@/shared/layouts";
import { DESCRIPTION } from "@/shared/data";
import React from "react";

export default function index() {
  return (
    <AboutLayout>
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{DESCRIPTION.name}</h1>
          <p className="font-mono hover:text-main cursor-pointer">
            {DESCRIPTION.email}
          </p>
        </div>
        <div>
          {DESCRIPTION.description.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}
