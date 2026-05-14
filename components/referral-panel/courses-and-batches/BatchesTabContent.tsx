"use client";

import React, { useState } from "react";

import { CoursesAndBatchesToolbar } from "./CoursesAndBatchesToolbar";
import { BatchesTable } from "./BatchesTable";
import type { ReferralBatchDataType } from "@/types/referral-products";

const mockBatches: ReferralBatchDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `batch-${i + 1}`,
  batchId: "#000001",
  batchName: "Lorem Ipsum",
  category: "Online",
  branch: "Colombo",
  type: i % 2 === 0 ? "Diploma" : "HND",
  price: "LKR XXXX.00",
  directCommissionRate: "LKR XXXX.00",
  teamCommissionRate: "LKR XXXX.00",
  status: (["Upcoming", "Active", "Inactive", "Completed"] as const)[i % 4],
}));

export function BatchesTabContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const paginatedData = mockBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <CoursesAndBatchesToolbar 
        placeholder="Search by Batch Name/ID, Batch Category, Lecturer Name.." 
        onSearch={(val) => console.log("Searching batches:", val)}
      />
      <BatchesTable
        data={paginatedData}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalResults={mockBatches.length}
      />
    </div>
  );
}
