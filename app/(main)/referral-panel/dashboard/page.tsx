"use client";

import React from "react";

import { Plus } from "lucide-react";

import { CommissionsCard } from "@/components/referral-panel/dashboard/CommissionsCard";
import { EnrollmentStats } from "@/components/referral-panel/dashboard/EnrollmentStats";
import { MyAgentsCard } from "@/components/referral-panel/dashboard/MyAgentsCard";
import { ReferralIdCard } from "@/components/referral-panel/dashboard/ReferralIdCard";
import { ReferralStats } from "@/components/referral-panel/dashboard/ReferralStats";
import { TopBatchesChart } from "@/components/referral-panel/dashboard/analytics/TopBatchesChart";
import { TopCoursesChart } from "@/components/referral-panel/dashboard/analytics/TopCoursesChart";
import { TopProductsChart } from "@/components/referral-panel/dashboard/analytics/TopProductsChart";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

export default function ReferralDashboardPage() {
  return (
    <div className="pt-3 pl-4 pr-6 pb-6">
      {/* Header Section */}
      <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="group cursor-default text-left font-sans text-2xl font-semibold leading-[38px] text-[#0F172B]">
          Welcome Back!{" "}
          <span className="wave-on-hover wave-once">
            👋
          </span>
        </h1>
        
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <button className={cn(BUTTON_STYLES.outline.md, "text-sm font-semibold leading-5 text-[#0F172B]")}>
            <Plus className="h-5 w-5" />
            <span>Add Member</span>
          </button>
          
          <button className={cn(BUTTON_STYLES.outline.md, "text-sm font-semibold leading-5 text-[#0F172B]")}>
            <Plus className="h-5 w-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <ReferralIdCard />
      <ReferralStats />
      <CommissionsCard />
      
      {/* 2-Column Grid for Enrollment Stats, My Agents and Charts - 2/3 vs 1/3 split */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* Left Column (2/3 width) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <EnrollmentStats />
          <MyAgentsCard />
        </div>
        
        {/* Right Column (Charts Sidebar - 1/3 width) */}
        <div className="flex flex-col gap-6">
          <TopBatchesChart />
          <TopCoursesChart />
          <TopProductsChart />
        </div>
      </div>
    </div>
  );
}




