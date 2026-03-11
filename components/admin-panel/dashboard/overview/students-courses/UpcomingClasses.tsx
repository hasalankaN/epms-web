"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface ClassSession {
  id: string;
  name: string;
  timeLabel: string;
}

interface UpcomingClassesProps {
  classes?: ClassSession[];
  className?: string;
}

const defaultClasses: ClassSession[] = [
  { id: "1", name: "Class Session Name", timeLabel: "In 59 minutes" },
  { id: "2", name: "Class Session Name", timeLabel: "In 2026.01.22" },
  { id: "3", name: "Class Session Name", timeLabel: "In 2026.01.22" },
  { id: "4", name: "Class Session Name", timeLabel: "In 2026.01.22" },
];

function ClassSessionCard({ session }: { session: ClassSession }) {
  return (
    <div className="flex w-full items-start gap-3">
      {/* Icon */}
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[#FDF2F8]">
        <i className="session-icon h-4 w-4 stroke-[#1D293D]" />
      </div>
      
      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0">
        <span className="line-clamp-1 overflow-hidden text-ellipsis font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
          {session.name}
        </span>
        <span className="font-sans text-[12px] font-normal leading-[16px] text-[#90A1B9]">
          {session.timeLabel}
        </span>
      </div>
    </div>
  );
}

export function UpcomingClasses({
  classes = defaultClasses,
  className,
}: UpcomingClassesProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-[8px] border border-[#E2E8F0] bg-transparent p-4 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className
      )}
    >
      {/* Title */}
      <h3 className="font-sans text-[16px] font-semibold leading-[24px] text-[#1D293D]">
        Upcoming Classes
      </h3>

      {/* Class Sessions */}
      <div className="flex flex-col gap-2">
        {classes.map((session) => (
          <ClassSessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
