"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";


import type { ComplaintType } from "@/types/complaint";

import { PendingAssignmentToolbar } from "./views/PendingAssignment/PendingAssignmentToolbar";
import { PendingAssignmentTable } from "./views/PendingAssignment/PendingAssignmentTable";
import { useGetPendingComplaints } from "@/hooks/api/complaints/useGetPendingComplaints";

export function PendingAssignment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") as ComplaintType || undefined;
  const dateStart = searchParams.get("date_start") || undefined;
  const dateEnd = searchParams.get("date_end") || undefined;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetPendingComplaints({
    page: currentPage,
    size: 10,
    search: search || undefined,
    type: type,
    date_start: dateStart,
    date_end: dateEnd,
    status: "PENDING", // By default for this tab
  });

  const data = useMemo(() => apiData?.data || [], [apiData?.data]);
  const totalResults = useMemo(() => apiData?.meta.total || 0, [apiData?.meta.total]);
  const totalPages = useMemo(() => apiData?.meta.last_page || 1, [apiData?.meta.last_page]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL search changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch.trim() !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
          params.set("search", localSearch.trim());
        } else {
          params.delete("search");
        }

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  // ===== HANDLERS =====
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleMultiFilterChange = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("type");
    params.delete("date_start");
    params.delete("date_end");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);


  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <PendingAssignmentToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        onApplyFilters={handleMultiFilterChange}
        onClearFilters={handleClearFilters}
        activeUrlFilters={{
          type,
          date_start: dateStart,
          date_end: dateEnd,
        }}
      />

      {/* Table */}
      <PendingAssignmentTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        totalResults={totalResults}
        totalPages={totalPages}
      />
    </div>
  );
}
