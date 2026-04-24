"use client";

import React, { useState, useCallback, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { subDays, format } from "date-fns";

import { ProfitLossStatsRow } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossStatsRow";
import { ProfitLossToolbar } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossToolbar";
import { ProfitLossTable } from "@/components/admin-panel/finance/profit-and-loss/ProfitLossTable";
import {
  useGetPnlSummary,
  useGetPnlList,
} from "@/hooks/api/finances/useGetPnlData";
import type { PnlStatus } from "@/hooks/api/finances/useGetPnlData";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const PAGE_SIZE = 20;

export default function ProfitAndLossPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  // Default date range: last 30 days when no custom range set
  const effectiveDateFrom =
    dateFrom ?? format(subDays(new Date(), 30), "yyyy-MM-dd");

  const effectiveDateTo = dateTo ?? format(new Date(), "yyyy-MM-dd");

  const apiStatus: PnlStatus | undefined =
    statusFilter === "Profited"
      ? "PROFIT"
      : statusFilter === "Loss"
        ? "LOSS"
        : undefined;

  const summaryParams = {
    date_from: effectiveDateFrom,
    date_to: effectiveDateTo,
    ...(apiStatus ? { status: apiStatus } : {}),
  };

  const listParams = {
    date_from: effectiveDateFrom,
    date_to: effectiveDateTo,
    ...(apiStatus ? { status: apiStatus } : {}),
    page: currentPage,
    size: PAGE_SIZE,
  };

  const { data: summary, isLoading: summaryLoading } =
    useGetPnlSummary(summaryParams);

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
  } = useGetPnlList(listParams);

  const allRows = listData?.data ?? [];

  const totalCount = listData?.meta.total ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Client-side search filter on top of API results
  const filteredRows = useMemo(() => {
    if (!searchQuery) return allRows;
    const q = searchQuery.toLowerCase();

    return allRows.filter((r) => r.source_name.toLowerCase().includes(q));
  }, [allRows, searchQuery]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter(null);
    setDateFrom(null);
    setDateTo(null);
  }, []);

  const handleExportCsv = useCallback(() => {
    const params = new URLSearchParams({
      date_from: effectiveDateFrom,
      date_to: effectiveDateTo,
      ...(apiStatus ? { status: apiStatus } : {}),
    });

    window.open(
      `${API_ENDPOINTS.finances.PNL_EXPORT}?${params.toString()}`,
      "_blank",
    );
  }, [effectiveDateFrom, effectiveDateTo, apiStatus]);

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col pb-10">
        <ProfitLossStatsRow summary={summary} isLoading={summaryLoading} />

        <div className="mt-6 flex w-full flex-col space-y-4">
          <ProfitLossToolbar
            search={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={(val) => {
              setStatusFilter(val);
              handlePageChange(1);
            }}
            onClearFilters={handleClearFilters}
            onDateRangeChange={(from, to) => {
              setDateFrom(from);
              setDateTo(to);
              handlePageChange(1);
            }}
            onExportCsv={handleExportCsv}
          />
          <ProfitLossTable
            data={filteredRows}
            isLoading={listLoading}
            isError={listError}
            currentPage={currentPage}
            totalCount={filteredRows.length}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
