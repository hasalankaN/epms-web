"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { IncomeStatsRow } from "./IncomeStatsRow";
import { IncomeFromStudentToolbar } from "./IncomeFromStudentToolbar";
import { IncomeFromStudentTable } from "./IncomeFromStudentTable";

import { mockIncomeFromStudentData } from "../mockData";

export function IncomeFromStudentTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const itemsPerPage = 10;

  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});

  const handleApplyFilters = (filters: Record<string, string | null>) => {
    console.log("Filters applied:", filters);
    setActiveFilters((prev) => ({ ...prev, ...filters }));
    handlePageChange(1);
  };

  const handleClearFilters = () => {
    console.log("Filters cleared");
    setActiveFilters({});
    handlePageChange(1);
  };

  const filteredData = useMemo(() => {
    return mockIncomeFromStudentData.filter((item) => {
      // Date filter
      if (activeFilters.dateFrom || activeFilters.dateTo) {
        const itemDate = new Date(item.date);

        if (activeFilters.dateFrom && itemDate < new Date(activeFilters.dateFrom)) return false;

        if (activeFilters.dateTo && itemDate > new Date(activeFilters.dateTo)) return false;
      }

      // Source filter
      if (activeFilters.source && activeFilters.source !== item.source.toLowerCase()) return false;

      // Payment method filter
      if (activeFilters.paymentMethod && activeFilters.paymentMethod !== item.paymentMethod.toLowerCase().replace(" ", "_")) return false;

      // Payment type filter
      if (activeFilters.paymentType && activeFilters.paymentType !== item.paymentType.toLowerCase()) return false;

      // Payment via filter
      if (activeFilters.paymentVia && activeFilters.paymentVia !== item.paymentVia.toLowerCase()) return false;

      // Status filter
      if (activeFilters.status && activeFilters.status !== item.status.toLowerCase()) return false;

      return true;
    });
  }, [activeFilters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(start, start + itemsPerPage);
  }, [currentPage, filteredData]);

  return (
    <div className="space-y-4">
      <IncomeStatsRow />
      
      <div className="flex flex-col gap-4">
        <IncomeFromStudentToolbar
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          activeUrlFilters={activeFilters}
        />
        <IncomeFromStudentTable
          data={paginatedData}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={filteredData.length}
        />
      </div>
    </div>
  );
}

