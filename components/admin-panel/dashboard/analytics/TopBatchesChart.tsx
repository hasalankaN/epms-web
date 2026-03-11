"use client";

import React from "react";

import { CommonPieChart } from "../shared/charts/CommonPieChart";

// Chart data with Pink color scheme
const batchesData = [
  { name: "Batch A", value: 35, color: "#E11D9F" },
  { name: "Batch B", value: 25, color: "#F472B6" },
  { name: "Batch C", value: 18, color: "#F9A8D4" },
  { name: "Batch D", value: 12, color: "#FBCFE8" },
  { name: "Batch E", value: 8, color: "#F5D0FE" },
  { name: "Other", value: 5, color: "#DDA0DD" },
];

export function TopBatchesChart() {
  return (
    <CommonPieChart
      title="Top 5 Batches by Enrollment"
      dateRange="From {month} - To {month} {Year}"
      data={batchesData}
    />
  );
}
