"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { MediaPlayer } from "@/components/common/MediaPlayer";

interface CourseVideoPlayerProps {
  url: string;
  title?: string;
  className?: string; // This height/width will apply to the Video Box itself
  showTitle?: boolean;
}

export function CourseVideoPlayer({ 
  url, 
  title = "Course Video", 
  className, 
  showTitle = true 
}: CourseVideoPlayerProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Title */}
      {showTitle && (
        <h2 className="font-inter text-[14px] font-medium leading-[20px] text-[#1D293D] mb-1">
          {title} {title.includes("Video") && <span className="text-[#DC2626]">*</span>}
        </h2>
      )}
      
      {/* Reusable Media Player Box */}
      <div className={cn("w-full overflow-hidden rounded", className)}>
        <MediaPlayer url={url} className="h-full w-full" />
      </div>
    </div>
  );
}
