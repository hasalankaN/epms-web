"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { AllInquiries } from "@/components/admin-panel/inquiry/AllInquiries";
import { PendingInquiries } from "@/components/admin-panel/inquiry/PendingInquiries";
import { AddInquiryPanel } from "@/components/admin-panel/inquiry/modals/AddInquiryPanel";

export type InquiryTabType = "pending" | "all";

const tabs = [
  { value: "all", label: "All Inquiries", mobileLabel: "All" },
  { value: "pending", label: "Pending Inquiries", mobileLabel: "Pending" },
] as const;

export default function InquiryManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as InquiryTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "all";

  // ===== MODAL STATE =====
  const [isAddInquiryOpen, setIsAddInquiryOpen] = useState(false);

  const handleTabChange = (tabValue: InquiryTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
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
                  : TAB_STYLES.inactive
              )}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>

        {/* Add Inquiry Button */}
        <button
          onClick={() => setIsAddInquiryOpen(true)}
          className={cn(
            BUTTON_STYLES.primary.md,
            "text-sm font-semibold text-white px-3 md:px-4"
          )}
        >
          <Plus className="h-5 w-5 md:hidden" />
          <span className="hidden md:inline">Add Inquiry</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "pending" && <PendingInquiries />}
      {activeTab === "all" && <AllInquiries />}

      {/* Add Inquiry Panel */}
      <AddInquiryPanel isOpen={isAddInquiryOpen} onClose={() => setIsAddInquiryOpen(false)} />
    </div>
  );
}
