"use client";

import React from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { GeneralExpenseToolbar } from "./GeneralExpenseToolbar";
import { GeneralExpenseTable } from "./GeneralExpenseTable";
import type { GeneralExpenseData } from "./GeneralExpenseTable";

const mockGeneralData: GeneralExpenseData[] = Array.from({ length: 45 }).map((_, i) => {
  const transactionVias = ["BOC", "Cash", "Peoples"] as const;

  return {
    id: `GEN-${i + 1}`,
    date: `2026/01/${String((i % 28) + 1).padStart(2, "0")}`,
    expenseDescription: "Lorem ipsum",
    amount: "X,XXX.00",
    transactionVia: transactionVias[i % 3],
    branch: "Branch Name",
  };
});

export function GeneralExpenseTab() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const search = searchParams.get("search") || "";
  const transactionVia = searchParams.get("transactionVia") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  const activeUrlFilters = { transactionVia, dateFrom, dateTo };

  const updateParams = (updates: Record<string, string | null>) => {
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
  };

  const handleSearchChange = (value: string) => {
    updateParams({ search: value || null });
  };

  const handleApplyFilters = (filters: Record<string, string | null>) => {
    updateParams(filters);
  };

  const handleClearFilters = () => {
    updateParams({ search: null, transactionVia: null, dateFrom: null, dateTo: null });
  };

  const filteredData = mockGeneralData.filter((item) => {
    const matchesSearch = !search || item.expenseDescription.toLowerCase().includes(search.toLowerCase());
    const matchesVia = !transactionVia || item.transactionVia.toLowerCase() === transactionVia.toLowerCase();

    return matchesSearch && matchesVia;
  });

  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <GeneralExpenseToolbar
        search={search}
        onSearchChange={handleSearchChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeUrlFilters={activeUrlFilters}
      />
      <GeneralExpenseTable
        data={filteredData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={filteredData.length}
      />
    </div>
  );
}
