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
  classes =[], // Default to empty array
  className,
}: UpcomingClassesProps) {
  
  const hasClasses = classes && classes.length > 0;

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

      {/* Class Sessions or Empty State */}
      <div className="flex flex-col gap-2">
        {hasClasses ? (
          classes.map((session) => (
            <ClassSessionCard key={session.id} session={session} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="font-sans text-[13px] font-medium text-[#475569]">
              No upcoming classes
            </p>
            <p className="font-sans text-[11px] text-[#90A1B9]">
              Stay tuned for your next scheduled session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}