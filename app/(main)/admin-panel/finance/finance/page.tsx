"use client";

import React, { useCallback, useMemo, useState } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { format, subDays } from "date-fns";
import { toast } from "sonner";


import { FinanceStatsRow } from "@/components/admin-panel/finance/finance/FinanceStatsRow";
import { FinanceFilterRow } from "@/components/admin-panel/finance/finance/FinanceFilterRow";
import { RevenueGrowthChart } from "@/components/admin-panel/finance/finance/RevenueGrowthChart";
import { FinanceToolbar } from "@/components/admin-panel/finance/finance/FinanceToolbar";
import { FinanceTable } from "@/components/admin-panel/finance/finance/FinanceTable";
import type { FinanceTableDataType } from "@/components/admin-panel/finance/finance/FinanceTable";

import {
  useGetFinanceOverviewSummary,
  useGetFinanceOverviewGraph,
  useGetFinanceOverviewTable,
} from "@/hooks/api/finances/useGetFinanceOverview";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";

const ITEMS_PER_PAGE = 10;

export default function FinancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page") || "1");
  const [selectedDays, setSelectedDays] = useState(30);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSelectDays = (days: number) => {
    setSelectedDays(days);
    handlePageChange(1);
  };

  const dateFrom = format(subDays(new Date(), selectedDays), "yyyy-MM-dd");
  const dateTo = format(new Date(), "yyyy-MM-dd");

  const overviewParams = { date_from: dateFrom, date_to: dateTo };

  const { data: summary, isLoading: summaryLoading } = useGetFinanceOverviewSummary(overviewParams);

  const { data: graph, isLoading: graphLoading } = useGetFinanceOverviewGraph({
    ...overviewParams,
    group_by: selectedDays <= 30 ? "DAY" : "MONTH",
    metric: "payments",
  });

  const { data: tableRows, isLoading: tableLoading } = useGetFinanceOverviewTable(overviewParams);

  const tableData = useMemo<FinanceTableDataType[]>(() => {
    if (!tableRows) return [];
    
return tableRows.map((row, i) => ({
      id: `row-${i}`,
      date: row.date ? format(new Date(row.date), "yyyy/MM/dd") : "—",
      totalPayment: Number(row.total_payments ?? 0),
      totalDiscount: Number(row.total_discounts ?? 0),
      totalCommission: Number(row.total_commissions ?? 0),
      totalExpenses: Number(row.total_expenses ?? 0),
      netProfit: Number(row.net_profit ?? 0),
    }));
  }, [tableRows]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    
return tableData.slice(start, start + ITEMS_PER_PAGE);
  }, [tableData, currentPage]);

  const handleExportCsv = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.finances.OVERVIEW_EXPORT, {
        params: overviewParams,
        responseType: "blob",
      });

      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");

 a.href = url; a.download = "finance-overview.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Failed to export CSV."); }
  };

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        <FinanceStatsRow summary={summary} isLoading={summaryLoading} />
        <FinanceFilterRow selectedDays={selectedDays} onSelectDays={handleSelectDays} />
        <RevenueGrowthChart
          graph={graph}
          summary={summary}
          isLoading={graphLoading}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />

        <div className="mt-6 flex w-full flex-col space-y-4">
          <FinanceToolbar onExportCsv={handleExportCsv} />
          <FinanceTable
            data={paginatedData}
            isLoading={tableLoading}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalCount={tableData.length}
          />
        </div>
      </div>
    </div>
  );
}
