"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { motion } from "framer-motion";
import { FileText, Plus, Zap } from "lucide-react";

import { OverviewSection } from "@/components/admin-panel/dashboard/OverviewSection";
import { ReferralSection } from "@/components/admin-panel/dashboard/ReferralSection";
import { AnalyticsSection } from "@/components/admin-panel/dashboard/AnalyticsSection";

// Modals
import { AddInquiryPanel } from "@/components/admin-panel/inquiry/modals/AddInquiryPanel";
import { AddComplaintPanel } from "@/components/admin-panel/complaint-management/modals/AddComplaintPanel";
import { AddIncomePanel } from "@/components/admin-panel/finance/income/OtherIncome/modals/AddIncomePanel";
import { AddExpensePanel } from "@/components/admin-panel/finance/expenses/modals/AddExpensePanel";

import { itemVariants } from "@/components/ui/dialog";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import { FilterDropdown, type FilterCategory } from "@/components/common/dropdowns/FilterDropdown";


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export type DashboardTabType = "overview" | "referral" | "analytics";

const tabs = [
  { value: "overview", label: "Overview", icon: "overview-icon" },
  { value: "referral", label: "Referral", icon: "referral-icon" },
  { value: "analytics", label: "Analytics", icon: "analytics-icon" },
] as const;

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Modal States
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  const currentTab = searchParams.get("tab") as DashboardTabType;

  const activeTab = tabs.some((t) => t.value === currentTab)
    ? currentTab
    : "overview";

  const handleTabChange = (tabValue: DashboardTabType) => {
    const params = new URLSearchParams();

    params.set("tab", tabValue);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const quickActionCategories: FilterCategory[] = [
    {
      key: "quick-actions",
      label: "Quick Actions",
      items: [
        { key: "add-inquiry", label: "Add Inquiry" },
        { key: "add-complaint", label: "Add Complaint" },
        { key: "add-income", label: "Add Income" },
        { key: "add-expense", label: "Add Expense" },
      ],
    },
  ];

  const handleQuickAction = (_categoryKey: string, itemKey: string) => {
    if (itemKey === "add-inquiry") setIsInquiryOpen(true);
    if (itemKey === "add-complaint") setIsComplaintOpen(true);
    if (itemKey === "add-income") setIsIncomeOpen(true);
    if (itemKey === "add-expense") setIsExpenseOpen(true);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
      className="space-y-3 pt-3 pl-4 pr-6 pb-6"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
        <h1 className="group cursor-default text-left font-sans text-xl sm:text-2xl font-semibold leading-tight sm:leading-[38px] text-[#0F172B] whitespace-nowrap">
          Welcome Back!{" "}
          <span className="wave-on-hover wave-once">
            👋
          </span>
        </h1>
        <div className="flex items-center gap-3">
          <FilterDropdown
            label="Quick Action"
            categories={quickActionCategories}
            triggerIcon={Zap}
            onFilterSelect={handleQuickAction}
            responsive={true}
            className="h-9 sm:h-10"
          />
          <button className={cn(BUTTON_STYLES.secondary.md, "h-9 sm:h-10 px-3 sm:px-4 text-sm font-semibold")}>
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Add New Student</span>
          </button>
          <button className={BUTTON_STYLES.primary.responsive}>
            <FileText className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Generate Report</span>
          </button>
        </div>
      </motion.div>

      {/* Tabs Section */}
      <motion.div variants={itemVariants} className="overflow-x-auto pb-2 sm:pb-0">
        <div className={TAB_STYLES.container}>
          {tabs.map((tab) => {
            return (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  TAB_STYLES.triggerBase,
                  activeTab === tab.value
                    ? TAB_STYLES.active
                    : TAB_STYLES.inactive
                )}
              >
                <span className={cn(TAB_STYLES.icon, tab.icon)} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div 
        key={activeTab}
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mt-6"
      >
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "referral" && <ReferralSection />}
        {activeTab === "analytics" && <AnalyticsSection />}
      </motion.div>

      {/* Modals */}
      <AddInquiryPanel 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
      />
      <AddComplaintPanel 
        isOpen={isComplaintOpen} 
        onClose={() => setIsComplaintOpen(false)} 
      />
      <AddIncomePanel 
        isOpen={isIncomeOpen} 
        onClose={() => setIsIncomeOpen(false)} 
      />
      <AddExpensePanel 
        isOpen={isExpenseOpen} 
        onClose={() => setIsExpenseOpen(false)} 
        activeTab="general-expense"
      />
    </motion.div>
  );
}
