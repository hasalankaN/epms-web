"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { CircularProgress } from "./CircularProgress";

interface ProgressCardProps {
  title: string;
  details: {
    label: string;
    value: string;
  }[];
  progress: number;
  progressColor?: string;
  className?: string;
}

export function ProgressCard({
  title,
  details,
  progress,
  progressColor,
  className,
}: ProgressCardProps) {
  return (
    <div className={cn(
      "flex w-full h-[164px] items-center gap-4 rounded-[8px] border border-[#E2E8F0] bg-white p-3 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
      className
    )}>
      {/* Chart Section */}
      <div className="flex h-[140px] w-[140px] shrink-0 items-center justify-center">
        <CircularProgress progress={progress} color={progressColor} />
      </div>

      {/* Dotted Separator */}
      <div className="h-[136px] border-l border-dashed border-[#E2E8F0]" />

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-center gap-4 pl-0">
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-[20px] font-semibold leading-8 text-[#0F172B] line-clamp-1">
            {title}
          </h3>

          <div className="flex items-start justify-between gap-6 overflow-hidden">
            {details.map((detail, index) => (
              <div key={index} className="flex flex-col gap-2">
                <span className="font-sans text-[12px] font-normal leading-4 text-[#90A1B9] whitespace-nowrap">
                  {detail.label}
                </span>
                <span className="font-sans text-[14px] font-medium leading-5 text-[#314158] whitespace-nowrap">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-[#F1F5F9] text-[#1D293D] shadow-sm hover:bg-[#E2E8F0]">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-[#F1F5F9] text-[#1D293D] shadow-sm hover:bg-[#E2E8F0]">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
