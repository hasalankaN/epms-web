"use client";

import React, { useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { SourceWiseToolbar } from "@/components/admin-panel/finance/source-wise-report/SourceWiseToolbar";
import { SourceWiseTable } from "@/components/admin-panel/finance/source-wise-report/SourceWiseTable";
import type { SourceWiseData } from "@/components/admin-panel/finance/source-wise-report/SourceWiseTable";

const TRANSACTION_SOURCES = ["BOC", "Cash", "Peoples"] as const;

const mockData: SourceWiseData[] = TRANSACTION_SOURCES.flatMap((source, sIdx) =>
  Array.from({ length: 15 }).map((_, i) => ({
    id: `SW-${sIdx}-${i + 1}`,
    transactionSource: source,
    totalIncome: "X,XXX.00",
    totalExpenses: "X,XXX.00",
  }))
);

export default function SourceWiseReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const search = searchParams.get("search") || "";
  const transactionSource = searchParams.get("transactionSource") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  const activeUrlFilters = { transactionSource, dateFrom, dateTo };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
     
      // Reset page when filters change
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleSearchChange = (value: string) => {
    updateParams({ search: value || null });
  };

  const handleApplyFilters = (filters: Record<string, string | null>) => {
    updateParams(filters);
  };

  const handleClearFilters = () => {
    updateParams({ search: null, transactionSource: null, dateFrom: null, dateTo: null });
  };

  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      !search ||
      item.transactionSource.toLowerCase().includes(search.toLowerCase());

    const matchesSource =
      !transactionSource ||
      transactionSource
        .split(",")
        .some((s) => s.toLowerCase() === item.transactionSource.toLowerCase());

    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col gap-4 pb-10">
        <SourceWiseToolbar
          search={search}
          onSearchChange={handleSearchChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          activeUrlFilters={activeUrlFilters}
        />
        <SourceWiseTable
          data={filteredData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={filteredData.length}
        />
      </div>
    </div>

  );
}
