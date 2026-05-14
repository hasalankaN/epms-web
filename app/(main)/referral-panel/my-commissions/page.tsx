"use client";

import React from "react";



import { cn } from "@/lib/utils";
import { TAB_STYLES } from "@/lib/constants/theme";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";
import { useTabNavigation } from "@/hooks/useTabNavigation";

import { MyCommissionsContainer } from "@/components/referral-panel/my-commissions/MyCommissionsContainer";

export type CommissionTabType =
  | "batches"
  | "courses"
  | "products"
  | "members";

const tabs = [
  { value: "batches", label: "Direct Commissions - Batches", mobileLabel: "Batches" },
  { value: "courses", label: "Direct Commissions - Courses", mobileLabel: "Courses" },
  { value: "products", label: "Direct Commissions - Products", mobileLabel: "Products" },
  { value: "members", label: "Commissions from Members", mobileLabel: "Members" },
] as const;

export default function MyCommissionsPage() {
  const { activeTab, handleTabChange } = useTabNavigation(
    "batches",
    tabs.map((t) => t.value)
  );

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <HorizontalScrollContainer>
            <div className={TAB_STYLES.container}>
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    TAB_STYLES.triggerBase,
                    "w-auto px-4 flex items-center justify-center gap-2",
                    activeTab === tab.value
                      ? TAB_STYLES.active
                      : TAB_STYLES.inactive,
                  )}
                >
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.mobileLabel}</span>
                </button>
              ))}
            </div>
          </HorizontalScrollContainer>
        </div>
      </div>

      {/* Content Area */}
      <MyCommissionsContainer activeTab={activeTab as CommissionTabType} />
    </div>
  );
}
