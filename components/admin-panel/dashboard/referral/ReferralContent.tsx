"use client";

import React, { useRef, useState, useEffect } from "react";

import { CircleCheck, ChevronLeft, ChevronRight } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TAB_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import { PendingApprovalsTable } from "./views/PendingApprovalsTable";
import { ReferralApprovalTable } from "./views/ReferralApprovalTable";
import { PendingLeadsTable } from "./views/PendingLeadsTable";
import { PendingFollowUpsTable } from "./views/PendingFollowUpsTable";
import { PendingOrdersTable } from "./views/PendingOrdersTable";

export function ReferralContent() {
  const [activeTab, setActiveTab] = useState("approvals");
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTab = (value: string) => {
    const container = containerRef.current;

    if (!container) return;

    const tabElement = container.querySelector(
      `button[data-value="${value}"]`
    ) as HTMLElement;

    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    scrollToTab(activeTab);
  }, [activeTab]);

  const handleScroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 200;

      const newScrollLeft =
        direction === "left"
          ? containerRef.current.scrollLeft - scrollAmount
          : containerRef.current.scrollLeft + scrollAmount;
      
      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col items-start gap-[10px] rounded-lg border border-[#E2E8F0] p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="relative flex w-full items-center gap-2 lg:block">
          {/* Left Arrow (Mobile only) */}
          <button
            title="Scroll Left"
            onClick={() => handleScroll("left")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm hover:bg-[#F1F5F9] lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <TabsList
            ref={containerRef}
            className={cn(
              TAB_STYLES.container,
              "no-scrollbar flex w-full max-w-full justify-start overflow-x-auto scroll-smooth lg:w-fit"
            )}
          >
            <TabsTrigger
              value="approvals"
              data-value="approvals"
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto shrink-0 flex-nowrap whitespace-nowrap text-[#62748E] hover:text-[#1D293D] data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm"
              )}
            >
              <CircleCheck className="h-4 w-4" />
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger
              value="referral-approval"
              data-value="referral-approval"
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto shrink-0 flex-nowrap whitespace-nowrap text-[#62748E] hover:text-[#1D293D] data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm"
              )}
            >
              <i className="approvals-icon h-4 w-4" />
              Pending Referral Approval
            </TabsTrigger>
            <TabsTrigger
              value="leads"
              data-value="leads"
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto shrink-0 flex-nowrap whitespace-nowrap text-[#62748E] hover:text-[#1D293D] data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm"
              )}
            >
              <i className="navigation-arrow h-4 w-4" />
              Pending Leads
            </TabsTrigger>
            <TabsTrigger
              value="follow-ups"
              data-value="follow-ups"
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto shrink-0 flex-nowrap whitespace-nowrap text-[#62748E] hover:text-[#1D293D] data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm"
              )}
            >
              <i className="phone-transfer h-4 w-4" />
              Pending Follow Ups
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              data-value="orders"
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto shrink-0 flex-nowrap whitespace-nowrap text-[#62748E] hover:text-[#1D293D] data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm"
              )}
            >
              <i className="package h-4 w-4" />
              Pending Orders
            </TabsTrigger>
          </TabsList>

          {/* Right Arrow (Mobile only) */}
          <button
            title="Scroll Right"
            onClick={() => handleScroll("right")}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm hover:bg-[#F1F5F9] lg:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Tab Content */}
        <TabsContent value="approvals" className="mt-0 outline-none">
          <PendingApprovalsTable />
        </TabsContent>
        <TabsContent value="referral-approval" className="mt-0 outline-none">
          <ReferralApprovalTable />
        </TabsContent>
        <TabsContent value="leads" className="mt-0 outline-none">
          <PendingLeadsTable />
        </TabsContent>
        <TabsContent value="follow-ups" className="mt-0 outline-none">
          <PendingFollowUpsTable />
        </TabsContent>
        <TabsContent value="orders" className="mt-0 outline-none">
          <PendingOrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
