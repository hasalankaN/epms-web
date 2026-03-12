"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { LecturerDataType, SalaryStatus } from "@/types/user-management";

import { LecturerTableToolbar } from "./views/Lecturer/LecturerTableToolbar";
import { LecturerTable } from "./views/Lecturer/LecturerTable";
import { useGetLecturers } from "@/hooks/api/lecturers/useGetLecturers";

export function LecturerTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;
  const salaryStatus = searchParams.get("salaryStatus") || undefined;
  const fromDate = searchParams.get("from") || undefined;
  const toDate = searchParams.get("to") || undefined;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetLecturers({
    page: currentPage,
    size: 10,
    search: search || undefined,
    status: status,
    salary_payment_status: salaryStatus,
    from: fromDate,
    to: toDate,
  });

  const data = useMemo(() => {
    if (!apiData?.results) return [];
    
    // Transform API data to match UI type LecturerDataType
    return apiData.results.map(item => ({
      id: item.user_id,
      regDate: new Date(item.created_at).toLocaleDateString(),
      idNo: `#${item.user_id.substring(0, 6)}`, // Fallback since API doesn't seem to return idNo
      name: `${item.first_name} ${item.last_name}`,
      phone: item.mobile_number,
      whatsApp: item.whatsapp_number || "-",
      email: item.email,
      salaryType: item.salary_type || "-",
      salaryStatus: (item.salary_payment_status as SalaryStatus) || "NO_RECORD",
      status: item.status,
    })) as LecturerDataType[];
  }, [apiData]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const selectedLecturers = useMemo(
    () => data.filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds]
  );

  // ===== HANDLERS =====
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL search changes (e.g. back button)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if localSearch differs from URL search
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

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

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
    params.delete("salaryStatus");
    params.delete("from");
    params.delete("to");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} lecturers`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one lecturer");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected lecturers`);
    console.log("Send SMS to:", selectedLecturers);
  }, [selectedIds, selectedLecturers]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one lecturer");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected lecturers`);
    console.log("Send WhatsApp to:", selectedLecturers);
  }, [selectedIds, selectedLecturers]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one lecturer");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected lecturers`);
    console.log("Send Email to:", selectedLecturers);
  }, [selectedIds, selectedLecturers]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onSendSMS: handleSendSMS,
      onSendWhatsapp: handleSendWhatsapp,
      onSendEmail: handleSendEmail,
    }),
    [handleSelectAll, handleClearSelection, handleSendSMS, handleSendWhatsapp, handleSendEmail]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <div>
        <LecturerTableToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={data.length}
          search={localSearch}
          onSearchChange={setLocalSearch}
          onApplyFilters={handleMultiFilterChange}
          onClearFilters={handleClearFilters}
          activeUrlFilters={{
            status,
            salaryStatus,
            from: fromDate,
            to: toDate,
          }}
        />
      </div>

      {/* Lecturer Table */}
      <div>
        <LecturerTable
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
  );
}
