"use client";

import React, { useState } from "react";

import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

import type { Week } from "@/types/courseStructure";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { CountBadge } from "./CountBadge";
import { LessonAccordion } from "./LessonAccordion";

interface WeekAccordionProps {
  week: Week;
  isExpanded?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onAddLesson?: () => void;
}

export function WeekAccordion({
  week,
  isExpanded = false,
  onToggle,
  onDelete,
  onAddLesson,
}: WeekAccordionProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  
  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  const lessonCount = week.lessons.length;

  return (
    <div 
      className={cn(
        "flex flex-col rounded-lg transition-all shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        expanded 
          ? "border-2 border-[#0F172B] bg-[#0F172B]" 
          : "border border-[#E2E8F0] bg-white"
      )}
    >
      {/* Header */}
      <div 
        className={cn(
          "flex flex-col items-start gap-[10px] p-2 cursor-pointer rounded-t-lg", // Parent is vertical stack of (TitleRow) + (Badge)
          expanded ? "text-white" : "text-[#1D293D]"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between w-full">
          {/* Title - Aligned with actions */}
          <span className={cn(
            "font-inter text-[14px] font-medium leading-[20px]",
            expanded ? "text-white" : "text-[#0F172B]"
          )}>
            {week.title}
          </span>

          <div className="flex items-center gap-2">
            {/* Delete Button */}
            <button 
              title="Delete Week"
              className={cn(
                "h-7 w-7 flex items-center justify-center rounded transition-colors",
                expanded 
                  ? "text-red-400 hover:bg-white/10" 
                  : "text-red-500 hover:bg-red-50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {/* Chevron */}
            {expanded ? (
              <ChevronUp className={cn("h-5 w-5", expanded ? "text-white" : "text-[#64748B]")} />
            ) : (
              <ChevronDown className={cn("h-5 w-5", expanded ? "text-white" : "text-[#64748B]")} />
            )}
          </div>
        </div>

        {/* Badge - Below title */}
        <CountBadge variant="lessons" count={lessonCount} isDark={expanded} />
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="flex flex-col gap-3 p-3 sm:p-4 bg-white rounded-b-lg">
          {/* Lessons */}
          {week.lessons.map((lesson) => (
            <LessonAccordion key={lesson.id} lesson={lesson} />
          ))}

          {/* Add New Lessons Button */}
          <Button
            className={cn(
              BUTTON_STYLES.outline.md, 
              "w-full sm:w-auto sm:self-end text-[#0F172B] font-inter text-[14px] font-semibold leading-[20px] hover:bg-[#F8FAFC]"
            )}
            onClick={onAddLesson}
          >
            <Plus className="h-4 w-4" />
            Add New Lesson
          </Button>
        </div>
      )}
    </div>
  );
}
