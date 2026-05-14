"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRightCircle, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BatchCardProps {
  id: string;
  batchName: string;
  batchNumber: string;
  courseName: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  description: string;
  progress: number;
  className?: string;
}

export function BatchCard({
  id,
  batchName,
  batchNumber,
  thumbnail,
  startDate,
  endDate,
  description,
  progress,
  className,
}: BatchCardProps) {
  return (
    <div
      className={cn(
        "group flex h-[302px] w-[288px] flex-col overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Thumbnail Section (288x144px) */}
      <div className="relative h-[144px] w-full shrink-0 overflow-hidden isolation-isolate">
        <Link href={`/lecturer-panel/batches/${id}`}>
          <Image
            src={thumbnail || "/placeholder.jpg"}
            alt={batchName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {/* Badge (Duration) */}
        <div className="absolute right-[8px] top-[8px] flex h-[24px] w-[92px] items-center justify-center gap-[4px] rounded-[6px] bg-black px-[8px] py-[2px] shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] z-10">
          <Clock className="h-[14px] w-[14px] text-[#FAFAFA]" />
          <span className="font-sans text-[14px] font-medium leading-[20px] text-white whitespace-nowrap">
            Duration
          </span>
        </div>
      </div>

      {/* Frame 1000012594 (8px padding, 10px gap) */}
      <div className="flex flex-1 flex-col p-[8px] gap-[10px] items-start">
        {/* Frame 1000012592 (5px gap) */}
        <div className="flex flex-col gap-[5px] w-full">
          <h4 className="font-sans text-[16px] font-semibold leading-[24px] text-[#0F172B] line-clamp-1">
            {batchName} - {batchNumber}
          </h4>
          <p className="font-sans text-[12px] font-medium leading-[16px] text-[#90A1B9] text-justify">
            From {startDate} to {endDate}
          </p>
          <p className="h-[32px] font-sans text-[12px] font-normal leading-[16px] text-[#45556C] text-justify line-clamp-2">
            {description}
          </p>
        </div>

        {/* Line 6 (Separator) */}
        <div className="h-[0px] w-full border border-[#E2E8F0]" />

        {/* Frame 1707481671 (4px padding, 24px gap between progress and button) */}
        <div className="flex w-full items-start gap-[24px] py-[4px]">
          {/* Progress Section */}
          <div className="flex flex-1 flex-col items-end gap-[8px]">
            {/* Progress Bar (8px height) */}
            <div className="relative h-[8px] w-full rounded-[4px] bg-[#E2E8F0] overflow-hidden">
              <div
                className="h-full rounded-[4px] transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)`,
                }}
              />
            </div>
            <span className="w-full font-sans text-[12px] font-normal leading-[16px] text-[#90A1B9]">
              {progress}% of completed.
            </span>
          </div>

          {/* Action Button (View) */}
          <Link href={`/lecturer-panel/batches/${id}`} className="shrink-0">
            <Button
              type="button"
              className="flex h-[32px] w-[94px] items-center justify-center gap-[8px] rounded-[6px] bg-[#E60076] px-[16px] py-[8px] font-sans text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#C50065]"
            >
              <span className="leading-[20px]">View</span>
              <ArrowRightCircle className="h-[20px] w-[20px]" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
