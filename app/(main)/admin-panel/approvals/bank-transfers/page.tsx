"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { TAB_STYLES } from "@/lib/constants/theme";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

import { BankTransfersContainer } from "@/components/admin-panel/approvals/bank-transfers/BankTransfersContainer";

export type BankTransferTabType =
  | "batches"
  | "online-courses"
  | "products"
  | "rejected";

const tabs = [
  { value: "batches", label: "Batches", mobileLabel: "Batches" },
  { value: "online-courses", label: "Online Courses", mobileLabel: "Courses" },
  { value: "products", label: "Products", mobileLabel: "Products" },
  { value: "rejected", label: "Rejected", mobileLabel: "Rejected" },
] as const;

export default function BankTransfersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as BankTransferTabType;
  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "batches";

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const handleTabChange = (tabValue: BankTransferTabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDateApply = (startDate: Date | null, endDate: Date | null) => {
    setDateRange({
      from: startDate ?? undefined,
      to: endDate ?? undefined,
    });
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

        {/* Date Range Filter */}
        <DateRangeFilter
          onApply={handleDateApply}
          placeholder="Select Date Range"
          align="end"
        />
      </div>

      {/* Content Area */}
      <BankTransfersContainer activeTab={activeTab} dateRange={dateRange} />
    </div>
  );
}
