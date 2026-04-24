"use client";

import React from "react";

interface BreakdownItem {
  label: string;
  value: string | number;
}

interface BreakdownCardProps {
  label: string;
  value: string | number;
}

function BreakdownCard({ label, value }: BreakdownCardProps) {
  return (
    <div className="flex items-center justify-between self-stretch rounded-[8px] border border-[#E2E8F0] bg-[#F1F5F9] px-[8px] py-[12px]">
      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#1D293D]">
        {label}
      </span>
      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#1D293D]">
        {value}
      </span>
    </div>
  );
}

interface BreakdownColumnProps {
  title: string;
  items: BreakdownItem[];
}

function BreakdownColumn({ title, items }: BreakdownColumnProps) {
  return (
    <div className="flex flex-1 flex-col gap-[16px]">
      <h3 className="font-inter text-[16px] font-semibold leading-[24px] text-[#1D293D]">
        {title}
      </h3>
      <div className="flex flex-col gap-[8px]">
        {items.map((item) => (
          <BreakdownCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

interface AnalyticsBreakdownProps {
  title: string;
  column1Title: string;
  column1Items: BreakdownItem[];
  column2Title: string;
  column2Items: BreakdownItem[];
}

export function AnalyticsBreakdown({
  title,
  column1Title,
  column1Items,
  column2Title,
  column2Items,
}: AnalyticsBreakdownProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
        {title}
      </h2>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-[24px]">
        <BreakdownColumn title={column1Title} items={column1Items} />
        <BreakdownColumn title={column2Title} items={column2Items} />
      </div>
    </div>
  );
}
