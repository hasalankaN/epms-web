"use client";

import { motion } from "framer-motion";

import { ProgressCard } from "@/components/lecturer-panel/dashboard/ProgressCard";
import { ReviewSummaryCard } from "@/components/lecturer-panel/dashboard/ReviewSummaryCard";
import { EarningsSummaryCard } from "@/components/lecturer-panel/dashboard/EarningsSummaryCard";
import { ZoomClassesCard } from "@/components/lecturer-panel/dashboard/ZoomClassesCard";
import { itemVariants } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LecturerDashboardPage() {
  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={containerVariants}
      className={cn("space-y-6 pt-6 pl-6 pr-8 pb-8")}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className={cn("flex items-center justify-between")}>
       <h1 className="group cursor-default text-left font-sans text-2xl font-semibold leading-[38px] text-[#0F172B]">
          Welcome Back!{" "}
          <span className="wave-on-hover wave-once">
            👋
          </span>
        </h1>
      </motion.div>

      {/* Top Section: Progress Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProgressCard 
          title="Course Name"
          progress={47}
          progressColor="#E60076"
          details={[
            { label: "Course Category", value: "Category Name" },
            { label: "Started Date", value: "2026.02.22" },
            { label: "No. of Enrollments:", value: "XXXX" },
          ]}
        />
        <ProgressCard 
          title="Batch Name"
          progress={47}
          progressColor="#8B5CF6"
          details={[
            { label: "Batch Number", value: "XX" },
            { label: "Started Date", value: "2026.02.22" },
            { label: "No. of Enrollments:", value: "XXXX" },
          ]}
        />
      </motion.div>

      {/* Middle Section: Summaries */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReviewSummaryCard 
          stats={[
            { label: "Assignments from Courses", value: "XX" },
            { label: "Assignments from Batches", value: "XX" },
          ]}
        />
        <EarningsSummaryCard 
          stats={[
            { label: "Estimated Total", value: "XXXX.00" },
            { label: "Accumulated Total", value: "XXXX.00" },
            { label: "Pending Total", value: "XXXX.00", color: "#FB2C36" },
          ]}
        />
      </motion.div>

      {/* Bottom Section: Zoom Classes */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ZoomClassesCard 
          title="Zoom Classes - Today"
          classes={[
            { id: "1", batchName: "Batch Name", batchNumber: "Batch Number", dateTime: "Date and Time" },
            { id: "2", batchName: "Batch Name", batchNumber: "Batch Number", dateTime: "Date and Time" },
          ]}
        />
        <ZoomClassesCard 
          title="Zoom Classes - Upcoming"
          classes={[
            { id: "1", batchName: "Batch Name", batchNumber: "Batch Number", dateTime: "Date and Time" },
            { id: "2", batchName: "Batch Name", batchNumber: "Batch Number", dateTime: "Date and Time" },
            { id: "3", batchName: "Batch Name", batchNumber: "Batch Number", dateTime: "Date and Time" },
          ]}
        />
      </motion.div>
    </motion.div>
  );
}
