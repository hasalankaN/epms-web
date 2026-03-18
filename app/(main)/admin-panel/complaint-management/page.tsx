"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { AllComplaints } from "@/components/admin-panel/complaint-management/AllComplaints";
import { PendingAssignment } from "@/components/admin-panel/complaint-management/PendingAssignment";
import { AddComplaintPanel } from "@/components/admin-panel/complaint-management/modals/AddComplaintPanel";
import { useGetPendingComplaints } from "@/hooks/api/complaints/useGetPendingComplaints";

export type ComplaintTabType = "all-complaint" | "pending-assignment";

const tabs = [
  { value: "all-complaint", label: "All Complaint", mobileLabel: "All" },
  { value: "pending-assignment", label: "Pending Assignment", mobileLabel: "Pending" },
] as const;

export default function ComplaintManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  const currentTab = searchParams.get("tab") as ComplaintTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "all-complaint";

  // Fetch pending count purely for the tab badge
  const { data: pendingData } = useGetPendingComplaints({ page: 1, size: 1 });
  const pendingCount = pendingData?.meta?.total || 0;

  const handleTabChange = (tabValue: ComplaintTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
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
                "w-auto px-4 flex items-center justify-center gap-2",
                activeTab === tab.value ? TAB_STYLES.active : TAB_STYLES.inactive
              )}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
              {tab.value === "pending-assignment" && (
                <span 
                  className={cn(
                    "flex items-center justify-center shrink-0",
                    "w-5 h-5 px-1",
                    "rounded-full text-white text-center",
                    "font-['Roboto'] text-[11px] font-medium leading-[16px] tracking-[0.5px]",
                    activeTab === tab.value ? "bg-[#314158]" : "bg-[#90A1B9]" 
                  )}
                >
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Add Complaint Button - Only show for All Complaint tab */}
        {activeTab === "all-complaint" && (
          <button
            onClick={() => setIsAddPanelOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Complaint</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "all-complaint" && <AllComplaints />}
      {activeTab === "pending-assignment" && <PendingAssignment />}

      <AddComplaintPanel 
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
      />
    </div>
  );
}
