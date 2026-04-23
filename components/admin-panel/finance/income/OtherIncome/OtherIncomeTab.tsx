"use client";

import React, { useState, useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";

import { OtherIncomeToolbar } from "./OtherIncomeToolbar";
import { OtherIncomeTable } from "./OtherIncomeTable";
import type { OtherIncomeData } from "./OtherIncomeTable";
import { useGetOtherIncome } from "@/hooks/api/finances/useGetOtherIncome";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import api from "@/lib/axios";

const PAGE_SIZE = 10;

export function OtherIncomeTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page") || "1");

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [transactionVia, setTransactionVia] = useState("all");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const { data, isLoading } = useGetOtherIncome({
    page: currentPage,
    size: PAGE_SIZE,
    transaction_via: transactionVia !== "all" ? transactionVia : undefined,
    date_from: dateRange.start ? dateRange.start.toISOString() : undefined,
    date_to: dateRange.end ? dateRange.end.toISOString() : undefined,
  });

  const mapped: OtherIncomeData[] = (data?.data ?? []).map((item) => ({
    id: item.id,
    date: format(new Date(item.transaction_date), "yyyy/MM/dd"),
    description: item.description,
    branch: item.branch_name ?? "—",
    transactionVia: item.transaction_via,
    amount: `LKR ${Number(item.amount).toFixed(2)}`,
    evidenceUrl: item.evidence_url ?? undefined,
  }));

  const handleExportCsv = async () => {
    try {
      const params: Record<string, string> = {};

      if (transactionVia !== "all") params.transaction_via = transactionVia;
      if (dateRange.start) params.date_from = dateRange.start.toISOString();
      if (dateRange.end) params.date_to = dateRange.end.toISOString();
      const res = await api.get(API_ENDPOINTS.finances.OTHER_INCOME_EXPORT, { params, responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");

 a.href = url; a.download = "other-income.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch { toast.error("Failed to export CSV."); }
  };

  return (
    <div className="space-y-4 pt-2">
      <OtherIncomeToolbar
        transactionVia={transactionVia}
        setTransactionVia={(v) => { setTransactionVia(v); handlePageChange(1); }}
        dateRange={dateRange}
        setDateRange={(r) => { setDateRange(r); handlePageChange(1); }}
        onExportCsv={handleExportCsv}
      />
      <OtherIncomeTable
        data={mapped}
        isLoading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data?.meta?.total ?? 0}
      />
    </div>
  );
}
