"use client";

import React, { useCallback, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ReportByProductsTopBar } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsTopBar";
import { ReportByProductsFilterRow } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsFilterRow";
import { ReportByProductsStatsRow } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsStatsRow";
import { ReportByProductsChart } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsChart";
import { ReportByProductsSearch } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsSearch";
import { ReportByProductsTable } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsTable";
import type { ReportByProductsDataType } from "@/components/admin-panel/report-and-analytics/report-by-products/ReportByProductsTable";

const generateProductData = (): ReportByProductsDataType[] => Array.from({ length: 45 }).map((_, i) => ({
  id: `PROD-${i + 1}`,
  date: "2026/01/21",
  totalPayment: Math.floor(Math.random() * 500000) + 100000,
  totalDiscounts: Math.floor(Math.random() * 50000) + 10000,
  totalReferralCommision: Math.floor(Math.random() * 20000) + 5000,
  totalRefunds: Math.floor(Math.random() * 10000) + 1000,
  netSales: Math.floor(Math.random() * 400000) + 100000,
}));

const MOCK_DATA = generateProductData();

export default function ReportByProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const [search, setSearch] = useState("");

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const stats = [
    { key: "payment", title: "Total Payment", value: "XXXX.00" },
    { key: "discount", title: "Total Discounts", value: "XXXX.00" },
    { key: "commission", title: "Total Referral Commision", value: "XXXX.00" },
    { key: "refunds", title: "Total Refunds", value: "XXXX.00" },
    { key: "net-sales", title: "Net Sales", value: "XXXX.00" },
  ];

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        
        {/* 1. Top Bar */}
        <ReportByProductsTopBar />

        {/* 2. Stats Row (Display Only) */}
        <div className="mt-4">
          <ReportByProductsStatsRow stats={stats} />
        </div>

        {/* 3. Filter Row */}
        <ReportByProductsFilterRow />

        {/* 4. Chart */}
        <ReportByProductsChart />
        
        {/* 5. Search Bar & Table */}
        <div className="mt-2 flex w-full flex-col space-y-4">
          <ReportByProductsSearch 
            search={search} 
            onSearchChange={setSearch} 
          />
          
          <ReportByProductsTable
            data={MOCK_DATA}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

      </div>
    </div>
  );
}
