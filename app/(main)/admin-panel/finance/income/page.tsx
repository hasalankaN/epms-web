"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { IncomeFromStudentTab } from "@/components/admin-panel/finance/income/IncomeFromStudent/IncomeFromStudentTab";
import { OtherIncomeTab } from "@/components/admin-panel/finance/income/OtherIncome/OtherIncomeTab";
import { AddIncomePanel } from "@/components/admin-panel/finance/income/OtherIncome/modals/AddIncomePanel";

export type IncomeTabType = "income-student" | "other-income";

const tabs = [
  { value: "income-student", label: "Income from Student", mobileLabel: "Students" },
  { value: "other-income", label: "Other Income", mobileLabel: "Other" },
] as const;

export default function IncomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);

  const currentTab = searchParams.get("tab") as IncomeTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "income-student";

  const handleTabChange = (tabValue: IncomeTabType) => {
    const params = new URLSearchParams();
    
    params.set("tab", tabValue);
    params.set("page", "1");
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

        {/* Add Income Button */}
        {activeTab === "other-income" && (
          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add Income</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "income-student" && <IncomeFromStudentTab />}
      {activeTab === "other-income" && <OtherIncomeTab />}

      <AddIncomePanel
        isOpen={isAddIncomeOpen}
        onClose={() => setIsAddIncomeOpen(false)}
      />
    </div>
  );
}
