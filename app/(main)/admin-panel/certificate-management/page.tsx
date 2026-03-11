"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { AllTemplates } from "@/components/admin-panel/certificate-management/AllTemplates";
import { CertificateToBeIssued } from "@/components/admin-panel/certificate-management/CertificateToBeIssued";
import { AddCertificatePanel } from "@/components/admin-panel/certificate-management/modals/AddCertificatePanel";

export type CertificateTabType = "all-template" | "certificate-to-be-issued";

const tabs = [
  { value: "all-template", label: "All Template", mobileLabel: "All Template" },
  { value: "certificate-to-be-issued", label: "Certificate to be Issued", mobileLabel: "To be Issued" },
] as const;

export default function CertificateManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as CertificateTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "all-template";

  const [isAddCertificateOpen, setIsAddCertificateOpen] = useState(false);

  const handleTabChange = (tabValue: CertificateTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header: Tabs + New Certificate button */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs — no icons (unlike Inquiry section) */}
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

        {/* New Certificate Button — only on All Template tab */}
        {activeTab === "all-template" && (
          <button
            onClick={() => setIsAddCertificateOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">New Certificate</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "all-template" && <AllTemplates />}
      {activeTab === "certificate-to-be-issued" && <CertificateToBeIssued />}

      <AddCertificatePanel
        isOpen={isAddCertificateOpen}
        onClose={() => setIsAddCertificateOpen(false)}
      />
    </div>
  );
}
