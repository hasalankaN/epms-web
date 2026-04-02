"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ReferralStaffToolbar } from "./views/ReferralStaffToolbar";
import { ReferralStaffTable } from "./views/ReferralStaffTable";
import { useGetReferralAgents } from "@/hooks/api/referrals/useGetReferralAgents";
import type { ReferralAgentDataType } from "@/types/referral";

export function ReferralStaffTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;
  const district = searchParams.get("district") || undefined;

  const { data: apiData, isLoading, isError } = useGetReferralAgents({
    page: currentPage,
    size: 10,
    search: search || undefined,
    status: status,
    district: district,
  });

  const data = useMemo(() => {
    if (!apiData?.results) return [];
    
    return apiData.results.map(item => ({
      id: item.id,
      regDate: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB").replace(/\//g, ".") : "-",
      idNo: item.member_code,
      name: `${item.first_name} ${item.last_name}`,
      phone: "-", 
      whatsApp: "-",
      email: "-", 
      commissions: item.commission_total || "0",
      district: item.district || "-",
      status: item.status,
      isTeamLeader: item.role === "LEADER",
      noOfStudents: item.students_count || 0,
      noOfProducts: item.products_count || 0,
    })) as ReferralAgentDataType[];
  }, [apiData]);

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

  const handleApplyFilters = useCallback((filters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filters).forEach(([key, value]) => {
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

    params.delete("status");
    params.delete("district");
    params.delete("search");
    params.set("page", "1");
    setLocalSearch("");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      <ReferralStaffToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeUrlFilters={{ status, district }}
      />
      <ReferralStaffTable
        data={data}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={apiData?.totalResults || 0}
      />
    </div>
  );
}
