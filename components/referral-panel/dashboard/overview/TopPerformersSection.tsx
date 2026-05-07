"use client";

import React from "react";

import type { PieData } from "./ReferralPieCard";
import { ReferralPieCard } from "./ReferralPieCard";

const courseData: PieData[] = [
  { name: "Course 1", value: 35, color: "#16A34A" },
  { name: "Course 2", value: 25, color: "#F59E0B" },
  { name: "Course 3", value: 20, color: "#2563EB" },
  { name: "Course 4", value: 12, color: "#8B5CF6" },
  { name: "Course 5", value: 8, color: "#EC4899" },
];

const batchData: PieData[] = [
  { name: "Batch 1", value: 30, color: "#16A34A" },
  { name: "Batch 2", value: 28, color: "#F59E0B" },
  { name: "Batch 3", value: 22, color: "#2563EB" },
  { name: "Batch 4", value: 15, color: "#8B5CF6" },
  { name: "Batch 5", value: 5, color: "#EF4444" },
];

const productData: PieData[] = [
  { name: "Product 1", value: 40, color: "#16A34A" },
  { name: "Product 2", value: 20, color: "#F59E0B" },
  { name: "Product 3", value: 18, color: "#2563EB" },
  { name: "Product 4", value: 12, color: "#8B5CF6" },
  { name: "Product 5", value: 10, color: "#EC4899" },
];

export function TopPerformersSection() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <ReferralPieCard 
        title="Top 5 Course By Enrollment" 
        dateRange="January - June 2026" 
        data={courseData} 
      />
      <ReferralPieCard 
        title="Top 5 Batches by Enrollment" 
        dateRange="January - June 2026" 
        data={batchData} 
      />
      <ReferralPieCard 
        title="Top 5 Products By Purchase" 
        dateRange="January - June 2026" 
        data={productData} 
      />
    </div>
  );
}
