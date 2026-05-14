"use client";

import { motion } from "framer-motion";

import { ReferralStats } from "./referral-info/ReferralStats";
import { TotalCommissionChart } from "./overview/TotalCommissionChart";
import { ReferralCodeStats } from "./overview/ReferralCodeStats";
import { TopPerformersSection } from "./overview/TopPerformersSection";
import { itemVariants } from "@/components/ui/dialog";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function OverviewSection() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col gap-6"
    >
      <motion.div variants={itemVariants}>
        <ReferralStats />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TotalCommissionChart />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ReferralCodeStats />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TopPerformersSection />
      </motion.div>
    </motion.div>
  );
}
