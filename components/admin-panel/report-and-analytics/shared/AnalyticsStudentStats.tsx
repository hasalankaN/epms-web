"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface StudentStatItem {
  key: string;
  label: string;
  value: string | number;
}

interface StudentStatCardProps {
  label: string;
  value: string | number;
  isFeatured?: boolean;
  className?: string;
}

function StudentStatCard({ label, value, isFeatured, className }: StudentStatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-start gap-2 rounded-[8px] border border-[#E2E8F0] p-[12px]",
        isFeatured
          ? "bg-[linear-gradient(315deg,#FFCFEA_0.35%,#F8FAFC_99.65%)] w-full"
          : "bg-white",
        className
      )}
    >
      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
        {label}
      </span>
      <span className="font-inter text-[24px] font-semibold leading-[38px] text-[#1D293D]">
        {value}
      </span>
    </div>
  );
}

interface AnalyticsStudentStatsProps {
  totalEnrollment?: string | number;
  active?: string | number;
  nonResponsive?: string | number;
  dropped?: string | number;
  completed?: string | number;
  male?: string | number;
  female?: string | number;
}

export function AnalyticsStudentStats({
  totalEnrollment = "XXX",
  active = "XX",
  nonResponsive = "XX",
  dropped = "XX",
  completed = "XX",
  male = "XX",
  female = "XX",
}: AnalyticsStudentStatsProps) {
  const gridStats: StudentStatItem[] = [
    { key: "active", label: "Active", value: active },
    { key: "nonResponsive", label: "Non Responsive", value: nonResponsive },
    { key: "dropped", label: "Dropped", value: dropped },
    { key: "completed", label: "Completed", value: completed },
    { key: "male", label: "Male", value: male },
    { key: "female", label: "Female", value: female },
  ];

  return (
    <div className="flex flex-col items-start gap-2">
      <StudentStatCard
        label="Total Enrollment"
        value={totalEnrollment}
        isFeatured
      />
      <div className="grid w-full grid-cols-2 gap-2">
        {gridStats.map((stat) => (
          <StudentStatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    </div>
  );
}
