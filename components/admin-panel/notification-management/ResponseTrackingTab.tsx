"use client";

import { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ResponseTrackingToolbar } from "./views/ResponseTracking/ResponseTrackingToolbar";
import { ResponseTrackingTable } from "./views/ResponseTracking/ResponseTrackingTable";

export function ResponseTrackingTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("r_page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("r_page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleFilterSelect = (_key: string, _value: string, label: string) => {
    setStatus(label);
  };

  const handleDateApply = (start: Date | null, end: Date | null) => {
    setFromDate(start);
    setToDate(end);
    console.log("Date filter applied:", { start, end });
  };

  const handleClearFilters = useCallback(() => {
    setStatus(null);
    setFromDate(null);
    setToDate(null);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <ResponseTrackingToolbar
        search={search}
        onSearchChange={setSearch}
        statusValue={status}
        onFilterSelect={handleFilterSelect}
        onDateApply={handleDateApply}
        onClearFilters={handleClearFilters}
        fromDate={fromDate ?? undefined}
        toDate={toDate ?? undefined}
      />
      <ResponseTrackingTable currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}
