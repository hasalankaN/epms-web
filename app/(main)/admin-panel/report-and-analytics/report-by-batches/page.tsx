"use client";

import React, { useCallback, useState } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ReportByBatchesTopBar } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesTopBar";
import type { ReportByBatchesStatItem } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesStatsRow";
import { ReportByBatchesStatsRow } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesStatsRow";
import { ReportByBatchesFilterRow } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesFilterRow";
import { ReportByBatchesChart } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesChart";
import { ReportByBatchesSearch } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesSearch";

// Tables
import type { ReportByBatchesDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesTable";
import { ReportByBatchesTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/ReportByBatchesTable";
import type { TotalDiscountDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalDiscountTable";
import { TotalDiscountTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalDiscountTable";
import type { TotalReferralCommissionDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalReferralCommissionTable";
import { TotalReferralCommissionTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalReferralCommissionTable";
import type { TotalExpenseDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalExpenseTable";
import { TotalExpenseTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/TotalExpenseTable";
import type { NetProfitDataType } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/NetProfitTable";
import { NetProfitTable } from "@/components/admin-panel/report-and-analytics/report-by-batches/tables/NetProfitTable";

// Mock Data Generators
const generatePaymentData = (): ReportByBatchesDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `BCH-${i + 1}`,
  batchName: "Dip. HR",
  branch: "Colombo",
  totalAmountToCollect: Math.floor(Math.random() * 500000) + 100000,
  totalPendingPayment: Math.floor(Math.random() * 50000) + 10000,
  status: i % 3 === 0 ? "Pending" : "Completed",
}));

const generateDiscountData = (): TotalDiscountDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `DISC-${i + 1}`,
  batchName: "Dip. HR",
  branch: "Colombo",
  studentName: "name",
  referralName: "name",
  actualValue: Math.floor(Math.random() * 50000) + 10000,
  offerValue: Math.floor(Math.random() * 40000) + 5000,
  discountReceived: Math.floor(Math.random() * 10000) + 1000,
  offeredOn: "2026/01/21",
}));

const generateCommissionData = (): TotalReferralCommissionDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `COM-${i + 1}`,
  batchName: "Dip. HR",
  studentName: "name",
  paymentAmount: Math.floor(Math.random() * 50000) + 10000,
  referralCom: Math.floor(Math.random() * 5000) + 500,
  referralPerson: "name",
  date: "2026/01/21",
  offeredBy: "Admin",
}));

const generateExpenseData = (): TotalExpenseDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `EXP-${i + 1}`,
  date: "2026/01/21",
  batchName: "Dip. HR",
  branch: "Colombo",
  description: "Lorem Ipsum",
  transactionVia: "BOC",
  amount: Math.floor(Math.random() * 50000) + 10000,
}));

const generateProfitData = (): NetProfitDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `PRO-${i + 1}`,
  batchName: "Dip. HR",
  branch: "Colombo",
  totalIncome: Math.floor(Math.random() * 500000) + 100000,
  totalExpense: Math.floor(Math.random() * 200000) + 50000,
  profitOrLossValue: Math.floor(Math.random() * 300000) + 10000,
  status: i % 4 === 0 ? "Loss" : "Profit",
}));

const MOCK_DATA = {
  payment: generatePaymentData(),
  discount: generateDiscountData(),
  commission: generateCommissionData(),
  expense: generateExpenseData(),
  profit: generateProfitData(),
};

export default function ReportByBatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const activeTab = searchParams.get("tab") || "payment";
  const [search, setSearch] = useState("");

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleTabChange = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tab);
    params.set("page", "1"); // reset page on tab change
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const stats: ReportByBatchesStatItem[] = [
    { key: "payment", title: "Total Payment", value: "XXXX.00", isActive: activeTab === "payment" },
    { key: "discount", title: "Total Discount", value: "XXXX.00", isActive: activeTab === "discount" },
    { key: "commission", title: "Total Referral Commision", value: "XXXX.00", isActive: activeTab === "commission" },
    { key: "expense", title: "Total Expense", value: "XXXX.00", isActive: activeTab === "expense" },
    { key: "profit", title: "Net Profit", value: "XXXX.00", isActive: activeTab === "profit" },
  ];

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        
        {/* 1. Top Bar */}
        <ReportByBatchesTopBar />

        {/* 2. Stats Row (Clickable) */}
        <div className="mt-4">
          <ReportByBatchesStatsRow stats={stats} onCardClick={handleTabChange} />
        </div>

        {/* 3. Filter Row */}
        <ReportByBatchesFilterRow />

        {/* 4. Chart */}
        <ReportByBatchesChart />
        
        {/* 5. Search Bar & Table */}
        <div className="mt-2 flex w-full flex-col space-y-4">
          <ReportByBatchesSearch search={search} onSearchChange={setSearch} />
          
          {/* Dynamic Table Rendering based on Active Tab */}
          {activeTab === "payment" && (
            <ReportByBatchesTable
              data={MOCK_DATA.payment}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === "discount" && (
            <TotalDiscountTable
              data={MOCK_DATA.discount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === "commission" && (
            <TotalReferralCommissionTable
              data={MOCK_DATA.commission}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === "expense" && (
            <TotalExpenseTable
              data={MOCK_DATA.expense}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {activeTab === "profit" && (
            <NetProfitTable
              data={MOCK_DATA.profit}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

      </div>
    </div>
  );
}
