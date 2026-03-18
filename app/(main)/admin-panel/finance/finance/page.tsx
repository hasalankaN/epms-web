"use client";

import React, { useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { FinanceStatsRow } from "@/components/admin-panel/finance/finance/FinanceStatsRow";
import { FinanceFilterRow } from "@/components/admin-panel/finance/finance/FinanceFilterRow";
import { RevenueGrowthChart } from "@/components/admin-panel/finance/finance/RevenueGrowthChart";
import { FinanceToolbar } from "@/components/admin-panel/finance/finance/FinanceToolbar";
import { FinanceTable } from "@/components/admin-panel/finance/finance/FinanceTable";
import type { FinanceTableDataType } from "@/components/admin-panel/finance/finance/FinanceTable";

const rawMockData: FinanceTableDataType[] = Array.from({ length: 45 }).map((_, i) => ({
  id: `FN-${i + 1}`,
  date: new Date(2025, 4, 15 - (i % 30)).toISOString().split("T")[0],
  totalPayment: Math.floor(Math.random() * 500000) + 100000,
  totalDiscount: Math.floor(Math.random() * 20000) + 1000,
  totalCommission: Math.floor(Math.random() * 50000) + 5000,
  totalExpenses: Math.floor(Math.random() * 100000) + 10000,
  netProfit: 0,
})).map(item => ({
  ...item,
  netProfit: item.totalPayment - item.totalDiscount - item.totalCommission - item.totalExpenses,
}));

export default function FinancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        <FinanceStatsRow />
        <FinanceFilterRow />
        <RevenueGrowthChart />
        
        <div className="mt-6 flex w-full flex-col space-y-4">
          <FinanceToolbar />
          <FinanceTable
            data={rawMockData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
