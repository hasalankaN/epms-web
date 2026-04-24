"use client";

import React, { useCallback, useMemo } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { SourceWiseToolbar } from "@/components/admin-panel/finance/source-wise-report/SourceWiseToolbar";
import { SourceWiseTable } from "@/components/admin-panel/finance/source-wise-report/SourceWiseTable";
import {
  useGetSourceWiseSummary,
  FILTER_KEY_TO_VIA,
  PAYMENT_VIA_LABELS,
} from "@/hooks/api/finances/useGetSourceWise";

export default function SourceWiseReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const search = searchParams.get("search") || "";

  const transactionSourceParam =
    searchParams.get("transactionSource") || undefined;

  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  const activeUrlFilters = {
    transactionSource: transactionSourceParam,
    dateFrom,
    dateTo,
  };

  // Convert filter chip keys (e.g. "cash,boc") to backend enum values (["CASH","BOC"])
  const paymentViaFilter = useMemo(() => {
    if (!transactionSourceParam) return undefined;

    return transactionSourceParam
      .split(",")
      .map((k) => FILTER_KEY_TO_VIA[k.toLowerCase()])
      .filter(Boolean);
  }, [transactionSourceParam]);

  const { data, isLoading, isError } = useGetSourceWiseSummary({
    payment_via:
      paymentViaFilter && paymentViaFilter.length > 0
        ? paymentViaFilter
        : undefined,
    date_from: dateFrom,
    date_to: dateTo,
    page: 1,
    size: 200,
  });

  // Map API rows to table rows, applying client-side search on the display label
  const tableData = useMemo(() => {
    const rows = (data?.data ?? []).map((item) => ({
      transaction_via: item.transaction_via,
      transactionSource:
        PAYMENT_VIA_LABELS[item.transaction_via] ?? item.transaction_via,
      totalIncome: Number(item.total_income ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      totalExpenses: Number(item.total_expense ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    }));

    if (!search) return rows;
    const lower = search.toLowerCase();

    return rows.filter((r) =>
      r.transactionSource.toLowerCase().includes(lower),
    );
  }, [data, search]);

  const totalResults = tableData.length;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) params.delete(key);
        else params.set(key, value);
      });
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleExportCSV = useCallback(() => {
    const headers = ["Transaction Source", "Total Income", "Total Expenses"];

    const rows = tableData.map((r) => [
      r.transactionSource,
      r.totalIncome,
      r.totalExpenses,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, "'")}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "source-wise-report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [tableData]);

  return (
    <div className="space-y-3 p-4 md:p-6 w-full">
      <div className="flex w-full flex-col gap-4 pb-10">
        <SourceWiseToolbar
          search={search}
          onSearchChange={(value) => updateParams({ search: value || null })}
          onApplyFilters={(filters) => updateParams(filters)}
          onClearFilters={() =>
            updateParams({
              search: null,
              transactionSource: null,
              dateFrom: null,
              dateTo: null,
            })
          }
          onExportCSV={handleExportCSV}
          activeUrlFilters={activeUrlFilters}
        />
        <SourceWiseTable
          data={tableData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={totalResults}
          isLoading={isLoading}
          isError={isError}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
    </div>
  );
}
