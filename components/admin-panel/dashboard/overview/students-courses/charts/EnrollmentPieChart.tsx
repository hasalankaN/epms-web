"use client";

import React from "react";

import { CommonPieChart } from "../../../shared/charts/CommonPieChart";

const enrollmentData = [
  { name: "Completed", value: 40, color: "#E11D9F" },
  { name: "Hold", value: 10, color: "#F472B6" },
  { name: "No Response", value: 7, color: "#FBCFE8" },
  { name: "Dropped", value: 10, color: "#F9A8D4" },
  { name: "Active", value: 20, color: "#F5D0FE" },
  { name: "Pending", value: 13, color: "#DDA0DD" },
];

interface EnrollmentPieChartProps {
  className?: string;
}

export function EnrollmentPieChart({ className }: EnrollmentPieChartProps) {
  return (
    <CommonPieChart
      title="Number of Enrollments"
      dateRange="From {month} - To {month} {Year}"
      data={enrollmentData}
      className={className}
    />
  );
}
