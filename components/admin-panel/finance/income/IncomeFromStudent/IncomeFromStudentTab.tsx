"use client";

import React, { useState, useMemo } from "react";

import { IncomeStatsRow } from "./IncomeStatsRow";
import { IncomeFromStudentToolbar } from "./IncomeFromStudentToolbar";
import { IncomeFromStudentTable } from "./IncomeFromStudentTable";

import { mockIncomeFromStudentData } from "../mockData";

export function IncomeFromStudentTab() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});

  const handleApplyFilters = (filters: Record<string, string | null>) => {
    console.log("Filters applied:", filters);
    setActiveFilters((prev) => ({ ...prev, ...filters }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    console.log("Filters cleared");
    setActiveFilters({});
    setCurrentPage(1);
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
          onPageChange={setCurrentPage}
          totalResults={filteredData.length}
        />
      </div>
    </div>
  );
}

