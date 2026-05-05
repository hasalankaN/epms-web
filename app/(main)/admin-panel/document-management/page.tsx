"use client";

import React, { useState } from "react";


import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { AllTemplates } from "@/components/admin-panel/document-management/AllTemplates";
import { IssuedDocuments } from "@/components/admin-panel/document-management/IssuedDocuments";
import { AddDocumentPanel } from "@/components/admin-panel/document-management/modals/AddDocumentPanel";
import { useTabNavigation } from "@/hooks/useTabNavigation";

export type DocumentTabType = "all-template" | "issued-documents";

const tabs = [
  { value: "all-template", label: "All Template", mobileLabel: "All Template" },
  { value: "issued-documents", label: "Issued Documents", mobileLabel: "Issued" },
] as const;

export default function DocumentManagementPage() {

  const { activeTab, handleTabChange } = useTabNavigation(
    "all-template",
    tabs.map((t) => t.value)
  );

  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);


  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Header: Tabs + New Document button */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs — no icons */}
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

        {/* New Document Button — only on All Template tab */}
        {activeTab === "all-template" && (
          <button
            onClick={() => setIsAddDocumentOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">New Document</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "all-template" && <AllTemplates />}
      {activeTab === "issued-documents" && <IssuedDocuments />}

      <AddDocumentPanel
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
      />
    </div>
  );
}
