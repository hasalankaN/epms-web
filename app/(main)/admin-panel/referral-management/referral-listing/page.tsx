"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { ReferralStaffTab } from "@/components/admin-panel/referral-management/referral-listing/ReferralStaffTab";
import { StudentReferralsTab } from "@/components/admin-panel/referral-management/referral-listing/StudentReferralsTab";
import { AddReferralMemberPanel } from "@/components/admin-panel/referral-management/referral-listing/modals/AddReferralMemberPanel";

export type ReferralListingTabType = "referral-staff" | "student-referrals";

const tabs = [
  { value: "referral-staff", label: "Referral Staff", mobileLabel: "Referral Staff" },
  { value: "student-referrals", label: "Students Referrals", mobileLabel: "Students" },
] as const;

export default function ReferralListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as ReferralListingTabType;
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  const activeTab = tabs.some((t) => t.value === currentTab) ? currentTab : "referral-staff";

  const handleTabChange = (tabValue: ReferralListingTabType) => {
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

        {/* New Referral Member Button — only on Referral Staff tab */}
        {activeTab === "referral-staff" && (
          <button
            onClick={() => setIsAddPanelOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">New Referral Member</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "referral-staff" && <ReferralStaffTab />}
      {activeTab === "student-referrals" && <StudentReferralsTab />}

      {/* Add Referral Member Panel */}
      <AddReferralMemberPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
      />
    </div>
  );
}
