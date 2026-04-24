"use client";

import React, { useState } from "react";

import { SalesByItemsPieChart } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsPieChart";
import { SalesByItemsToolbar } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsToolbar";
import type { SalesByItemsDataType } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsTable";
import { SalesByItemsTable } from "@/components/admin-panel/report-and-analytics/sales-by-items/SalesByItemsTable";

const MOCK_TABLE_DATA: SalesByItemsDataType[] = [
  {
    id: "1",
    itemName: "Course A",
    noOfItemsSold: 120,
    grossSale: 120000.00,
    totalDiscounts: 5000.00,
    totalRefCommissions: 2000.00,
    totalRefunds: 1000.00,
    netSales: 112000.00,
  },
  {
    id: "2",
    itemName: "Course B",
    noOfItemsSold: 85,
    grossSale: 85000.00,
    totalDiscounts: 2000.00,
    totalRefCommissions: 1500.00,
    totalRefunds: 500.00,
    netSales: 81000.00,
  },
  {
    id: "3",
    itemName: "Course C",
    noOfItemsSold: 210,
    grossSale: 210000.00,
    totalDiscounts: 10000.00,
    totalRefCommissions: 5000.00,
    totalRefunds: 3000.00,
    netSales: 192000.00,
  },
  {
    id: "4",
    itemName: "Course D",
    noOfItemsSold: 45,
    grossSale: 45000.00,
    totalDiscounts: 1000.00,
    totalRefCommissions: 500.00,
    totalRefunds: 0.00,
    netSales: 43500.00,
  },
  {
    id: "5",
    itemName: "Course E",
    noOfItemsSold: 60,
    grossSale: 60000.00,
    totalDiscounts: 1500.00,
    totalRefCommissions: 1000.00,
    totalRefunds: 200.00,
    netSales: 57300.00,
  },
];

export default function SalesByItemsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="w-full space-y-6 p-4 pb-10 md:p-6">
      {/* 1. Header & Pie Chart Section */}
      <div className="rounded-[8px] bg-white p-6 border border-[#E2E8F0]">
        <SalesByItemsPieChart />
      </div>

      {/* 2. Toolbar & Table Section */}
      <div className="space-y-4">
        <SalesByItemsToolbar 
          onExportCsv={() => console.log("Exporting CSV...")}
          onSearchChange={(val) => console.log("Search:", val)}
        />
        <SalesByItemsTable 
          data={MOCK_TABLE_DATA}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
