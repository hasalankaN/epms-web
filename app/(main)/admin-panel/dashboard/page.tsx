"use client";

import React from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { FileText } from "lucide-react";

import { OverviewSection } from "@/components/admin-panel/dashboard/OverviewSection";
import { ReferralSection } from "@/components/admin-panel/dashboard/ReferralSection";
import { AnalyticsSection } from "@/components/admin-panel/dashboard/AnalyticsSection";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

export type DashboardTabType = "overview" | "referral" | "analytics";

const tabs = [
  { value: "overview", label: "Overview", icon: "overview-icon" },
  { value: "referral", label: "Referral", icon: "referral-icon" },
  { value: "analytics", label: "Analytics", icon: "analytics-icon" },
] as const;

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as DashboardTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "overview";

  const handleTabChange = (tabValue: DashboardTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3 pt-3 pl-4 pr-6 pb-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="group cursor-default text-left font-sans text-2xl font-semibold leading-[38px] text-[#0F172B]">
          Welcome Back!{" "}
          <span className="wave-on-hover wave-once">
            👋
          </span>
        </h1>
        <button className={BUTTON_STYLES.primary.responsive}>
          <FileText className="h-5 w-5 sm:hidden" />
          <span className="hidden sm:inline">Generate Report</span>
        </button>
      </div>

      {/* Tabs Section */}
      <div className="overflow-x-auto pb-2 sm:pb-0">
        <div className={TAB_STYLES.container}>
          {tabs.map((tab) => {
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  TAB_STYLES.triggerBase,
                  activeTab === tab.value
                    ? TAB_STYLES.active
                    : TAB_STYLES.inactive
                )}
              >
                <span className={cn(TAB_STYLES.icon, tab.icon)} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "referral" && <ReferralSection />}
        {activeTab === "analytics" && <AnalyticsSection />}
      </div>
    </div>
  );
}
