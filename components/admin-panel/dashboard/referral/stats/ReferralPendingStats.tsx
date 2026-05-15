"use client";

import React from "react";

import type { ReferralPendingStats as PendingStatsData } from "@/hooks/api/dashboard/useGetDashboardReferral";
import { ReferralStatCard } from "./ReferralStatCard";

interface Props {
  pendingStats?: PendingStatsData;
}

function fmtNum(n?: number) {
  return n != null ? String(n).padStart(2, "0") : "—";
}

export function ReferralPendingStats({ pendingStats }: Props) {
  const stats = [
    {
      title: "Pending Approvals",
      value: fmtNum(pendingStats?.pendingApprovals),
    },
    {
      title: "Pending Referral Approval",
      value: fmtNum(pendingStats?.pendingReferralApprovals),
    },
    { title: "Pending Leads", value: fmtNum(pendingStats?.pendingLeads) },
    {
      title: "Pending Follow Ups",
      value: fmtNum(pendingStats?.pendingFollowUps),
    },
    { title: "Pending Chat", value: fmtNum(pendingStats?.pendingChat) },
    { title: "Pending Orders", value: fmtNum(pendingStats?.pendingOrders) },
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
            <ReferralStatCard title={stat.title} value={stat.value} />
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
            <ReferralStatCard title={stat.title} value={stat.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
