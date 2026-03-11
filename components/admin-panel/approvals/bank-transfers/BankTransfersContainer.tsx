"use client";

import React, { useState } from "react";

import type { BankTransferTabType } from "@/app/(main)/admin-panel/approvals/bank-transfers/page";

import { BatchesTable } from "./views/BatchesTable";
import { CoursesTable } from "./views/CoursesTable";
import { ProductsTable } from "./views/ProductsTable";
import { RejectedTable } from "./views/RejectedTable";

import { mockBatchesData, mockCoursesData, mockProductsData, mockRejectedData } from "./mockData";

interface BankTransfersContainerProps {
  activeTab: BankTransferTabType;
}

export function BankTransfersContainer({ activeTab }: BankTransfersContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="w-full">
      {activeTab === "batches" && (
        <BatchesTable
          data={mockBatchesData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "online-courses" && (
        <CoursesTable
          data={mockCoursesData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "products" && (
        <ProductsTable
          data={mockProductsData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      {activeTab === "rejected" && (
        <RejectedTable
          data={mockRejectedData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
