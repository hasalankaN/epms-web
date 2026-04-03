import { motion } from "framer-motion";

import { ReferralStats } from "./referral/stats/ReferralStats";
import { ReferralPendingStats } from "./referral/stats/ReferralPendingStats";
import { ReferralContent } from "./referral/ReferralContent";
import { ReferralAgentStats } from "./referral/agents/ReferralAgentStats";
import { ReferralStudentStats } from "./referral/students/ReferralStudentStats";
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

export function ReferralSection() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col gap-4"
    >
      <motion.div variants={itemVariants}>
        <ReferralStats />
      </motion.div>
      
      {/* Pending Stats - 24px gap from above (gap-4 = 16px + mt-2 = 8px) */}
      <motion.div variants={itemVariants} className="mt-2">
        <ReferralPendingStats />
      </motion.div>
      
      {/* Referral Content Tabs */}
      <motion.div variants={itemVariants}>
        <ReferralContent />
      </motion.div>

      {/* Referral Agents Statistics Section */}
      <div className="flex flex-col gap-[12px]">
        {/* Header */}
        <motion.div variants={itemVariants} className="mt-2 w-full border-b border-[#E2E8F0]">
          <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
            Referral Agents Statistics
          </h2>
        </motion.div>
        
        {/* Agent Cards */}
        <motion.div variants={itemVariants}>
          <ReferralAgentStats />
        </motion.div>
      </div>

      {/* Student Referral Statistics Section - 24px gap from above */}
      <div className="flex flex-col gap-[12px]">
        {/* Header */}
        <motion.div variants={itemVariants} className="mt-2 w-full border-b border-[#E2E8F0]">
          <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
            Student Referral Statistics
          </h2>
        </motion.div>
        
        {/* Student Cards */}
        <motion.div variants={itemVariants}>
          <ReferralStudentStats />
        </motion.div>
      </div>
    </motion.div>
  );
}

