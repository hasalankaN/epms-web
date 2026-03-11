"use client";

import React, { useState } from "react";

import type { ReferralCommissionTabType } from "@/app/(main)/admin-panel/approvals/referral-commissions/page";

import { BatchesTable } from "./views/BatchesTable";
import { CoursesTable } from "./views/CoursesTable";
import { ProductsTable } from "./views/ProductsTable";
import { RejectedTable } from "./views/RejectedTable";

import {
  mockCommissionBatchesData,
  mockCommissionCoursesData,
  mockCommissionProductsData,
  mockCommissionRejectedData,
} from "./mockData";

interface ReferralCommissionsContainerProps {
  activeTab: ReferralCommissionTabType;
}

export function ReferralCommissionsContainer({ activeTab }: ReferralCommissionsContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="w-full">
      {activeTab === "batches" && (
        <BatchesTable
          data={mockCommissionBatchesData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "online-courses" && (
        <CoursesTable
          data={mockCommissionCoursesData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "products" && (
        <ProductsTable
          data={mockCommissionProductsData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "rejected" && (
        <RejectedTable
          data={mockCommissionRejectedData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
