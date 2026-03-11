"use client";

import React from "react";

import { CommonPieChart } from "../shared/charts/CommonPieChart";

// Chart data with Gray/Blue color scheme
const coursesData = [
  { name: "Course A", value: 28, color: "#334155" },
  { name: "Course B", value: 24, color: "#475569" },
  { name: "Course C", value: 20, color: "#64748B" },
  { name: "Course D", value: 14, color: "#94A3B8" },
  { name: "Course E", value: 10, color: "#CBD5E1" },
  { name: "Other", value: 4, color: "#E2E8F0" },
];

export function TopCoursesGrayChart() {
  return (
    <CommonPieChart
      title="Top 5 Courses by Enrollment"
      dateRange="From {month} - To {month} {Year}"
      data={coursesData}
    />
  );
}
