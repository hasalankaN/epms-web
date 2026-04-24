"use client";

import React, { useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { format } from "date-fns";

import { GeneralExpenseToolbar } from "./GeneralExpenseToolbar";
import { GeneralExpenseTable } from "./GeneralExpenseTable";
import type { GeneralExpenseData } from "./GeneralExpenseTable";
import { useGetExpenses } from "@/hooks/api/finances/useGetExpenses";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

const PAGE_SIZE = 20;

export function GeneralExpenseTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const search = searchParams.get("search") || "";
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
    related_entity_type: "GENERAL",
    date_from: dateFrom,
    date_to: dateTo,
    transaction_via: transactionVia,
    search: search || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const rows: GeneralExpenseData[] = (data?.results ?? []).map((r) => ({
    id: r.id,
    date: r.date ? format(new Date(r.date), "yyyy/MM/dd") : "—",
    expenseDescription: r.description,
    amount: `LKR ${Number(r.amount).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
    transactionVia: r.transaction_via,
    branch: "—",
  }));

  const handleExport = () => {
    const params = new URLSearchParams({
      related_entity_type: "GENERAL",
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
      ...(transactionVia ? { transaction_via: transactionVia } : {}),
      ...(search ? { search } : {}),
    });

    window.open(`${API_ENDPOINTS.finances.EXPENSES_EXPORT}?${params.toString()}`, "_blank");
  };

  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <GeneralExpenseToolbar
        search={search}
        onSearchChange={(v) => updateParams({ search: v || null })}
        onApplyFilters={(filters) => updateParams(filters)}
        onClearFilters={() => updateParams({ search: null, transactionVia: null, dateFrom: null, dateTo: null })}
        activeUrlFilters={{ transactionVia, dateFrom, dateTo }}
        onExport={handleExport}
      />
      <GeneralExpenseTable
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
