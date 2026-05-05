"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

import Link from "next/link";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { BatchStatsRow } from "@/components/admin-panel/batch-management/BatchStatsRow";
import { BatchTableToolbar } from "@/components/admin-panel/batch-management/BatchTableToolbar";
import { BatchTable } from "@/components/admin-panel/batch-management/BatchTable";
import type { BatchDataType } from "@/types/batch";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";

export default function BatchManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || undefined;
  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || undefined;
  const branch_id = searchParams.get("branch_id") || undefined;
  const payment_type = searchParams.get("payment_type") || undefined;
  const level = searchParams.get("level") || undefined;
  const lecturer_id = searchParams.get("lecturer_id") || undefined;
  const start_date_from = searchParams.get("start_date_from") || undefined;
  const start_date_to = searchParams.get("start_date_to") || undefined;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetBatches({
    page: currentPage,
    size: 10,
    search: search || undefined,
    category,
    type,
    status,
    branch_id,
    payment_type,
    level,
    lecturer_id,
    start_date_from,
    start_date_to,
  });

  const data = useMemo(() => {
    if (!apiData?.results) return [];

    return apiData.results.map((item) => {
      // Helper to convert UPPERCASE/SNAKE_CASE to Title Case
      const toTitleCase = (str?: string) => {
        if (!str) return "-";
        
        return str
          .toLowerCase()
          .split(/[_\s]+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      };

      // Map API status (UPPERCASE) to Frontend status (Title Case)
      let displayStatus: BatchDataType["status"] = "Active";
      const apiStatus = item.status?.toUpperCase();
      
      if (apiStatus === "ACTIVE") displayStatus = "Active";
      else if (apiStatus === "UPCOMING") displayStatus = "Upcoming";
      else if (apiStatus === "COMPLETED") displayStatus = "Completed";
      else if (apiStatus === "INACTIVE") displayStatus = "Inactive";

      return {
        id: item.id,
        batchName: item.name,
        batchId: item.custom_id,
        type: toTitleCase(item.type),
        status: displayStatus,
        category: toTitleCase(item.category),
        payment: item.is_paid ? "Paid" : "Free",
        branch: item.branch_name || "-",
        lecturer: item.lecturer_name || item.lecturer_email || "-",
        startDate: item.start_date,
        endDate: item.end_date,
        studentsCount: item.student_count,
      };
    }) as BatchDataType[];
  }, [apiData]);

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
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} batches on this page`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one batch");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected batches`);
  }, [selectedIds]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one batch");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected batches`);
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
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("type");
    params.delete("status");
    params.delete("branch_id");
    params.delete("payment_type");
    params.delete("level");
    params.delete("lecturer_id");
    params.delete("start_date_from");
    params.delete("start_date_to");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onSendSMS: handleSendSMS,
      onSendEmail: handleSendEmail,
    }),
    [handleSelectAll, handleClearSelection, handleSendSMS, handleSendEmail]
  );

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-end gap-4">
        <Link
          href="/admin-panel/batch-management/add-new-batch"
          className={cn(
            BUTTON_STYLES.primary.md,
            "px-3 text-sm font-semibold text-white md:px-4"
          )}
        >
          <Plus className="h-5 w-5 md:hidden" />
          <span className="hidden md:inline">Add New Batch</span>
        </Link>
      </div>

      {/* Content Wrapper (Matches AllInquiries structure) */}
      <div className="flex flex-col gap-4">
        {/* Stats Row */}
        <BatchStatsRow />

        {/* Separator Line (24px below) */}
        <div className="mt-4 h-[1px] w-full bg-[#E2E8F0]" />

        {/* Table Toolbar (24px below separator) */}
        <div className="mt-4">
          <BatchTableToolbar
            bulkActions={bulkActions}
            selectedCount={selectedIds.length}
            totalCount={data.length}
            search={localSearch}
            onSearchChange={setLocalSearch}
            onApplyFilters={handleMultiFilterChange}
            onClearFilters={handleClearFilters}
            activeUrlFilters={{
              category,
              type,
              status,
              branch_id,
              payment_type,
              level,
              lecturer_id,
              start_date_from,
              start_date_to,
            }}
          />
        </div>

        {/* Batch Table (16px below toolbar) */}
        <div>
          <BatchTable
            data={data}
            isLoading={isLoading}
            isError={isError}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            totalResults={apiData?.totalResults || 0}
          />
        </div>
      </div>
    </div>
  );
}
