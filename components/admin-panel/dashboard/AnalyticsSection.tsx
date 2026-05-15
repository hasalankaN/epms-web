import { useState, useCallback } from "react";

import { motion } from "framer-motion";

import { X } from "lucide-react";

import { useGetDashboardAnalytics } from "@/hooks/api/dashboard/useGetDashboardAnalytics";
import { TopBatchesChart } from "./analytics/TopBatchesChart";
import { TopCoursesGrayChart } from "./analytics/TopCoursesGrayChart";
import { TopCoursesPurpleChart } from "./analytics/TopCoursesPurpleChart";
import { itemVariants } from "@/components/ui/dialog";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function AnalyticsSection() {
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  const [clearKey, setClearKey] = useState(0);

  const { data } = useGetDashboardAnalytics({
    from: dateRange.from?.toISOString(),
    to: dateRange.to?.toISOString(),
  });

  const handleClearFilters = useCallback(() => {
    setDateRange({ from: null, to: null });
    setClearKey((k) => k + 1);
  }, []);

  const hasActiveFilters = dateRange.from !== null || dateRange.to !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Area */}
      <div className="flex items-center justify-end gap-3">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className={cn(
              BUTTON_STYLES.outline.md,
              "h-10 border-dashed text-[#64748B] hover:text-[#0F172B] font-semibold text-[14px]",
            )}
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
        <DateRangeFilter
          key={clearKey}
          placeholder="By Date"
          align="end"
          onApply={(start, end) => setDateRange({ from: start, to: end })}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Top 5 Batches by Enrollment */}
        <motion.div variants={itemVariants}>
          <TopBatchesChart data={data?.topBatches} />
        </motion.div>

        {/* Top 5 Courses by Enrollment (Purple) */}
        <motion.div variants={itemVariants}>
          <TopCoursesPurpleChart data={data?.topCourses} />
        </motion.div>

        {/* Top 5 Courses by Enrollment (Gray) */}
        <motion.div variants={itemVariants}>
          <TopCoursesGrayChart data={data?.topCourses} />
        </motion.div>
      </motion.div>
    </div>
  );
}
