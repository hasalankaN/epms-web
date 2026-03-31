"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ReferralStaffToolbar } from "./views/ReferralStaffToolbar";
import { ReferralStaffTable } from "./views/ReferralStaffTable";

// ===== MOCK DATA =====

const DISTRICTS = ["Colombo", "Kandy", "Gampaha", "Anuradhapura", "Matara", "Galle"];

export interface ReferralStaffDataType {
  id: string;
  addedDate: string;
  memberId: string;
  memberName: string;
  isTeamLeader: boolean;
  district: string;
  noOfStudents: string;
  noOfProducts: string;
  comTotal: string;
  status: "Active" | "Inactive";
}

const mockReferralStaff: ReferralStaffDataType[] = Array.from({ length: 45 }, (_, i) => ({
  id: `RS-${i + 1}`,
  addedDate: "2026/01/21",
  memberId: "#12345",
  memberName: i % 5 === 1 ? "Amali Perera" : "name",
  isTeamLeader: i % 5 === 1 || i % 5 === 4,
  district: DISTRICTS[i % DISTRICTS.length],
  noOfStudents: "XXX",
  noOfProducts: "XXX",
  comTotal: "XXXX.00",
  status: i % 4 === 3 ? "Inactive" : "Active",
}));

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

  // ===== FILTERING =====
  const filteredData = useMemo(() => {
    return mockReferralStaff.filter((item) => {
      const matchesSearch =
        !search ||
        item.memberName.toLowerCase().includes(search.toLowerCase()) ||
        item.memberId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !status || item.status === status;
      const matchesDistrict = !district || item.district === district;

      return matchesSearch && matchesStatus && matchesDistrict;
    });
  }, [search, status, district]);

  const itemsPerPage = 10;
  const totalResults = filteredData.length;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

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
        data={paginatedData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={totalResults}
      />
    </div>
  );
}
