"use client";

import React from "react";

import type { ReferralStats as ReferralStatsData } from "@/hooks/api/dashboard/useGetDashboardReferral";
import { ReferralStatCard } from "./ReferralStatCard";

interface Props {
  stats?: ReferralStatsData;
}

function fmtNum(n?: number) {
  return n != null ? n.toLocaleString() : "—";
}

function fmtLkr(n?: number) {
  return n != null ? `LKR ${n.toLocaleString()}` : "—";
}

export function ReferralStats({ stats }: Props) {
  const items = [
    { title: "Total Referral Staff", value: fmtNum(stats?.totalReferralStaff) },
    { title: "Total Team Leaders", value: fmtNum(stats?.totalTeamLeaders) },
    {
      title: "Total Referral Enrollments",
      value: fmtNum(stats?.totalReferralEnrollments),
    },
    {
      title: "Total Referral Orders",
      value: fmtNum(stats?.totalReferralOrders),
    },
    { title: "Total Referral Sales", value: fmtLkr(stats?.totalReferralSales) },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 5 columns */}
      <div className="hidden items-center justify-between py-3 lg:flex">
        {items.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <ReferralStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < items.length - 1 && (
              <div className="h-[70px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: Grid layout - 6 columns base (first row: 3x col-span-2, second row: 2x col-span-3) */}
      <div className="hidden grid-cols-6 md:grid lg:hidden">
        {items.map((stat, index) => (
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
            <ReferralStatCard title={stat.title} value={stat.value} />
          </div>
        ))}
      </div>

      {/* Mobile: Grid layout - 2 columns (last item spans full width) */}
      <div className="grid grid-cols-2 md:hidden">
        {items.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${index === 4 ? "col-span-2" : ""}
              ${index % 2 !== 0 && index !== 4 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <ReferralStatCard title={stat.title} value={stat.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
