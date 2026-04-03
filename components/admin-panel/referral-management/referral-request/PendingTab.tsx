"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { PendingToolbar } from "./views/PendingToolbar";
import { PendingTable } from "./views/PendingTable";

// ===== MOCK DATA =====

export interface PendingRequestDataType {
  id: string;
  requestedDate: string;
  memberId: string;
  memberName: string;
  requestedAmount: string;
  requestedFor: string;
}

const mockPendingRequests: PendingRequestDataType[] = Array.from({ length: 45 }, (_, i) => ({
  id: `PR-${i + 1}`,
  requestedDate: "2026/01/21",
  memberId: `#12345`,
  memberName: "name",
  requestedAmount: "XXXX.00",
  requestedFor: "-",
}));

export function PendingTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

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
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleApplyFilters = useCallback((filters: Record<string, any>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (filters.date?.start) {
      params.set("dateFrom", filters.date.start.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (filters.date?.end) {
      params.set("dateTo", filters.date.end.toISOString());
    } else {
      params.delete("dateTo");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("search");
    params.set("page", "1");
    setLocalSearch("");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // ===== FILTERING =====
  const filteredData = useMemo(() => {
    return mockPendingRequests.filter((item) => {
      const matchesSearch = !search || 
        item.memberName.toLowerCase().includes(search.toLowerCase()) || 
        item.memberId.toLowerCase().includes(search.toLowerCase());
      
      return matchesSearch;
    });
  }, [search]);

  const itemsPerPage = 10;
  const totalResults = filteredData.length;
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="flex flex-col gap-4">
      <PendingToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeUrlFilters={{ dateFrom, dateTo }}
      />
      <PendingTable
        data={paginatedData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={totalResults}
      />
    </div>
  );
}
