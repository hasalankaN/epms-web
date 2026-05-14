"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { FilterSelections } from "@/components/common/filters/FilterModal";

import { ResponseTrackingToolbar } from "./views/ResponseTracking/ResponseTrackingToolbar";
import { ResponseTrackingTable } from "./views/ResponseTracking/ResponseTrackingTable";

export function ResponseTrackingTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";

  const status = searchParams.get("status");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const activeFilters = useMemo<FilterSelections>(() => {
    const selections: FilterSelections = {};

    if (status) selections.status = [status];
    
    if (fromParam || toParam) {
      selections.date = {
        start: fromParam ? new Date(fromParam) : null,
        end: toParam ? new Date(toParam) : null,
      };
    }

    return selections;
  }, [status, fromParam, toParam]);

  const [localSearch, setLocalSearch] = useState(search);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Debounce search
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
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleApplyFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("status");
    params.delete("from");
    params.delete("to");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      <ResponseTrackingToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        isFilterModalOpen={isFilterModalOpen}
        onFilterModalOpenChange={setIsFilterModalOpen}
        activeFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      <ResponseTrackingTable
        currentPage={currentPage}
        onPageChange={handlePageChange}
        search={search}
        status={status}
        dateFrom={fromParam ? new Date(fromParam) : undefined}
        dateTo={toParam ? new Date(toParam) : undefined}
      />
    </div>
  );
}
