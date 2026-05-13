"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { CompletedToolbar } from "./views/CompletedToolbar";
import { CompletedTable } from "./views/CompletedTable";
import { useGetReferralPaymentRequests } from "@/hooks/api/referrals/useGetReferralPaymentRequests";

export interface CompletedRequestDataType {
  id: string;
  requestedDate: string;
  paidDate: string;
  memberId: string;
  memberName: string;
  requestedAmount: string;
  bankSlipUrl: string;
}

export function CompletedTab() {
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

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleApplyFilters = useCallback(
    (filters: Record<string, any>) => {
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
    },
    [searchParams, pathname, router],
  );

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("search");
    params.set("page", "1");
    setLocalSearch("");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  // ===== API =====
  const { data, isLoading } = useGetReferralPaymentRequests("COMPLETED", {
    page: currentPage,
    size: 10,
    search: search || undefined,
    requested_date: dateFrom,
  });

  const tableData: CompletedRequestDataType[] = (data?.results ?? []).map(
    (row) => ({
      id: row.id,
      requestedDate: row.requested_date
        ? new Date(row.requested_date).toLocaleDateString("en-CA")
        : "-",
      paidDate: row.paid_date
        ? new Date(row.paid_date).toLocaleDateString("en-CA")
        : "-",
      memberId: row.member_code,
      memberName: row.member_name,
      requestedAmount: row.requested_amount,
      bankSlipUrl: row.bank_slip ?? "",
    }),
  );

  const totalResults = data?.totalResults ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <CompletedToolbar
        search={localSearch}
        onSearchChange={setLocalSearch}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeUrlFilters={{ dateFrom, dateTo }}
      />
      <CompletedTable
        data={tableData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={totalResults}
        isLoading={isLoading}
      />
    </div>
  );
}
