"use client";

import { motion } from "framer-motion";

import { OverviewStats } from "./overview/stats/OverviewStats";
import { FinancialSummary } from "./overview/financial/FinancialSummary";
import { StudentCoursesStats } from "./overview/students-courses/stats/StudentCoursesStats";
import { EnrollmentPieChart } from "./overview/students-courses/charts/EnrollmentPieChart";
import { TrendsChart } from "./overview/students-courses/charts/TrendsChart";
import { CertificatesProgress } from "./overview/students-courses/CertificatesProgress";
import { UpcomingClasses } from "./overview/students-courses/UpcomingClasses";
import { SubmissionOverview } from "./overview/students-courses/SubmissionOverview";
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
      className="flex flex-col gap-4"
    >
      <motion.div variants={itemVariants}>
        <OverviewStats />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <FinancialSummary />
      </motion.div>
      
      {/* Students & Courses Header */}
      <motion.div variants={itemVariants} className="mt-2 w-full border-b border-[#E2E8F0]">
        <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
          Students & Courses
        </h2>
      </motion.div>
      
      {/* Students & Courses Stats */}
      <motion.div variants={itemVariants}>
        <StudentCoursesStats />
      </motion.div>
      
      {/* Charts Row - Responsive layout */}
      <motion.div variants={itemVariants} className="flex w-full flex-col gap-4 md:flex-row md:items-stretch">
        <div className="w-full md:w-1/2">
          <EnrollmentPieChart className="h-full" />
        </div>
        <div className="w-full md:w-1/2">
          <TrendsChart className="h-full" />
        </div>
      </motion.div>
      
      {/* Certificates Progress */}
      <motion.div variants={itemVariants}>
        <CertificatesProgress />
      </motion.div>
      
      {/* Upcoming Classes & Submission Overview Row */}
      <motion.div variants={itemVariants} className="flex w-full flex-col gap-4 md:flex-row md:items-stretch">
        <div className="w-full md:w-1/3">
          <UpcomingClasses className="h-full" />
        </div>
        <div className="w-full md:w-2/3">
          <SubmissionOverview className="h-full" />
        </div>
      </motion.div>
    </motion.div>
  );
}
