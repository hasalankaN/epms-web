import { motion } from "framer-motion";

import { PlaceholderChart } from "./analytics/PlaceholderChart";
import { TopBatchesChart } from "./analytics/TopBatchesChart";
import { TopCoursesGrayChart } from "./analytics/TopCoursesGrayChart";
import { TopCoursesPurpleChart } from "./analytics/TopCoursesPurpleChart";
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

export function AnalyticsSection() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {/* Top 5 Batches by Enrollment */}
      <motion.div variants={itemVariants}>
        <TopBatchesChart />
      </motion.div>

      {/* Top 5 Courses by Enrollment (Purple) */}
      <motion.div variants={itemVariants}>
        <TopCoursesPurpleChart />
      </motion.div>

      {/* Top 5 Courses by Enrollment (Gray) */}
      <motion.div variants={itemVariants}>
        <TopCoursesGrayChart />
      </motion.div>

      {/* Placeholder Chart */}
      <motion.div variants={itemVariants}>
        <PlaceholderChart />
      </motion.div>
    </motion.div>
  );
}


