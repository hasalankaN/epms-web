"use client";

import React, { useState , useMemo, useEffect } from "react";



import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";
import { useGetApprovals } from "@/hooks/api/approvals/useGetApprovals";
import { useTabNavigation } from "@/hooks/useTabNavigation";


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

  const { activeTab, handleTabChange } = useTabNavigation(
    "batches",
    tabs.map((t) => t.value)
  );

  const [clearKey, setClearKey] = useState(0);

  // Reset filter UI when tab changes
  useEffect(() => {
    setClearKey(prev => prev + 1);
  }, [activeTab]);

  const dateRange = useMemo(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    return {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    };
  }, [searchParams]);

  const { data: batchData } = useGetApprovals({ type: "BATCH", size: 1, dateRange });
  const { data: courseData } = useGetApprovals({ type: "COURSE", size: 1, dateRange });
  const { data: productData } = useGetApprovals({ type: "PRODUCT", size: 1, dateRange });
  const { data: rejectedData } = useGetApprovals({ type: "REJECTED", size: 1, dateRange });

  const counts = {
    batches: batchData?.meta.total ?? 0,
    "online-courses": courseData?.meta.total ?? 0,
    products: productData?.meta.total ?? 0,
    rejected: rejectedData?.meta.total ?? 0,
  };


  const handleDateApply = (startDate: Date | null, endDate: Date | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (startDate) {
      params.set("from", startDate.toISOString());
    } else {
      params.delete("from");
    }

    if (endDate) {
      params.set("to", endDate.toISOString());
    } else {
      params.delete("to");
    }

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);

    if (!startDate && !endDate) {
      setClearKey((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-3 p-4 md:p-6">
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
                  <span 
                    className={cn(
                      "flex items-center justify-center shrink-0",
                      "w-5 h-5 px-1",
                      "rounded-full text-white text-center",
                      "font-['Roboto'] text-[11px] font-medium leading-[16px] tracking-[0.5px]",
                      activeTab === tab.value ? "bg-[#314158]" : "bg-[#90A1B9]" 
                    )}
                  >
                    {counts[tab.value] > 99 ? '99+' : counts[tab.value]}
                  </span>
                </button>
              ))}
            </div>
          </HorizontalScrollContainer>
        </div>
      </div>

      {/* Toolbar Row */}
      <div className="flex items-center gap-3">
        {(dateRange.from || dateRange.to) && (
          <button
            title="clear filters"
            type="button"
            onClick={() => handleDateApply(null, null)}
            className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
        <DateRangeFilter
          key={clearKey}
          onApply={handleDateApply}
          placeholder="By Date"
          align="start"
        />
      </div>

      {/* Content Area */}
      <BankTransfersContainer activeTab={activeTab} dateRange={dateRange} />
    </div>
  );
}
