"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRightCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  progress: number;
  className?: string;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  duration,
  progress,
  className,
}: CourseCardProps) {
  return (
    <div className={cn(
      "group flex h-[305px] w-[288px] flex-col overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-shadow hover:shadow-md",
      className
    )}>
      {/* Thumbnail Section */}
      <div className="relative h-[144px] w-full shrink-0 overflow-hidden isolation-isolate">
        <Link href={`/lecturer-panel/courses/${id}`}>
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {/* Duration Badge */}
        <div className="absolute right-2 top-2 flex h-[24px] w-[92px] items-center justify-center gap-[4px] rounded-[6px] bg-black px-2 shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
         <i className="clock-counter-clockwise h-[14px] w-[14px] text-[#FAFAFA]" />
          <span className="font-sans text-[14px] font-medium leading-[20px] text-white">
            {duration}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col p-[8px] gap-[10px]">
        {/* Title and Description */}
        <div className="flex flex-col gap-[5px]">
          <h4 className="font-sans text-[16px] font-semibold leading-[24px] text-[#0F172B] line-clamp-2 max-w-[224px]">
            {title}
          </h4>
          <p className="font-sans text-[12px] font-normal leading-[16px] text-[#45556C] text-justify line-clamp-2">
            {description}
          </p>
        </div>

        {/* Separator Line */}
        <div className="h-px w-full bg-[#E2E8F0]" />

        {/* Progress and Action Area */}
        <div className="flex items-start gap-[24px] py-[4px]">
          {/* Progress Section */}
          <div className="flex flex-1 flex-col items-end gap-[8px]">
            <div className="relative h-[8px] w-full rounded-[4px] bg-[#E2E8F0]">
              <div 
                className="h-full rounded-[4px]" 
                style={{ 
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)`
                }}
              />
            </div>
            <span className="w-full font-sans text-[12px] font-normal leading-[16px] text-[#90A1B9]">
              {progress}% of completed.
            </span>
          </div>

          {/* Action Button */}
          <Link href={`/lecturer-panel/courses/${id}`}>
            <Button 
                type="button"
                id={`view_btn_${id}`}
              className="flex h-[32px] w-[94px] items-center justify-center gap-[8px] rounded-[6px] bg-[#E60076] px-[16px] py-[8px] font-sans text-sm font-semibold text-white shadow-[0_1px_3px_rgba(16,24,40,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#C50065]"
            >
              <span>View</span>
              <ArrowRightCircle className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
