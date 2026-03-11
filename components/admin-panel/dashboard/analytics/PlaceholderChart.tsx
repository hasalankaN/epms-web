"use client";

import React from "react";

import { CommonPieChart } from "../shared/charts/CommonPieChart";

// Chart data with Magenta/Pink color scheme
const placeholderData = [
  { name: "Item 1", value: 32, color: "#C026D3" },
  { name: "Item 2", value: 26, color: "#D946EF" },
  { name: "Item 3", value: 18, color: "#E879F9" },
  { name: "Item 4", value: 12, color: "#F0ABFC" },
  { name: "Item 5", value: 8, color: "#F5D0FE" },
  { name: "Other", value: 4, color: "#FAE8FF" },
];

export function PlaceholderChart() {
  return (
    <CommonPieChart
      title="Add one more graph here..."
      dateRange="From {month} - To {month} {Year}"
      data={placeholderData}
    />
  );
}
