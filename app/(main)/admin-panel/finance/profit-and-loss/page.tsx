"use client";

import React, { useState, useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ProfitLossStatsRow } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossStatsRow";
import { ProfitLossToolbar } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossToolbar";
import { ProfitLossTable } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossTable";
import type { ProfitLossTableDataType } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossTable";

const rawMockData: ProfitLossTableDataType[] = Array.from({ length: 45 }).map((_, i) => {
  const isBatch = i % 3 === 0;
  const isCourse = i % 3 === 1;
  const income = Math.floor(Math.random() * 500000) + 50000;
  const expenses = Math.floor(Math.random() * 400000) + 10000;

  return {
    id: `PL-${i + 1}`,
    description: isBatch ? `Batch Name ${i + 1}` : isCourse ? `Course Name ${i + 1}` : `Product Name ${i + 1}`,
    totalIncome: income,
    totalExpenses: expenses,
    status: income > expenses ? "Profited" : "Loss",
  };
});

export default function ProfitAndLossPage() {
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

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Apply filters
  const filteredData = rawMockData.filter((item) => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        <ProfitLossStatsRow />
        
        <div className="mt-6 flex w-full flex-col space-y-4">
          <ProfitLossToolbar 
            search={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={(val: string | null) => setStatusFilter(val)}
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter(null);
            }}
          />
          <ProfitLossTable
            data={filteredData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
