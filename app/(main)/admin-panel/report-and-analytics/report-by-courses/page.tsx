"use client";

import React, { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ReportByCoursesTopBar } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesTopBar";
import type { ReportByCoursesStatItem } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesStatsRow";
import { ReportByCoursesStatsRow } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesStatsRow";
import { ReportByCoursesFilterRow } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesFilterRow";
import { ReportByCoursesChart } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesChart";
import { ReportByCoursesSearch } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesSearch";

// Tables
import type { ReportByCoursesDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesTable";
import { ReportByCoursesTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/ReportByCoursesTable";
import type { TotalDiscountDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalDiscountTable";
import { TotalDiscountTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalDiscountTable";
import type { TotalReferralCommissionDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalReferralCommissionTable";
import { TotalReferralCommissionTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalReferralCommissionTable";
import type { TotalExpenseDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalExpenseTable";
import { TotalExpenseTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/TotalExpenseTable";
import type { NetProfitDataType } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/NetProfitTable";
import { NetProfitTable } from "@/components/admin-panel/report-and-analytics/report-by-courses/tables/NetProfitTable";

// Mock Data Generators
const generatePaymentData = (): ReportByCoursesDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `CRS-${i + 1}`,
  courseName: "Diploma in HR",
  category: "Diploma",
  totalAmountToCollect: Math.floor(Math.random() * 500000) + 100000,
  totalPendingPayment: i % 5 === 0 ? null : Math.floor(Math.random() * 50000) + 10000,
  status: i % 3 === 0 ? "Pending" : "Completed",
}));

const generateDiscountData = (): TotalDiscountDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `CDISC-${i + 1}`,
  courseName: "Diploma in HR",
  category: "Diploma",
  studentName: "name",
  referralName: "name",
  actualValue: Math.floor(Math.random() * 50000) + 10000,
  offerValue: Math.floor(Math.random() * 40000) + 5000,
  discountReceived: Math.floor(Math.random() * 10000) + 1000,
  offeredOn: "2026/01/21",
}));

const generateCommissionData = (): TotalReferralCommissionDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `CCOM-${i + 1}`,
  courseName: "Diploma in HR",
  category: "Diploma",
  studentName: "name",
  referralCom: Math.floor(Math.random() * 5000) + 500,
  referralPerson: "name",
  date: "2026/01/21",
  paymentAmount: Math.floor(Math.random() * 50000) + 10000,
  offeredBy: "Admin",
}));

const generateExpenseData = (): TotalExpenseDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `CEXP-${i + 1}`,
  date: "2026/01/21",
  courseName: "Diploma in HR",
  category: "Diploma",
  description: "Lorem Ipsum",
  transactionVia: "BOC",
  amount: Math.floor(Math.random() * 50000) + 10000,
}));

const generateProfitData = (): NetProfitDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `CPRO-${i + 1}`,
  courseName: "Diploma in HR",
  category: "Diploma",
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

export default function ReportByCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const activeTab = searchParams.get("tab") || "payment";
  const [search, setSearch] = useState("");
  const [extraFilterVal, setExtraFilterVal] = useState<string | null>(null);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleTabChange = useCallback((tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setExtraFilterVal(null); // Reset extra filter on tab change
  }, [searchParams, pathname, router]);

  const stats: ReportByCoursesStatItem[] = [
    { key: "payment", title: "Total Payment", value: "XXXX.00", isActive: activeTab === "payment" },
    { key: "discount", title: "Total Discount", value: "XXXX.00", isActive: activeTab === "discount" },
    { key: "commission", title: "Total Referral Commision", value: "XXXX.00", isActive: activeTab === "commission" },
    { key: "expense", title: "Total Expense", value: "XXXX.00", isActive: activeTab === "expense" },
    { key: "profit", title: "Net Profit", value: "XXXX.00", isActive: activeTab === "profit" },
  ];

  // Extra filter configurations based on active tab
  let extraFilter: any = undefined;
  if (activeTab === "commission") {
    extraFilter = {
      type: "dropdown",
      label: "Referral Person",
      categories: [{
        key: "referral", label: "Referral", items: [
          { key: "all", label: "All Persons" },
          { key: "p1", label: "Person 1" },
          { key: "p2", label: "Person 2" },
        ]
      }],
      onSelect: (_c: string, _i: string, label: string) => setExtraFilterVal(label === "All Persons" ? null : label),
      onClear: () => setExtraFilterVal(null),
      value: extraFilterVal
    };
  } else if (activeTab === "expense" || activeTab === "profit") {
    extraFilter = {
      type: "date",
      label: "Date",
      onDateApply: (start: Date | null, end: Date | null) => {
        console.log("Date range selected:", start, end);
        setExtraFilterVal(start ? start.toLocaleDateString() : null);
      },
      onClear: () => setExtraFilterVal(null),
      value: extraFilterVal
    };
  }

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        
        {/* 1. Top Bar */}
        <ReportByCoursesTopBar />

        {/* 2. Stats Row (Clickable) */}
        <div className="mt-4">
          <ReportByCoursesStatsRow stats={stats} onCardClick={handleTabChange} />
        </div>

        {/* 3. Filter Row */}
        <ReportByCoursesFilterRow />

        {/* 4. Chart */}
        <ReportByCoursesChart />
        
        {/* 5. Search Bar & Table */}
        <div className="mt-2 flex w-full flex-col space-y-4">
          <ReportByCoursesSearch 
            search={search} 
            onSearchChange={setSearch} 
            extraFilter={extraFilter}
          />
          
          {activeTab === "payment" && (
            <ReportByCoursesTable
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
