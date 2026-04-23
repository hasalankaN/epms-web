"use client";

import { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

import { SentTab } from "@/components/admin-panel/notification-management/SentTab";
import { ScheduledTab } from "@/components/admin-panel/notification-management/ScheduledTab";
import { ResponseTrackingTab } from "@/components/admin-panel/notification-management/ResponseTrackingTab";
import { AddNotificationPanel } from "@/components/admin-panel/notification-management/modals/AddNotificationPanel";

export type NotificationTabType = "sent" | "scheduled" | "response-tracking";

const tabs = [
  { value: "sent", label: "Sent", mobileLabel: "Sent" },
  { value: "scheduled", label: "Scheduled", mobileLabel: "Scheduled" },
  { value: "response-tracking", label: "Response Time Tracking", mobileLabel: "Response" },
] as const;

export default function NotificationManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  const currentTab = searchParams.get("tab") as NotificationTabType;

  const activeTab = tabs.some((t) => t.value === currentTab) ? currentTab : "sent";

  const handleTabChange = (tabValue: NotificationTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
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
                    activeTab === tab.value ? TAB_STYLES.active : TAB_STYLES.inactive
                  )}
                >
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.mobileLabel}</span>
                </button>
              ))}
            </div>
          </HorizontalScrollContainer>
        </div>

        {/* New Notification Button — visible on Sent & Scheduled tabs */}
        {(activeTab === "sent" || activeTab === "scheduled") && (
          <button
            onClick={() => setIsAddPanelOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4 shrink-0"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">New Notification</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "sent" && <SentTab />}
      {activeTab === "scheduled" && <ScheduledTab />}
      {activeTab === "response-tracking" && <ResponseTrackingTab />}

      {/* Add Notification Side Panel */}
      <AddNotificationPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
      />
    </div>
  );
}
