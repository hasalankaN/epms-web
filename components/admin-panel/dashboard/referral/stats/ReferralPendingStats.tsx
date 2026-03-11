"use client";

import React from "react";

import { ReferralStatCard } from "./ReferralStatCard";

export function ReferralPendingStats() {
  const stats = [
    { title: "Pending Approvals", value: "20" },
    { title: "Pending Referral Approval", value: "05" },
    { title: "Pending Leads", value: "04" },
    { title: "Pending Follow Ups", value: "45" },
    { title: "Pending Chat", value: "03" },
    { title: "Pending Orders", value: "15" },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 6 columns */}
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

      {/* Tablet: Grid layout - 3 columns (2 rows) */}
      <div className="hidden grid-cols-3 md:grid lg:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${index % 3 !== 0 ? "border-l border-[#E2E8F0]" : ""}
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

      {/* Mobile: Grid layout - 2 columns (3 rows) */}
      <div className="grid grid-cols-2 md:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
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
