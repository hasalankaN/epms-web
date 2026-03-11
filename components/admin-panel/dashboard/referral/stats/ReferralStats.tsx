"use client";

import React from "react";

import { ReferralStatCard } from "./ReferralStatCard";

export function ReferralStats() {
  const stats = [
    { title: "Total Referral Staff", value: "20" },
    { title: "Total Team Leaders", value: "5" },
    { title: "Total Referral Enrollments", value: "2340" },
    { title: "Total Referral Orders", value: "45" },
    { title: "Total Referral Sales", value: "LKR 75,000" },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 5 columns */}
      <div className="hidden items-center justify-between py-3 lg:flex">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <ReferralStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < stats.length - 1 && (
              <div className="h-[70px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: Grid layout - 6 columns base (first row: 3x col-span-2, second row: 2x col-span-3) */}
      <div className="hidden grid-cols-6 md:grid lg:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${index < 3 ? "col-span-2" : "col-span-3"}
              ${index === 1 || index === 2 ? "border-l border-[#E2E8F0]" : ""}
              ${index === 4 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 3 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <ReferralStatCard
              title={stat.title}
              value={stat.value}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Grid layout - 2 columns (last item spans full width) */}
      <div className="grid grid-cols-2 md:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${index === 4 ? "col-span-2" : ""}
              ${index % 2 !== 0 && index !== 4 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <ReferralStatCard
              title={stat.title}
              value={stat.value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
