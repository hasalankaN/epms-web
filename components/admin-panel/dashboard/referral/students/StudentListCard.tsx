"use client";

import React from "react";

import { StudentListItem } from "./StudentListItem";

interface Student {
  id: string;
  name: string;
  location: string;
  avatarUrl?: string;
  students: number;
  products: number;
  price?: string;
}

interface StudentListCardProps {
  title: string;
  chipLabel?: string;
  students: Student[];
  showButton?: boolean;
  buttonLabel?: string;
  onButtonClick?: (studentId: string) => void;
}

export function StudentListCard({
  title,
  chipLabel = "Last 7 Days",
  students,
  showButton = false,
  buttonLabel = "View Profile",
  onButtonClick,
}: StudentListCardProps) {
  return (
    <div className="flex flex-1 flex-col items-start gap-3 rounded-lg border border-[#E2E8F0] p-4 shadow-sm">
      {/* Header: Title + Chip */}
      <div className="flex w-full items-center justify-between">
        <span className="font-sans text-[16px] font-semibold leading-6 text-[#0F172B]">
          {title}
        </span>
        <div className="flex items-center justify-center gap-1 rounded-[40px] bg-[#F1F5F9] px-3 py-1 shadow-sm">
          <span className="text-center font-sans text-[14px] font-medium leading-5 text-black">
            {chipLabel}
          </span>
        </div>
      </div>

      {/* Student List */}
      <div className="flex w-full flex-col gap-4">
        {students.map((student, index) => (
          <StudentListItem
            key={student.id}
            avatarUrl={student.avatarUrl}
            name={student.name}
            location={student.location}
            students={student.students}
            products={student.products}
            price={student.price}
            showButton={showButton}
            buttonLabel={buttonLabel}
            onButtonClick={() => onButtonClick?.(student.id)}
            isLast={index === students.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
