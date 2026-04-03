"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { StudentReferralsToolbar } from "./views/StudentReferralsToolbar";
import { StudentReferralsTable } from "./views/StudentReferralsTable";

// ===== MOCK DATA =====

export interface StudentReferralDataType {
  id: string;
  studentName: string;
  noOfStudents: string;
  noOfProducts: string;
  comTotal: string;
  status: "Active" | "Inactive";
}

const mockStudentReferrals: StudentReferralDataType[] = Array.from({ length: 45 }, (_, i) => ({
  id: `SR-${i + 1}`,
  studentName: "name",
  noOfStudents: "XXX",
  noOfProducts: "XXX",
  comTotal: "XXXX.00",
  status: i % 6 === 1 || i % 6 === 5 ? "Inactive" : "Active",
}));

export function StudentReferralsTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

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

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");
    params.set("page", "1");
    setLocalSearch("");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const filteredData = useMemo(() => {
    return mockStudentReferrals.filter((item) => {
      return !search || item.studentName.toLowerCase().includes(search.toLowerCase());
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
      <StudentReferralsToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        onClearFilters={handleClearFilters}
      />
      <StudentReferralsTable
        data={paginatedData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={totalResults}
      />
    </div>
  );
}
