"use client";

import React, { useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { format } from "date-fns";

import { BCPExpenseToolbar } from "./BCPExpenseToolbar";
import { BCPExpenseTable } from "./BCPExpenseTable";
import type { BCPExpenseData } from "./BCPExpenseTable";
import { useGetExpenses } from "@/hooks/api/finances/useGetExpenses";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const PAGE_SIZE = 20;

export function BCPExpenseTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const search = searchParams.get("search") || "";
  const source = (searchParams.get("source") || undefined) as "BATCH" | "COURSE" | "PRODUCT" | undefined;
  const transactionVia = searchParams.get("transactionVia") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { data, isLoading, isError } = useGetExpenses({
    related_entity_type: (source as "BATCH" | "COURSE" | "PRODUCT") ?? "BATCH",
    date_from: dateFrom,
    date_to: dateTo,
    transaction_via: transactionVia,
    search: search || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const rows: BCPExpenseData[] = (data?.results ?? []).map((r) => ({
    id: r.id,
    date: r.date ? format(new Date(r.date), "yyyy/MM/dd") : "—",
    expenseDescription: r.description,
    batchCourseProductName: r.related_entity_name ?? r.related_entity_type,
    amount: `LKR ${Number(r.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
    branch: "—",
    transactionVia: r.transaction_via,
    source: r.related_entity_type.toLowerCase(),
  }));

  const handleExport = () => {
    const params = new URLSearchParams({
      related_entity_type: source ?? "BATCH",
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
      ...(transactionVia ? { transaction_via: transactionVia } : {}),
      ...(search ? { search } : {}),
    });

    window.open(`${API_ENDPOINTS.finances.EXPENSES_EXPORT}?${params.toString()}`, "_blank");
  };

  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <BCPExpenseToolbar
        search={search}
        onSearchChange={(v) => updateParams({ search: v || null })}
        onApplyFilters={(filters) => updateParams(filters)}
        onClearFilters={() => updateParams({ search: null, source: null, transactionVia: null, dateFrom: null, dateTo: null })}
        activeUrlFilters={{ source, transactionVia, dateFrom, dateTo }}
        onExport={handleExport}
      />
      <BCPExpenseTable
        data={rows}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data?.totalResults ?? 0}
        totalPages={data?.totalPages ?? 1}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
