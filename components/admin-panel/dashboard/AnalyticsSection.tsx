"use client";

import React from "react";

import { PlaceholderChart } from "./analytics/PlaceholderChart";
import { TopBatchesChart } from "./analytics/TopBatchesChart";
import { TopCoursesGrayChart } from "./analytics/TopCoursesGrayChart";
import { TopCoursesPurpleChart } from "./analytics/TopCoursesPurpleChart";

export function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Top 5 Batches by Enrollment */}
      <TopBatchesChart />

      {/* Top 5 Courses by Enrollment (Purple) */}
      <TopCoursesPurpleChart />

      {/* Top 5 Courses by Enrollment (Gray) */}
      <TopCoursesGrayChart />

      {/* Placeholder Chart */}
      <PlaceholderChart />
    </div>
  );
}


