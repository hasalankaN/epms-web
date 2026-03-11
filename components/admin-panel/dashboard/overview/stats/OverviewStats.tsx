"use client";

import React from "react";

import { StatCard } from "./StatCard";

export function OverviewStats() {
  const stats = [
    { 
      title: "Today's Inquiries", 
      value: "35", 
      trend: { value: 1.2, isPositive: true } 
    },
    { 
      title: "Today's Stu. Enrollments", 
      value: "10", 
      trend: { value: 1.2, isPositive: true } 
    },
    { 
      title: "Today's Orders", 
      value: "02", 
      trend: { value: 0.1, isPositive: false } 
    },
    { 
      title: "Today's Sales", 
      value: "982", 
      trend: { value: 80.2, isPositive: true } 
    },
    { 
      title: "Today's Income", 
      value: "LKR 75,000", 
      trend: { value: 24.2, isPositive: true } 
    },
    { 
      title: "Cash In Hand", 
      value: "LKR 89,935", 
      showDoD: false, 
      valueClassName: "text-[#E60076]",
      className: "py-9" // Special padding for this card
    },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout with dividers */}
      <div className="hidden h-[126px] items-center justify-between lg:flex">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <StatCard
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              showDoD={stat.showDoD}
              valueClassName={stat.valueClassName}
              className={`flex-1 ${stat.className || ""}`}
            />
            {/* Show divider if not the last item */}
            {index < stats.length - 1 && (
              <div className="h-[calc(100%-24px)] w-px self-center bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: 3 columns, 2 rows */}
      <div className="hidden grid-cols-3 md:grid lg:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              ${index % 3 !== 0 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 3 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <div className="my-3">
              <StatCard
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                showDoD={stat.showDoD}
                valueClassName={stat.valueClassName}
                className={stat.className}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: 2 columns, 3 rows */}
      <div className="grid grid-cols-2 md:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <div className="my-3">
              <StatCard
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                showDoD={stat.showDoD}
                valueClassName={stat.valueClassName}
                className={stat.className}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
