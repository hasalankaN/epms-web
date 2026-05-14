"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { FilterSelections } from "@/components/common/filters/FilterModal";

import { SentToolbar } from "./views/Sent/SentToolbar";
import { SentTable } from "./views/Sent/SentTable";

export function SentTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";

  // URL-based filter state (simplified for mock implementation)
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");
  const recipientsParam = searchParams.get("recipients");
  const channelsParam = searchParams.get("channels");

  const activeFilters = useMemo<FilterSelections>(() => {
    const selections: FilterSelections = {};
    const recipients = recipientsParam?.split(",") || [];
    const channels = channelsParam?.split(",") || [];

    if (recipients.length > 0) selections.recipient = recipients;
    if (channels.length > 0) selections.channels = channels;
    
    if (fromDate || toDate) {
      selections.date = {
        start: fromDate ? new Date(fromDate) : null,
        end: toDate ? new Date(toDate) : null,
      };
    }

    return selections;
  }, [recipientsParam, channelsParam, fromDate, toDate]);

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

    params.delete("from");
    params.delete("to");
    params.delete("recipients");
    params.delete("channels");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      <SentToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        isFilterModalOpen={isFilterModalOpen}
        onFilterModalOpenChange={setIsFilterModalOpen}
        activeFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      <SentTable
        currentPage={currentPage}
        onPageChange={handlePageChange}
        dateFrom={fromDate}
        dateTo={toDate}
        channels={channelsParam}
      />
    </div>
  );
}
