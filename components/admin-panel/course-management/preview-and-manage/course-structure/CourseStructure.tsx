"use client";

import React, { useState } from "react";

import { Plus } from "lucide-react";

import type { Week } from "@/types/courseStructure";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { Button } from "@/components/ui/button";

import { WeekAccordion } from "./WeekAccordion";

// Mock data for demonstration
const mockWeeks: Week[] = [
  {
    id: "week-1",
    title: "Week 1",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Lessons 01: Lesson Name",
        isActive: true,
        videoCount: 0,
        materialCount: 2,
        materials: [
          { id: "m1", uploadedDate: "20/01/2026", title: "Lecture note.ppts", type: "File", format: "PPTX" },
          { id: "m2", uploadedDate: "20/01/2026", title: "Tute Question.doc", type: "File", format: "DOC" },
        ],
      },
    ],
  },
  {
    id: "week-2",
    title: "Week 2",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Lessons 01: Lesson Name",
        isActive: true,
        videoCount: 0,
        materialCount: 2,
        materials: [],
      },
      {
        id: "lesson-2-2",
        title: "Lessons 02: Lesson Name",
        isActive: true,
        videoCount: 1,
        materialCount: 3,
        materials: [
          { id: "m3", uploadedDate: "20/01/2026", title: "Lesson 2 Explanation.mp4", type: "Link", format: "Youtube" },
          { id: "m4", uploadedDate: "20/01/2026", title: "Lecture note.ppts", type: "File", format: "PPTX" },
          { id: "m5", uploadedDate: "20/01/2026", title: "Tute Question.doc", type: "File", format: "DOC" },
          { id: "m6", uploadedDate: "20/01/2026", title: "Data.csv", type: "File", format: "CSV" },
          { id: "m7", uploadedDate: "20/01/2026", title: "Tute answer.pdf", type: "File", format: "PDF" },
        ],
      },
      {
        id: "lesson-2-3",
        title: "Lessons 03: Lesson Name",
        isActive: false,
        videoCount: 0,
        materialCount: 1,
        materials: [],
      },
    ],
  },
  {
    id: "week-3",
    title: "Week 3",
    lessons: [
      {
        id: "lesson-3-1",
        title: "Lessons 01: Lesson Name",
        isActive: true,
        videoCount: 0,
        materialCount: 1,
        materials: [],
      },
    ],
  },
  {
    id: "week-4",
    title: "Week 4",
    lessons: [
      {
        id: "lesson-4-1",
        title: "Lessons 01: Lesson Name",
        isActive: true,
        videoCount: 0,
        materialCount: 1,
        materials: [],
      },
    ],
  },
];

interface CourseStructureProps {
  weeks?: Week[];
  onAddWeek?: () => void;
}

export function CourseStructure({ 
  weeks = mockWeeks, 
  onAddWeek 
}: CourseStructureProps) {
  // Use local state to manage updates for the demo
  const [weeksData, setWeeksData] = useState<Week[]>(weeks);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  const handleAddLesson = (weekId: string) => {
    setWeeksData(currentWeeks => 
      currentWeeks.map(week => {
        if (week.id === weekId) {
          return {
            ...week,
            lessons: [
              ...week.lessons,
              {
                id: `lesson-${Date.now()}`,
                title: "New",
                isActive: true,
                videoCount: 0,
                materialCount: 0,
                materials: [],
              }
            ]
          };
        }

        return week;
      })
    );
  };

  const handleUpdateLesson = (weekId: string, lessonId: string, updates: Partial<Week['lessons'][0]>) => {
    setWeeksData(currentWeeks => 
      currentWeeks.map(week => {
        if (week.id === weekId) {
          return {
            ...week,
            lessons: week.lessons.map(lesson => 
              lesson.id === lessonId ? { ...lesson, ...updates } : lesson
            )
          };
        }

        return week;
      })
    );
  };

  const handleDeleteWeek = (weekId: string) => {
    setWeeksData(prev => prev.filter(w => w.id !== weekId));
    if (expandedWeek === weekId) setExpandedWeek(null);
  };

  const handleDeleteLesson = (weekId: string, lessonId: string) => {
    setWeeksData(currentWeeks => 
      currentWeeks.map(week => {
        if (week.id === weekId) {
          return {
            ...week,
            lessons: week.lessons.filter(lesson => lesson.id !== lessonId)
          };
        }
        
        return week;
      })
    );
  };

  const handleUpdateWeek = (weekId: string, updates: Partial<Week>) => {
    setWeeksData(currentWeeks =>
      currentWeeks.map(week => 
        week.id === weekId ? { ...week, ...updates } : week
      )
    );
  };

  const handleAddWeek = () => {
    const newWeekId = `week-${Date.now()}`;

    const newWeek: Week = {
      id: newWeekId,
      title: "New",
      lessons: [],
    };

    setWeeksData((prev) => [...prev, newWeek]);
    setExpandedWeek(newWeekId);
    onAddWeek?.();
  };

  return (
    <div className="flex flex-col p-3 sm:p-4 md:p-6 gap-4 rounded-lg border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-inter text-[16px] font-semibold leading-[24px] text-[#0F172B]">
          Course Structure
        </h2>
        <Button
          className={cn(
            BUTTON_STYLES.secondary.md,
            "w-full sm:w-auto font-inter text-[14px] font-semibold leading-[20px]"
          )}
          onClick={handleAddWeek}
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      {/* Weeks List */}
      <div className="flex flex-col gap-3">
        {weeksData.map((week) => (
          <WeekAccordion
            key={week.id}
            week={week}
            isExpanded={expandedWeek === week.id}
            onToggle={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
            onDelete={() => handleDeleteWeek(week.id)}
            onUpdateWeek={(updates) => handleUpdateWeek(week.id, updates)}
            onAddLesson={() => handleAddLesson(week.id)}
            onUpdateLesson={(lessonId, updates) => handleUpdateLesson(week.id, lessonId, updates)}
            onDeleteLesson={(lessonId) => handleDeleteLesson(week.id, lessonId)}
          />
        ))}
      </div>
    </div>
  );
}
