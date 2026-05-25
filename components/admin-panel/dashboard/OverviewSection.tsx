"use client";

import { useMemo, useState } from "react";

import { motion } from "framer-motion";

import { useGetDashboardOverview } from "@/hooks/api/dashboard/useGetDashboardOverview";
import { itemVariants } from "@/components/ui/dialog";

import { OverviewStats } from "./overview/stats/OverviewStats";
import { FinancialSummary } from "./overview/financial/FinancialSummary";
import { StudentCoursesStats } from "./overview/students-courses/stats/StudentCoursesStats";
import { EnrollmentPieChart } from "./overview/students-courses/charts/EnrollmentPieChart";
import { TrendsChart } from "./overview/students-courses/charts/TrendsChart";
import { CertificatesProgress } from "./overview/students-courses/CertificatesProgress";
import { UpcomingClasses } from "./overview/students-courses/UpcomingClasses";
import { SubmissionOverview } from "./overview/students-courses/SubmissionOverview";
import { OverviewSkeleton } from "./DashboardSkeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function formatTimeLabel(scheduledAt: string): string {
  const now = new Date();
  const date = new Date(scheduledAt);
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 0) {
    return "Upcoming";
  }

  if (diffMins < 60) {
    return `In ${diffMins} minutes`;
  }

  if (diffMins < 24 * 60) {
    const hours = Math.round(diffMins / 60);

    return `In ${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ".");

  return `In ${dateStr}`;
}

export function OverviewSection() {
  const [trendDays, setTrendDays] = useState(180);
  const { data, isLoading } = useGetDashboardOverview(trendDays);

  const upcomingClasses = useMemo(
    () =>
      data?.upcomingClasses?.map((c) => ({
        id: c.id,
        name: c.name,
        timeLabel: formatTimeLabel(c.scheduledAt),
      })) ?? undefined,
    [data?.upcomingClasses],
  );

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="flex flex-col gap-4"
    >
      <motion.div variants={itemVariants}>
        <OverviewStats todayStats={data?.todayStats} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <FinancialSummary financialSummary={data?.financialSummary} />
      </motion.div>

      {/* Students & Courses Header */}
      <motion.div
        variants={itemVariants}
        className="mt-2 w-full border-b border-[#E2E8F0]"
      >
        <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
          Students & Courses
        </h2>
      </motion.div>

      {/* Students & Courses Stats */}
      <motion.div variants={itemVariants}>
        <StudentCoursesStats stats={data?.studentCourseStats} />
      </motion.div>

      {/* Charts Row - Responsive layout */}
      <motion.div
        variants={itemVariants}
        className="flex w-full flex-col gap-4 md:flex-row md:items-stretch"
      >
        <div className="w-full md:w-1/2">
          <EnrollmentPieChart
            className="h-full"
            enrollmentByStatus={data?.enrollmentByStatus}
          />
        </div>
        <div className="w-full md:w-1/2">
          <TrendsChart
            className="h-full"
            trendData={data?.trendData}
            selectedDays={trendDays}
            onFilterChange={setTrendDays}
          />
        </div>
      </motion.div>

      {/* Certificates Progress */}
      <motion.div variants={itemVariants}>
        <CertificatesProgress stats={data?.certificates} />
      </motion.div>

      {/* Upcoming Classes & Submission Overview Row */}
      <motion.div
        variants={itemVariants}
        className="flex w-full flex-col gap-4 md:flex-row md:items-stretch"
      >
        <div className="w-full md:w-1/3">
          <UpcomingClasses classes={upcomingClasses} className="h-full" />
        </div>
        <div className="w-full md:w-2/3">
          <SubmissionOverview
            data={data?.submissionOverview}
            className="h-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
