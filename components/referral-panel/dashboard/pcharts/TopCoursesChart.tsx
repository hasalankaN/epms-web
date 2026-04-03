"use client";

import React from "react";

import { CommonPieChart } from "@/components/admin-panel/dashboard/shared/charts/CommonPieChart";

// Chart data with Purple color scheme
const coursesData = [
  { name: "Course 1", value: 30, color: "#7C3AED" },
  { name: "Course 2", value: 22, color: "#8B5CF6" },
  { name: "Course 3", value: 18, color: "#A78BFA" },
  { name: "Course 4", value: 15, color: "#C4B5FD" },
  { name: "Course 5", value: 10, color: "#DDD6FE" },
  { name: "Other", value: 5, color: "#EDE9FE" },
];

export function TopCoursesChart() {
  return (
    <CommonPieChart
      title="Top 5 Course By Enrollment"
      dateRange="From {month} - To {month} {Year}"
      data={coursesData}
    />
  );
}
