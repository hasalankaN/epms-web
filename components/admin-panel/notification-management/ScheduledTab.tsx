"use client";

import { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { FilterSelections } from "@/components/common/filters/FilterModal";

import { ScheduledToolbar } from "./views/Scheduled/ScheduledToolbar";
import { ScheduledTable } from "./views/Scheduled/ScheduledTable";

export function ScheduledTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";

  const scheduledOn = searchParams.get("scheduledOn");
  const scheduledFor = searchParams.get("scheduledFor");
  const channelParam = searchParams.get("channel");
  const recipientParam = searchParams.get("recipient");

  const activeFilters = useMemo<FilterSelections>(() => {
    const selections: FilterSelections = {};

    if (scheduledOn) selections.scheduledOn = [scheduledOn];
    if (scheduledFor) selections.scheduledFor = [scheduledFor];
    if (channelParam) selections.channel = channelParam.split(",");
    if (recipientParam) selections.recipient = recipientParam.split(",");

    return selections;
  }, [scheduledOn, scheduledFor, channelParam, recipientParam]);

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

    params.delete("scheduledOn");
    params.delete("scheduledFor");
    params.delete("channel");
    params.delete("recipient");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      <ScheduledToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        isFilterModalOpen={isFilterModalOpen}
        onFilterModalOpenChange={setIsFilterModalOpen}
        activeFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
      <ScheduledTable
        currentPage={currentPage}
        onPageChange={handlePageChange}
        channels={channelParam}
      />
    </div>
  );
}
