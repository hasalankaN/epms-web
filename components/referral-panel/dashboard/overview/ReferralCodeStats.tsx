"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="flex flex-1 flex-col items-start gap-2 rounded-lg border border-[#FDF2F8] bg-[#FDF2F8] p-3 transition-all hover:shadow-sm">
    <span className="font-sans text-[14px] font-normal leading-[20px] text-[#45556C]">
      {label}
    </span>
    <span className="font-sans text-[24px] font-semibold leading-[38px] text-[#1D293D]">
      {value}
    </span>
  </div>
);

export function ReferralCodeStats() {
  const stats = [
    { label: "Total Student Enrollment Using Code", value: "XX" },
    { label: "Total Course Enrollment Using Code", value: "XX" },
    { label: "Total Batch Enrollment Using Code", value: "XX" },
    { label: "Total Product Purchase Using Code", value: "XX" },
  ];

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch lg:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
