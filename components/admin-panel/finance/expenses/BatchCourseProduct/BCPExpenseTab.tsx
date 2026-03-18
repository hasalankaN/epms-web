"use client";

import React from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { BCPExpenseToolbar } from "./BCPExpenseToolbar";
import { BCPExpenseTable } from "./BCPExpenseTable";
import type { BCPExpenseData } from "./BCPExpenseTable";

const mockBCPData: BCPExpenseData[] = Array.from({ length: 45 }).map((_, i) => {
  const sourceTypes = ["Batch Name", "Course Name", "Products Name"] as const;
  const transactionVias = ["BOC", "Cash", "Peoples"] as const;

  return {
    id: `BCP-${i + 1}`,
    date: `2026/01/${String((i % 28) + 1).padStart(2, "0")}`,
    expenseDescription: "Lorem ipsum",
    batchCourseProductName: sourceTypes[i % 3],
    amount: "X,XXX.00",
    branch: "Branch Name",
    transactionVia: transactionVias[i % 3],
    source: sourceTypes[i % 3].split(" ")[0].toLowerCase(),
  };
});

export function BCPExpenseTab() {
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
  const source = searchParams.get("source") || undefined;
  const transactionVia = searchParams.get("transactionVia") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  const activeUrlFilters = { source, transactionVia, dateFrom, dateTo };

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
    updateParams({ search: null, source: null, transactionVia: null, dateFrom: null, dateTo: null });
  };

  const filteredData = mockBCPData.filter((item) => {
    const matchesSearch = !search || item.batchCourseProductName.toLowerCase().includes(search.toLowerCase()) || item.expenseDescription.toLowerCase().includes(search.toLowerCase());
    const matchesSource = !source || item.source === source;
    const matchesVia = !transactionVia || item.transactionVia.toLowerCase() === transactionVia.toLowerCase();

    return matchesSearch && matchesSource && matchesVia;
  });

  return (
    <div className="mt-4 flex w-full flex-col space-y-4">
      <BCPExpenseToolbar
        search={search}
        onSearchChange={handleSearchChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeUrlFilters={activeUrlFilters}
      />
      <BCPExpenseTable
        data={filteredData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={filteredData.length}
      />
    </div>
  );
}
