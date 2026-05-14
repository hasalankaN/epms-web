"use client";

import { motion } from "framer-motion";

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

import { AgentOverview } from "./team/AgentOverview";
import { TopAgentsSection } from "./team/TopAgentsSection";

export function TeamSection() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col gap-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm"
      >
        <AgentOverview />
        <div className="mx-6 h-[1px] bg-[#E2E8F0]" />
        <TopAgentsSection />
      </motion.div>
    </motion.div>
  );
}
