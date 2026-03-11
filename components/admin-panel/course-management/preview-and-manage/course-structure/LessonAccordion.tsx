"use client";

import React, { useState } from "react";

import { ChevronDown } from "lucide-react";

import type { Lesson } from "@/types/courseStructure";
import { cn } from "@/lib/utils";

import { CountBadge } from "./CountBadge";
import { LessonMaterialsTable } from "./LessonMaterialsTable";

interface LessonAccordionProps {
  lesson: Lesson;
  isExpanded?: boolean;
  onToggle?: () => void;
  onActiveChange?: (isActive: boolean) => void;
}

export function LessonAccordion({
  lesson,
  isExpanded = false,
  onToggle,
  onActiveChange,
}: LessonAccordionProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isActive, setIsActive] = useState(lesson.isActive);
  
  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  const handleActiveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newActive = !isActive;

    setIsActive(newActive);
    onActiveChange?.(newActive);
  };

  return (
    <div className="flex flex-col">
      {/* Header Card */}
      <div 
        className={cn(
          "flex flex-col gap-[10px] p-2 cursor-pointer rounded-lg border border-[#E7E5E4] transition-all",
          expanded ? "bg-[#F8FAFC]" : "bg-transparent"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="font-inter text-[14px] font-normal leading-[20px] text-[#0F172B]">
              {lesson.title}
            </span>
            {/* Simple Toggle Switch */}
            <button
              title={isActive ? "Deactivate Lesson" : "Activate Lesson"}
              onClick={handleActiveToggle}
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors",
                isActive ? "bg-[#22C55E]" : "bg-[#E2E8F0]"
              )}
            >
              <span 
                className={cn(
                  "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  isActive ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
            <ChevronDown className={cn("h-5 w-5 text-[#64748B] transition-transform", expanded && "rotate-180")} />
          </div>
        </div>

        {/* Info Badges */}
        {(lesson.materialCount > 0 || lesson.videoCount > 0) && (
          <div className="flex items-center gap-2">
            {lesson.videoCount > 0 && (
              <CountBadge variant="videos" count={lesson.videoCount} />
            )}
            {lesson.materialCount > 0 && (
              <CountBadge variant="materials" count={lesson.materialCount} />
            )}
          </div>
        )}
      </div>

      {/* Expanded Content - Outside of the card border */}
      {expanded && (
        <div className="flex pl-4 sm:pl-[40px] pr-2 pb-3 pt-3">
          {/* Vertical Line */}
          <div className="w-[2px] bg-[#E2E8F0] shrink-0 mr-3 sm:mr-[24.5px]" />
          
          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <LessonMaterialsTable materials={lesson.materials} />
          </div>
        </div>
      )}
    </div>
  );
}

