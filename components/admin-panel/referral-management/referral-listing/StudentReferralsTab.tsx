"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { StudentReferralsToolbar } from "./views/StudentReferralsToolbar";
import { StudentReferralsTable } from "./views/StudentReferralsTable";
import { useGetReferralStudents } from "@/hooks/api/referrals/useGetReferralStudents";

export interface StudentReferralDataType {
  id: string;
  studentName: string;
  noOfStudents: string;
  noOfProducts: string;
  comTotal: string;
  status: "ACTIVE" | "INACTIVE" | string;
}

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

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");
    params.set("page", "1");
    setLocalSearch("");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const { data, isLoading } = useGetReferralStudents({
    page: currentPage,
    size: 10,
    search: search || undefined,
  });

  const tableData: StudentReferralDataType[] = (data?.results ?? []).map((row) => ({
    id: row.id,
    studentName: row.student_name || "—",
    noOfStudents: String(row.students_referred ?? 0),
    noOfProducts: String(row.products ?? 0),
    comTotal: Number(row.commission_total || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    status: row.status,
  }));

  return (
    <div className="flex flex-col gap-4">
      <StudentReferralsToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        onClearFilters={handleClearFilters}
      />
      <StudentReferralsTable
        data={tableData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data?.totalResults ?? 0}
        isLoading={isLoading}
      />
    </div>
  );
}
