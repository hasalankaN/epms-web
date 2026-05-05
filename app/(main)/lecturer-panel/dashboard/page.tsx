"use client";

import { motion } from "framer-motion";

import { ProgressCard } from "@/components/lecturer-panel/dashboard/ProgressCard";
import { ReviewSummaryCard } from "@/components/lecturer-panel/dashboard/ReviewSummaryCard";
import { EarningsSummaryCard } from "@/components/lecturer-panel/dashboard/EarningsSummaryCard";
import { ZoomClassesCard } from "@/components/lecturer-panel/dashboard/ZoomClassesCard";
import { itemVariants } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

import React, { useState } from "react";
import { useGetLecturerDashboard } from "@/hooks/api/lecturers/useGetLecturerDashboard";

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
  const { data: dashboardData, isLoading } = useGetLecturerDashboard();
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="space-y-6 pt-6 pl-6 pr-8 pb-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const courses = dashboardData?.courses || [];
  const batches = dashboardData?.batches || [];
  
  const course = courses[currentCourseIndex];
  const batch = batches[currentBatchIndex];
  
  const assignmentSummary = dashboardData?.assignmentSummary;
  const financialSummary = dashboardData?.financialSummary;

  const handleNextCourse = () => {
    setCurrentCourseIndex((prev) => (prev + 1) % courses.length);
  };

  const handlePrevCourse = () => {
    setCurrentCourseIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const handleNextBatch = () => {
    setCurrentBatchIndex((prev) => (prev + 1) % batches.length);
  };

  const handlePrevBatch = () => {
    setCurrentBatchIndex((prev) => (prev - 1 + batches.length) % batches.length);
  };

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
          title={course?.name || "No Course Active"}
          progress={course?.completionPercentage || 0}
          progressColor="#E60076"
          onNext={courses.length > 1 ? handleNextCourse : undefined}
          onPrev={courses.length > 1 ? handlePrevCourse : undefined}
          details={[
            { label: "Course Category", value: course?.categoryName || "N/A" },
            { label: "Started Date", value: course ? new Date(course.startDate).toLocaleDateString() : "N/A" },
            { label: "No. of Enrollments:", value: course?.enrollmentCount?.toString() || "0" },
          ]}
        />
        <ProgressCard 
          title={batch?.name || "No Batch Active"}
          progress={batch?.completionPercentage || 0}
          progressColor="#8B5CF6"
          onNext={batches.length > 1 ? handleNextBatch : undefined}
          onPrev={batches.length > 1 ? handlePrevBatch : undefined}
          details={[
            { label: "Started Date", value: batch ? new Date(batch.startDate).toLocaleDateString() : "N/A" },
            { label: "No. of Enrollments:", value: batch?.enrollmentCount?.toString() || "0" },
          ]}
        />
      </motion.div>

      {/* Middle Section: Summaries */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReviewSummaryCard 
          stats={[
            { label: "Assignments from Courses", value: assignmentSummary?.courseAssignments?.toString() || "0" },
            { label: "Assignments from Batches", value: assignmentSummary?.batchAssignments?.toString() || "0" },
          ]}
        />
        <EarningsSummaryCard 
          stats={[
            { label: "Estimated Total", value: financialSummary?.estimated || "0.00" },
            { label: "Accumulated Total", value: financialSummary?.accumulated || "0.00" },
            { label: "Pending Total", value: financialSummary?.pending || "0.00", color: "#FB2C36" },
          ]}
        />
      </motion.div>

      {/* Bottom Section: Zoom Classes */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ZoomClassesCard 
          title="Zoom Classes - Today"
          classes={dashboardData?.zoomToday || []}
        />
        <ZoomClassesCard 
          title="Zoom Classes - Upcoming"
          classes={dashboardData?.zoomUpcoming || []}
        />
      </motion.div>
    </motion.div>
  );
}
