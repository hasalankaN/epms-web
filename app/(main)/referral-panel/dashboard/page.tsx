"use client";

import React from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { ReferralIdCard } from "@/components/referral-panel/dashboard/referral-info/ReferralIdCard";
import { OverviewSection } from "@/components/referral-panel/dashboard/OverviewSection";
import { TeamSection } from "@/components/referral-panel/dashboard/TeamSection";
import { itemVariants } from "@/components/ui/dialog";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const tabs = [
  { value: "overview", label: "Overview" },
  { value: "team", label: "Team" },
] as const;

export type ReferralTabType = "overview" | "team";

export default function ReferralDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") as ReferralTabType;
  const activeTab = tabs.some((t) => t.value === currentTab) ? currentTab : "overview";

  const handleTabChange = (tabValue: ReferralTabType) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tabValue);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
      className="pt-3 pl-4 pr-6 pb-6 flex flex-col gap-3"
    >
      <motion.div variants={itemVariants}>
        <ReferralIdCard />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-3 h-[4px] w-full bg-[#F1F5F9]" 
      />

      {/* Tabs Section */}
      <motion.div variants={itemVariants} className="mt-3">
        <div className="flex h-9 items-center justify-between gap-3 sm:h-10 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <div className={cn(TAB_STYLES.container, "h-9 w-max items-center sm:h-10 sm:w-auto")}>
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    className={cn(
                      TAB_STYLES.triggerBase,
                      "px-3 sm:px-6",
                      activeTab === tab.value
                        ? TAB_STYLES.active
                        : TAB_STYLES.inactive
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button className={cn(BUTTON_STYLES.secondary.md, "h-9 sm:h-10 shrink-0 px-3 sm:px-4 text-xs sm:text-sm font-semibold whitespace-nowrap")}>
            <Plus className="h-4 w-4" />
            <span className="inline">Add Student</span>
          </button>
        </div>
      </motion.div>
      
      <motion.div 
        key={activeTab}
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="mt-3"
      >
        {activeTab === "overview" && <OverviewSection />}
        {activeTab === "team" && <TeamSection />}
      </motion.div>
    </motion.div>
  );
}




