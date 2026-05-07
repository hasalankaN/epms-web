"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { TAB_STYLES } from "@/lib/constants/theme";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";
import { useTabNavigation } from "@/hooks/useTabNavigation";

import { CoursesAndBatchesContainer } from "@/components/referral-panel/courses-and-batches/CoursesAndBatchesContainer";

export type CoursesAndBatchesTabType = "batches" | "courses";

const tabs = [
  { value: "batches", label: "Batches", mobileLabel: "Batches" },
  { value: "courses", label: "Courses", mobileLabel: "Courses" },
] as const;

export default function CoursesAndBatchesPage() {
  const { activeTab, handleTabChange } = useTabNavigation(
    "batches",
    tabs.map((t) => t.value)
  );

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Tabs Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        <div className="flex-1 overflow-hidden">
          <HorizontalScrollContainer>
            <div className={TAB_STYLES.container}>
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    TAB_STYLES.triggerBase,
                    "w-auto px-10 flex items-center justify-center gap-2", // Added px-10 to match wider tabs in image
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
      <CoursesAndBatchesContainer activeTab={activeTab as CoursesAndBatchesTabType} />
    </div>
  );
}
