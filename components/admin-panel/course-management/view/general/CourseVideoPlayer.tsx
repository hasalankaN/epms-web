"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { MediaPlayer } from "@/components/common/MediaPlayer";

interface CourseVideoPlayerProps {
  url: string;
  title?: string;
  className?: string;
  showTitle?: boolean;
}

export function CourseVideoPlayer({ 
  url, 
  title = "Course Video", 
  className, 
  showTitle = true 
}: CourseVideoPlayerProps) {
  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      {/* Title */}
      {showTitle && (
        <h2 className="font-inter text-[14px] font-medium leading-[20px] text-[#1D293D]">
          {title}
        </h2>
      )}
      
      {/* Reusable Media Player */}
      <MediaPlayer url={url} className="h-full" />
    </div>
  );
}
