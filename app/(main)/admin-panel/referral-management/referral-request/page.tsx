"use client";

import React from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { TAB_STYLES } from "@/lib/constants/theme";

import { PendingTab } from "@/components/admin-panel/referral-management/referral-request/PendingTab";
import { CompletedTab } from "@/components/admin-panel/referral-management/referral-request/CompletedTab";

export type ReferralRequestTabType = "pending" | "completed";

const tabs = [
  { value: "pending", label: "Pending", mobileLabel: "Pending" },
  { value: "completed", label: "Completed", mobileLabel: "Completed" },
] as const;

export default function ReferralRequestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as ReferralRequestTabType;

  const activeTab = tabs.some((t) => t.value === currentTab) ? currentTab : "pending";

  const handleTabChange = (tabValue: ReferralRequestTabType) => {
    const params = new URLSearchParams();

    params.set("tab", tabValue);
    params.set("page", "1");
    params.delete("page"); // Reset page when switching tabs
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-3 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs */}
        <div className={TAB_STYLES.container}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto px-4",
                activeTab === tab.value ? TAB_STYLES.active : TAB_STYLES.inactive
              )}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "pending" && <PendingTab />}
      {activeTab === "completed" && <CompletedTab />}
    </div>
  );
}
