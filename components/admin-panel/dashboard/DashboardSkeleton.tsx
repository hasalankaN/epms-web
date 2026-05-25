"use client";

import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";


const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Overview Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[102px] w-full rounded-xl" />
        ))}
      </motion.div>

      {/* Financial Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Skeleton className="lg:col-span-3 h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </motion.div>

      {/* Students & Courses Header */}
      <motion.div variants={itemVariants} className="mt-2 w-full border-b border-[#E2E8F0] pb-2">
        <Skeleton className="h-8 w-48" />
      </motion.div>

      {/* Student Courses Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[80px] w-full rounded-xl" />
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ReferralSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </motion.div>
      <motion.div variants={itemVariants} className="mt-2">
        <Skeleton className="h-[150px] w-full rounded-xl" />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </motion.div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
      <Skeleton className="h-[350px] w-full rounded-xl" />
    </div>
  );
}
