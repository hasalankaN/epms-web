"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { ComplaintStatus, ComplaintType } from "@/types/complaint";

import { AllComplaintToolbar } from "./views/AllComplaints/AllComplaintToolbar";
import { AllComplaintTable } from "./views/AllComplaints/AllComplaintTable";
import { useGetComplaints } from "@/hooks/api/complaints/useGetComplaints";

export function AllComplaints() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") as ComplaintStatus || undefined;
  const type = searchParams.get("type") as ComplaintType || undefined;
  const assignee = searchParams.get("assignee") || undefined;
  const dateStart = searchParams.get("date_start") || undefined;
  const dateEnd = searchParams.get("date_end") || undefined;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetComplaints({
    page: currentPage,
    size: 10,
    search: search || undefined,
    status: status,
    type: type,
    assignee: assignee,
    date_start: dateStart,
    date_end: dateEnd,
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

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  // ===== HANDLERS =====
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} complaints`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one complaint");

      return;
    }

    toast.error(`Deleting ${selectedIds.length} selected complaint(s)`);
    setRowSelection({});
  }, [selectedIds]);

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

    params.delete("status");
    params.delete("type");
    params.delete("assignee");
    params.delete("date_start");
    params.delete("date_end");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onDelete: handleDelete,
    }),
    [handleSelectAll, handleClearSelection, handleDelete]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <AllComplaintToolbar
        bulkActions={bulkActions}
        selectedCount={selectedIds.length}
        totalCount={data.length}
        search={localSearch}
        onSearchChange={setLocalSearch}
        onApplyFilters={handleMultiFilterChange}
        onClearFilters={handleClearFilters}
        activeUrlFilters={{
          status,
          type,
          assignee,
          date_start: dateStart,
          date_end: dateEnd,
        }}
      />

      {/* Table */}
      <AllComplaintTable
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
