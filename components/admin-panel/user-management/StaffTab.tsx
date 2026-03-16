"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { StaffDataType, MemberStatus } from "@/types/user-management";

import { StaffTableToolbar } from "./views/Staff/StaffTableToolbar";
import { StaffTable } from "./views/Staff/StaffTable";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";



export function StaffTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") as MemberStatus || undefined;
  const salaryStatus = searchParams.get("salaryStatus") || undefined;
  const branchId = searchParams.get("branch_id") || undefined;
  const role = searchParams.get("role") as "MEMBER" | "MANAGER" || undefined;
  const regDateFrom = searchParams.get("regDateFrom") || undefined;
  const regDateTo = searchParams.get("regDateTo") || undefined;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetStaff({
    page: currentPage,
    size: 10,
    search: search || undefined,
    status: status,
    salaryStatus: salaryStatus,
    branch_id: branchId,
    role: role,
    regDateFrom,
    regDateTo,
  });

  const data = useMemo(() => {
    if (!apiData?.results) return [];
    
    return apiData.results.map(item => ({
      id: item.userId,
      regDate: new Date(item.createdAt).toLocaleDateString("en-GB", { month: "2-digit", year: "2-digit" }),
      idNo: item.customId,
      name: `${item.firstName} ${item.lastName}`,
      phone: item.mobile,
      whatsApp: item.whatsapp || "-",
      email: item.email,
      privileges: item.privileges.length > 0 ? item.privileges[0].split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") : "None",
      commissions: item.commissionEarned || "0.00",
      district: item.branchName || "-",
      branch: item.branchName || "-",
      salaryStatus: item.salaryStatus || "PENDING",
      status: item.status,
      role: item.isBranchManager ? "Manager" : "",
      isBranchManager: item.isBranchManager,
    })) as StaffDataType[];
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

  const selectedStaff = useMemo(
    () => data.filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds]
  );

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} staff members`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one staff member");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected staff members`);
    console.log("Send SMS to:", selectedStaff);
  }, [selectedIds, selectedStaff]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one staff member");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected staff members`);
    console.log("Send WhatsApp to:", selectedStaff);
  }, [selectedIds, selectedStaff]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one staff member");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected staff members`);
    console.log("Send Email to:", selectedStaff);
  }, [selectedIds, selectedStaff]);

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
    params.delete("branch_id");
    params.delete("role");
    params.delete("regDateFrom");
    params.delete("regDateTo");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

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
        <StaffTableToolbar
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
            branch_id: branchId,
            role,
            regDateFrom,
            regDateTo,
          }}
        />
      </div>

      {/* Staff Table */}
      <div>
        <StaffTable
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
