"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { BCPExpenseTab } from "@/components/admin-panel/finance/expenses/BatchCourseProduct/BCPExpenseTab";
import { GeneralExpenseTab } from "@/components/admin-panel/finance/expenses/General/GeneralExpenseTab";
import { AddExpensePanel } from "@/components/admin-panel/finance/expenses/modals/AddExpensePanel";

export type ExpenseTabType = "bcp-expense" | "general-expense";

const tabs = [
  { value: "bcp-expense", label: "Batch/Course/Product Wise", mobileLabel: "BCP" },
  { value: "general-expense", label: "General", mobileLabel: "General" },
] as const;

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  const currentTab = searchParams.get("tab") as ExpenseTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "bcp-expense";

  const handleTabChange = (tabValue: ExpenseTabType) => {
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

        {/* Add Expense Button */}
        <button
          onClick={() => setIsAddPanelOpen(true)}
          className={cn(
            BUTTON_STYLES.primary.md,
            "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
          )}
        >
          <Plus className="h-5 w-5 md:hidden" />
          <span className="hidden md:inline">Add Expense</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "bcp-expense" && <BCPExpenseTab />}
      {activeTab === "general-expense" && <GeneralExpenseTab />}

      <AddExpensePanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
        activeTab={activeTab}
      />
    </div>
  );
}
